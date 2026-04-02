# Deployment Readiness Checklist — HireAssist (Phase 4)

This document lists minimal, non-invasive steps to prepare and verify HireAssist for production. It focuses on deterministic, safe checks and does NOT change business logic or introduce secrets.

## Goals
- Validate runtime configuration
- Provide safe defaults for local development
- Ensure simple operational checks (health, logs)
- Provide Windows-friendly commands for local verification

---

## Environment variables (recommended)
- `ENV` — "development" (default) or "production"
- `LOG_LEVEL` — defaults to `INFO` (valid: DEBUG, INFO, WARNING, ERROR, CRITICAL)
- `REQUEST_TIMEOUT_SECS` — integer seconds (default: 15)
- `SLOW_REQUEST_MS` — threshold in milliseconds to mark slow requests (default: 2000)
- `MAX_REQUEST_ID_LEN` — sanity limit for X-Request-ID header (default: 32)

> Note: No secrets should be stored in these variables. Keep production secrets out of code and follow your platform's secret store.

---

## Quick start (local, Windows PowerShell)
1. Create a Python venv and activate it (PowerShell):

   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   pip install -r backend/requirements.txt

2. Start the API (development):

   cd backend
   uvicorn app.main:app --reload --port 8000

3. Health check:

   Invoke-WebRequest http://127.0.0.1:8000/health | ConvertFrom-Json

   Expected response:

   {
     "status": "ok",
     "service": "hireassist-api",
     "version": "1.0.0"
   }

4. Verify logs include `X-Request-ID` for requests and that slow requests are reported as WARNING (if there are any > SLOW_REQUEST_MS).

---

## Operational checks before deployment
- Confirm `uvicorn` is running under a process manager for production (systemd, Docker, etc.).
- Confirm `ENV=production` and `LOG_LEVEL=INFO` in your environment.
- Ensure the database file `backend/app/hireassist.db` is present and readable by the service account (if you rely on the bundled DB in production).
- Confirm the `/health` endpoint returns the expected static payload.

---

## Logs & Monitoring
- Logs are intentionally minimal and include only: request-id, method, path, status, duration, and WARNING/ERROR markers.
- Do not log PII or full request/response payloads.
- Integrate basic monitoring to alert on: 5xx rate increases, slow request rates, and timeout (504) frequency.

---

## Rollback & Safety
- Changes in Phase 4 are non-invasive and reversible.
- If issues occur, revert to the previous commit and restart the service.

---

## Contact
For operational concerns, consult the backend README or contact the engineering lead responsible for HireAssist.
