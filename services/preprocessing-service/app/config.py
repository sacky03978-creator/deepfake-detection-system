from pydantic import BaseModel
import os

class Settings(BaseModel):
    # Database
    db_url: str = os.getenv("DATABASE_URL", "postgresql://user:pass@postgres:5432/app")

    # AWS S3
    aws_region: str = os.getenv("AWS_REGION", "us-east-1")
    s3_bucket: str = os.getenv("S3_BUCKET", "deepguard-ingestion")
    s3_preproc_prefix: str = os.getenv("S3_PREPROC_PREFIX", "preprocessed")

    # Kafka
    kafka_bootstrap: str = os.getenv("KAFKA_BOOTSTRAP", "kafka:9092")
    topic_video_submitted: str = os.getenv("TOPIC_VIDEO_SUBMITTED", "video.submitted")
    topic_video_preprocessed: str = os.getenv("TOPIC_VIDEO_PREPROCESSED", "video.preprocessed")
    consumer_group: str = os.getenv("KAFKA_CONSUMER_GROUP", "preprocessing-workers")

    # Processing controls
    frame_rate: float = float(os.getenv("FRAME_RATE", "1"))  # frames per second to extract
    max_frames: int = int(os.getenv("MAX_FRAMES", "120"))  # cap extraction cost
    face_detect_sample: int = int(os.getenv("FACE_DETECT_SAMPLE", "30"))  # run face detection for N frames max

    # Paths
    work_dir: str = os.getenv("WORK_DIR", "/tmp/preproc")

settings = Settings()  # type: ignore
