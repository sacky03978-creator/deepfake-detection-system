import os
import boto3
from botocore.client import Config
from urllib.parse import urlparse
from .config import settings

_session = boto3.session.Session(region_name=settings.aws_region)
s3 = _session.client("s3", config=Config(s3={"addressing_style": "path"}))

def parse_s3_url(s3_url: str) -> tuple[str, str]:
    if not s3_url.startswith("s3://"):
        raise ValueError("invalid s3 url")
    u = urlparse(s3_url)
    bucket = u.netloc
    key = u.path.lstrip("/")
    if not bucket or not key:
        raise ValueError("invalid s3 url components")
    return bucket, key


def download_to_path(s3_url: str, dest_path: str):
    bucket, key = parse_s3_url(s3_url)
    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    s3.download_file(bucket, key, dest_path)


def upload_file(local_path: str, bucket: str, key: str, content_type: str | None = None) -> str:
    extra = {"ContentType": content_type} if content_type else {}
    s3.upload_file(local_path, bucket, key, ExtraArgs=extra)  # type: ignore
    return f"s3://{bucket}/{key}"


def make_key(job_id: str, *parts: str) -> str:
    safe_parts = [p.strip("/") for p in parts if p]
    return f"{settings.s3_preproc_prefix}/{job_id}/" + "/".join(safe_parts)
