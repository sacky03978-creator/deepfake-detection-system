import os
import signal
import sys
import time
import json
import logging
from datetime import datetime
from typing import Optional

from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker
from confluent_kafka import KafkaError

from .config import settings
from .models import Base, Job
from .kafka_utils import create_consumer, KafkaProducer
from .processor import process_job

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
    stream=sys.stdout,
)
logger = logging.getLogger("preprocessing-worker")

# Database setup
engine = create_engine(settings.db_url, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine)
Base.metadata.create_all(bind=engine)

# Kafka setup
consumer = create_consumer(settings.kafka_bootstrap, settings.consumer_group)
consumer.subscribe([settings.topic_video_submitted])
producer = KafkaProducer(settings.kafka_bootstrap)

_running = True

def handle_signal(signum, frame):
    global _running
    logger.info("Received signal %s, shutting down...", signum)
    _running = False

signal.signal(signal.SIGINT, handle_signal)
signal.signal(signal.SIGTERM, handle_signal)


def update_job_status(db, job: Job, status: str, error: Optional[str] = None, artifacts: Optional[dict] = None):
    job.status = status
    if error:
        job.error_message = (error[:2000] if error else None)
    if artifacts:
        try:
            job.artifacts_json = json.dumps(artifacts)
        except Exception:
            pass
    job.updated_at = datetime.utcnow()
    db.add(job)
    db.commit()


def process_message(payload: dict):
    job_id = payload.get("job_id")
    s3_url = payload.get("s3_url")
    if not job_id or not s3_url:
        logger.warning("Invalid message payload: %s", payload)
        return

    db = SessionLocal()
    try:
        job: Job | None = db.execute(select(Job).where(Job.job_id == job_id)).scalar_one_or_none()
        if not job:
            # Create a minimal placeholder if job table not written yet (shouldn't happen)
            job = Job(job_id=job_id, status="submitted", s3_url=s3_url)
            db.add(job)
            db.commit()
            db.refresh(job)

        if job.status in ("preprocessed", "failed"):
            logger.info("Job %s already in terminal state %s, skipping", job_id, job.status)
            return

        update_job_status(db, job, "preprocessing")
        logger.info("Preprocessing job %s from %s", job_id, s3_url)

        artifacts, metadata = process_job(job_id, s3_url)

        artifacts_dict = {
            "job_id": job_id,
            "video": artifacts.video_s3,
            "audio": artifacts.audio_s3,
            "frames": artifacts.frames_s3,
            "metadata": artifacts.metadata_s3,
        }

        update_job_status(db, job, "preprocessed", artifacts=artifacts_dict)

        out_msg = {
            "job_id": job_id,
            "artifacts": artifacts_dict,
        }
        producer.publish(settings.topic_video_preprocessed, out_msg, key=job_id)
        logger.info("Job %s preprocessed successfully", job_id)

    except Exception as e:
        logger.exception("Failed to preprocess job %s: %s", job_id, e)
        try:
            # Best-effort update
            job = db.execute(select(Job).where(Job.job_id == job_id)).scalar_one_or_none()
            if job:
                update_job_status(db, job, "failed", error=str(e))
        except Exception:
            db.rollback()
    finally:
        db.close()


def main():
    logger.info(
        "Starting preprocessing worker. bootstrap=%s topic=%s group=%s",
        settings.kafka_bootstrap,
        settings.topic_video_submitted,
        settings.consumer_group,
    )
    poll_timeout = 1.0
    while _running:
        msg = consumer.poll(poll_timeout)
        if msg is None:
            continue
        if msg.error():
            if msg.error().code() == KafkaError._PARTITION_EOF:
                continue
            logger.error("Kafka consumer error: %s", msg.error())
            continue
        try:
            payload = json.loads(msg.value().decode("utf-8"))
        except Exception:
            logger.error("Invalid JSON payload: %r", msg.value())
            consumer.commit(message=msg, asynchronous=False)
            continue

        process_message(payload)
        # Commit after processing to avoid reprocessing
        consumer.commit(message=msg, asynchronous=False)

    logger.info("Flushing producer and closing consumer...")
    try:
        producer.flush()
    except Exception:
        pass
    try:
        consumer.close()
    except Exception:
        pass


if __name__ == "__main__":
    main()
