from fastapi import FastAPI, UploadFile, File, Form, Header, HTTPException, Request
from fastapi.responses import ORJSONResponse
from starlette.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from tempfile import SpooledTemporaryFile
import io
import os
import json
from typing import Optional

from .config import settings
from .models import Base, Job
from .s3_utils import put_object, make_key
from .kafka_utils import KafkaProducer
from .security import validate_jwt, verify_api_key, AuthError

try:
    import clamd
except Exception:  # pragma: no cover
    clamd = None  # type: ignore

engine = create_engine(settings.db_url, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine)
Base.metadata.create_all(bind=engine)

producer = KafkaProducer(settings.kafka_bootstrap)

app = FastAPI(default_response_class=ORJSONResponse, title="video-ingestion-service")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST", "OPTIONS"],
    allow_headers=["*"]
)

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}

async def authorize(authorization: Optional[str], x_api_key: Optional[str]) -> dict:
    # Prefer JWT if present, otherwise API key
    if authorization:
        claims = await validate_jwt(authorization)
        return {"user_id": int(claims.get("uid", 0)), "role": claims.get("role", "user")}
    if x_api_key:
        verified = await verify_api_key(x_api_key)
        return {"user_id": int(verified.get("user_id", 0)), "role": verified.get("role", "user")}
    raise HTTPException(status_code=401, detail="Unauthorized")

async def scan_for_viruses(tmp: SpooledTemporaryFile) -> None:
    if not clamd or not settings.clamav_host:
        return
    tmp.seek(0)
    cd = clamd.ClamdNetworkSocket(settings.clamav_host, settings.clamav_port)
    res = cd.instream(tmp)
    status = res.get('stream', [None, None])[0]
    if status == 'FOUND':
        raise HTTPException(status_code=400, detail="malware_detected")
    tmp.seek(0)

@app.post("/api/v1/detect")
async def detect(
    request: Request,
    file: UploadFile | None = File(default=None),
    metadata: Optional[str] = Form(default=None),
    content_type: Optional[str] = Form(default=None),
    authorization: Optional[str] = Header(default=None),
    x_api_key: Optional[str] = Header(default=None),
):
    # Auth
    try:
        identity = await authorize(authorization, x_api_key)
    except AuthError:
        raise HTTPException(status_code=401, detail="Unauthorized")

    db = SessionLocal()
    try:
        # Prepare job record
        job = Job(status="submitted")
        job.user_id = identity.get("user_id")

        # If multipart upload with file
        s3_url: Optional[str] = None
        if file is not None:
            # Enforce size limit by spooling to disk after 100MB
            spooled: SpooledTemporaryFile = SpooledTemporaryFile(max_size=100 * 1024 * 1024)
            total = 0
            while True:
                chunk = await file.read(1024 * 1024)
                if not chunk:
                    break
                total += len(chunk)
                if total > settings.max_upload_bytes:
                    raise HTTPException(status_code=413, detail="file_too_large")
                spooled.write(chunk)
            spooled.seek(0)

            # Optional AV scan
            await scan_for_viruses(spooled)

            # Upload to S3
            filename = os.path.basename(file.filename or "upload.bin")
            key = make_key(f"user-{job.user_id or 'anon'}", job.job_id, filename)
            content_type_hdr = file.content_type or "application/octet-stream"
            s3_url = put_object(spooled, settings.s3_bucket, key, content_type_hdr)

            job.file_name = filename
            job.file_size_bytes = total
            job.content_type = (content_type or (file.content_type.split("/")[0] if file.content_type else None))
            job.s3_url = s3_url

        else:
            # Accept JSON body forwarded by gateway
            if request.headers.get("content-type", "").startswith("application/json"):
                try:
                    data = await request.json()
                except Exception:
                    raise HTTPException(status_code=400, detail="invalid_json")
                # Support both s3_url and file_url (must be s3://)
                s3_url = data.get("s3_url") or data.get("file_url")
                ct = data.get("content_type")
                md = data.get("metadata") or {}
                if not s3_url or not isinstance(s3_url, str) or not s3_url.startswith("s3://"):
                    raise HTTPException(status_code=400, detail="s3_url_required")
                if ct and ct not in ("video", "image", "audio"):
                    raise HTTPException(status_code=400, detail="invalid_content_type")
                job.content_type = ct
                job.file_name = (md.get("file_name") if isinstance(md, dict) else None)
                job.file_size_bytes = (md.get("file_size_bytes") if isinstance(md, dict) else None)
                job.s3_url = s3_url
            else:
                raise HTTPException(status_code=415, detail="multipart_or_json_required")

        # Persist job
        db.add(job)
        db.commit()
        db.refresh(job)

        # Publish to Kafka
        payload = {"job_id": job.job_id, "s3_url": job.s3_url}
        producer.publish(settings.topic_video_submitted, payload, key=job.job_id)

        return {"job_id": job.job_id}
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()