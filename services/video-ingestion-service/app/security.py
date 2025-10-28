from jose import jwk, jwt
from jose.utils import base64url_decode
import httpx
from datetime import datetime, timezone
from functools import lru_cache
from typing import Any, Dict
from .config import settings

class AuthError(Exception):
    pass

@lru_cache(maxsize=1)
def _jwks() -> Dict[str, Any]:
    import requests
    r = requests.get(settings.jwks_url, timeout=5)
    r.raise_for_status()
    return r.json()

async def validate_jwt(auth_header: str) -> dict:
    if not auth_header or not auth_header.startswith("Bearer "):
        raise AuthError("missing_token")
    token = auth_header.split(" ", 1)[1]
    header = jwt.get_unverified_header(token)
    kid = header.get("kid")
    keys = _jwks().get("keys", [])
    key = next((k for k in keys if k.get("kid") == kid), None)
    if not key:
        raise AuthError("unknown_kid")
    message, encoded_sig = token.rsplit(".", 1)
    decoded_sig = base64url_decode(encoded_sig.encode())
    public_key = jwk.construct(key)
    if not public_key.verify(message.encode(), decoded_sig):
        raise AuthError("bad_signature")
    claims = jwt.get_unverified_claims(token)
    now = datetime.now(timezone.utc).timestamp()
    if float(claims.get("exp", 0)) < now:
        raise AuthError("expired")
    if claims.get("iss") != settings.issuer:
        raise AuthError("bad_issuer")
    return claims

async def verify_api_key(api_key: str) -> dict:
    import httpx
    headers = {"X-Internal-Secret": settings.internal_secret}
    url = f"{settings.auth_service_base_url}/v1/api-keys/verify"
    async with httpx.AsyncClient(timeout=5) as client:
        r = await client.post(url, headers=headers, json={"api_key": api_key})
        if r.status_code != 200:
            raise AuthError("invalid_api_key")
        return r.json()
