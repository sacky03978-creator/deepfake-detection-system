from confluent_kafka import Producer
from typing import Any
import json

class KafkaProducer:
    def __init__(self, bootstrap: str):
        self._producer = Producer({
            'bootstrap.servers': bootstrap,
            'enable.idempotence': True,
            'acks': 'all',
            'linger.ms': 10,
            'compression.type': 'zstd',
        })

    def publish(self, topic: str, value: dict[str, Any], key: str | None = None):
        payload = json.dumps(value).encode('utf-8')
        self._producer.produce(topic=topic, key=key, value=payload)
        self._producer.poll(0)

    def flush(self):
        self._producer.flush()
