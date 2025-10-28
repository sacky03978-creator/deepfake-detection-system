import boto3
from botocore.client import Config
from .config import settings
from datetime import datetime
from urllib.parse import urljoin

_session = boto3.session.Session(region_name=settings.aws_region)
s3 = _session.client('s3', config=Config(s3={'addressing_style': 'path'}))


def put_object(fileobj, bucket: str, key: str, content_type: str | None = None) -> str:
    extra = {'ContentType': content_type} if content_type else {}
    s3.upload_fileobj(fileobj, bucket, key, ExtraArgs=extra)  # type: ignore
    return f"s3://{bucket}/{key}"


def make_key(user_or_org: str, job_id: str, filename: str) -> str:
    ts = datetime.utcnow().strftime('%Y%m%dT%H%M%SZ')
    return f"{settings.s3_prefix}/{user_or_org}/{job_id}/{ts}/{filename}"
