from pydantic import BaseModel, Field
import os
from datetime import timedelta

class Settings(BaseModel):
    # HTTP
    host: str = os.getenv("HOST", "0.0.0.0")
    port: int = int(os.getenv("PORT", "9000"))

    # Auth service integration
    auth_service_base_url: str = os.getenv("AUTH_SERVICE_BASE_URL", "http://auth-service:8080")
    internal_secret: str = os.getenv("INTERNAL_SECRET", "")
    jwks_url: str = os.getenv("JWKS_URL", f"{os.getenv('AUTH_SERVICE_BASE_URL', 'http://auth-service:8080')}/v1/.well-known/jwks.json")
    issuer: str = os.getenv("JWT_ISSUER", "auth-service")

    # S3
    aws_region: str = os.getenv("AWS_REGION", "us-east-1")
    s3_bucket: str = os.getenv("S3_BUCKET", "deepguard-ingestion")
    s3_prefix: str = os.getenv("S3_PREFIX", "raw")

    # Postgres
    db_url: str = os.getenv("DATABASE_URL", "postgresql://user:pass@postgres:5432/app")

    # Kafka
    kafka_bootstrap: str = os.getenv("KAFKA_BOOTSTRAP", "kafka:9092")
    topic_video_submitted: str = os.getenv("TOPIC_VIDEO_SUBMITTED", "video.submitted")

    # Security / limits
    max_upload_bytes: int = int(os.getenv("MAX_UPLOAD_BYTES", str(2 * 1024 * 1024 * 1024)))  # 2GB
    allowed_mime_prefixes: list[str] = [
        "video/", "image/", "audio/"
    ]

    # Virus scan
    clamav_host: str | None = os.getenv("CLAMAV_HOST")
    clamav_port: int = int(os.getenv("CLAMAV_PORT", "3310"))

settings = Settings()  # type: ignore
