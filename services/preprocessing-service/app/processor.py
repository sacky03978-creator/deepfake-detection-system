import os
import json
import shutil
import subprocess
from dataclasses import dataclass
from typing import Dict, List, Tuple

from PIL import Image
import imagehash
import numpy as np

try:
    import insightface  # uses RetinaFace by default in FaceAnalysis
except Exception:  # pragma: no cover
    insightface = None  # type: ignore

from .config import settings
from .s3_utils import download_to_path, upload_file, make_key


@dataclass
class Artifacts:
    video_s3: str
    audio_s3: str
    frames_s3: List[str]
    metadata_s3: str


def _run_ffmpeg(args: List[str]) -> None:
    cmd = ["ffmpeg", "-y", "-hide_banner", "-loglevel", "error"] + args
    subprocess.run(cmd, check=True)


def standardize_video(src_path: str, dst_path: str) -> None:
    # H.264 mp4, 30fps, yuv420p, limit bitrate to keep size reasonable
    _run_ffmpeg([
        "-i", src_path,
        "-vf", "scale='min(1280,iw)':-2",  # cap width at 1280, keep aspect
        "-r", "30",
        "-c:v", "libx264",
        "-preset", "veryfast",
        "-profile:v", "baseline",
        "-pix_fmt", "yuv420p",
        "-b:v", "2000k",
        "-movflags", "+faststart",
        "-an",
        dst_path,
    ])


def extract_frames(src_path: str, frames_dir: str, fps: float, max_frames: int) -> List[str]:
    os.makedirs(frames_dir, exist_ok=True)
    pattern = os.path.join(frames_dir, "frame_%05d.jpg")
    # Use fps filter and cap number of frames with -frames:v
    _run_ffmpeg([
        "-i", src_path,
        "-vf", f"fps={fps},scale=224:224:flags=lanczos",
        "-frames:v", str(max_frames),
        "-q:v", "2",
        pattern,
    ])
    files = sorted([os.path.join(frames_dir, f) for f in os.listdir(frames_dir) if f.endswith(".jpg")])
    return files


def extract_audio(src_path: str, audio_path: str) -> None:
    _run_ffmpeg([
        "-i", src_path,
        "-vn",
        "-ac", "1",
        "-ar", "16000",
        "-f", "wav",
        audio_path,
    ])


def detect_faces(frames: List[str], max_samples: int) -> Dict[str, List[Dict]]:
    results: Dict[str, List[Dict]] = {}
    if not frames:
        return results
    if insightface is None:
        return results
    fa = insightface.app.FaceAnalysis(name="buffalo_l")
    fa.prepare(ctx_id=0, det_size=(224, 224))
    sample_frames = frames[:max_samples]
    for fp in sample_frames:
        img = np.array(Image.open(fp).convert("RGB"))
        faces = fa.get(img)
        items = []
        for f in faces:
            box = f.bbox.astype(float).tolist()
            kps = f.kps.astype(float).tolist() if hasattr(f, "kps") else []
            items.append({"bbox": box, "kps": kps, "det_score": float(getattr(f, "det_score", 0))})
        results[os.path.basename(fp)] = items
    return results


def compute_phash(frames: List[str]) -> Dict[str, str]:
    out: Dict[str, str] = {}
    for fp in frames:
        try:
            with Image.open(fp) as im:
                im = im.convert("RGB")
                h = imagehash.phash(im)
                out[os.path.basename(fp)] = str(h)
        except Exception:
            continue
    return out


def write_json(path: str, data: dict) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def upload_artifacts(job_id: str, local_video: str, local_audio: str, local_frames: List[str], local_meta: str) -> Artifacts:
    video_key = make_key(job_id, "video", "standard.mp4")
    audio_key = make_key(job_id, "audio", "audio.wav")
    frames_keys = [make_key(job_id, "frames", os.path.basename(p)) for p in local_frames]
    meta_key = make_key(job_id, "metadata", "metadata.json")

    video_s3 = upload_file(local_video, settings.s3_bucket, video_key, "video/mp4")
    audio_s3 = upload_file(local_audio, settings.s3_bucket, audio_key, "audio/wav")

    frames_s3: List[str] = []
    for lp, key in zip(local_frames, frames_keys):
        frames_s3.append(upload_file(lp, settings.s3_bucket, key, "image/jpeg"))

    metadata_s3 = upload_file(local_meta, settings.s3_bucket, meta_key, "application/json")

    return Artifacts(video_s3=video_s3, audio_s3=audio_s3, frames_s3=frames_s3, metadata_s3=metadata_s3)


def process_job(job_id: str, s3_url: str) -> Tuple[Artifacts, dict]:
    # Prepare workspace
    job_dir = os.path.join(settings.work_dir, job_id)
    if os.path.isdir(job_dir):
        shutil.rmtree(job_dir, ignore_errors=True)
    os.makedirs(job_dir, exist_ok=True)

    src_video = os.path.join(job_dir, "input")
    std_video = os.path.join(job_dir, "standard.mp4")
    audio_path = os.path.join(job_dir, "audio.wav")
    frames_dir = os.path.join(job_dir, "frames")
    meta_path = os.path.join(job_dir, "metadata.json")

    # Download source video from S3
    download_to_path(s3_url, src_video)

    # Standardize
    standardize_video(src_video, std_video)

    # Extract frames and audio
    frames = extract_frames(std_video, frames_dir, fps=settings.frame_rate, max_frames=settings.max_frames)
    extract_audio(std_video, audio_path)

    # Face detection (sampled)
    faces = detect_faces(frames, settings.face_detect_sample)

    # Perceptual hashes
    phashes = compute_phash(frames)

    # Metadata bundle
    metadata = {
        "job_id": job_id,
        "source_s3": s3_url,
        "video": {
            "standardized": "standard.mp4",
        },
        "audio": {
            "path": "audio.wav",
            "sample_rate": 16000,
            "channels": 1,
        },
        "frames": {
            "count": len(frames),
            "size": [224, 224],
            "fps": settings.frame_rate,
        },
        "faces": faces,
        "phash": phashes,
    }
    write_json(meta_path, metadata)

    # Upload artifacts
    artifacts = upload_artifacts(job_id, std_video, audio_path, frames, meta_path)

    return artifacts, metadata
