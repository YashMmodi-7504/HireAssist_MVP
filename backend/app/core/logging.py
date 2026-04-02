import asyncio
import logging
import time
import uuid
from typing import Callable

from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse

from app.config import (REQUEST_TIMEOUT_SECS, SLOW_REQUEST_MS, MAX_REQUEST_ID_LEN, LOG_LEVEL)

# ---------------- LOGGER SETUP ----------------
logger = logging.getLogger("hireassist")
try:
    logger.setLevel(getattr(logging, LOG_LEVEL))
except Exception:
    logger.setLevel(logging.INFO)

handler = logging.StreamHandler()
formatter = logging.Formatter(
    "%(asctime)s | %(levelname)s | %(message)s"
)
handler.setFormatter(formatter)

if not logger.handlers:
    logger.addHandler(handler)

# ---------------- HELPERS ----------------

def generate_request_id() -> str:
    return str(uuid.uuid4())[:8]


def sanitize_request_id(value: str) -> str:
    if not value:
        return generate_request_id()
    return str(value).strip()[:MAX_REQUEST_ID_LEN]


# ---------------- MIDDLEWARE ----------------
async def log_request(request: Request, call_next: Callable):
    """Request logging middleware with safe timeouts and request-id propagation.

    - Accepts an incoming X-Request-ID and returns it in responses.
    - Uses a configurable timeout to avoid hanging requests (returns 504 on timeout).
    - Emits only minimal logs (method, path, status, duration, request-id).
    - Does not log request/response bodies or any PII.

    This middleware is intentionally defensive: it MUST always return an HTTP response.
    """

    # Use incoming request id if provided, otherwise generate one.
    incoming_req_id = request.headers.get("X-Request-ID")
    request_id = sanitize_request_id(incoming_req_id)

    start = time.perf_counter()

    try:
        # Protect against hanging requests
        try:
            response = await asyncio.wait_for(call_next(request), timeout=REQUEST_TIMEOUT_SECS)
        except asyncio.TimeoutError:
            duration_ms = round((time.perf_counter() - start) * 1000, 2)
            logger.warning(f"[{request_id}] {request.method} {request.url.path} TIMEOUT after {duration_ms}ms")

            # Return a safe timeout response (no internals leaked)
            resp = JSONResponse(
                status_code=504,
                content={"error": "Gateway Timeout", "message": "Request exceeded time limit."},
            )
            resp.headers["X-Request-ID"] = request_id
            return resp

        duration_ms = round((time.perf_counter() - start) * 1000, 2)

        # Warn if request is slow; keep normal request log minimal
        if duration_ms >= SLOW_REQUEST_MS:
            logger.warning(f"[{request_id}] {request.method} {request.url.path} {response.status_code} {duration_ms}ms (SLOW)")
        else:
            logger.info(f"[{request_id}] {request.method} {request.url.path} {response.status_code} {duration_ms}ms")

        # Propagate request-id header to caller
        response.headers["X-Request-ID"] = request_id
        return response

    except HTTPException:
        # Re-raise HTTP exceptions so FastAPI's handlers (or our global handlers) take over.
        raise

    except Exception:
        # Defensive fallback: do not leak internals; always return a safe 500 response.
        duration_ms = round((time.perf_counter() - start) * 1000, 2)
        logger.error(f"[{request_id}] {request.method} {request.url.path} ERROR after {duration_ms}ms | {type(Exception).__name__}")

        resp = JSONResponse(
            status_code=500,
            content={"error": "Internal Server Error", "message": "An unexpected error occurred. Please try again."},
        )
        resp.headers["X-Request-ID"] = request_id
        return resp
