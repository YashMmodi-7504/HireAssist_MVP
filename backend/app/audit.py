"""Append-only audit logging utilities for HireAssist (Phase 5.2).

This module is intentionally minimal and safe:
- Stores only non-PII fields: actor_role, action, resource, request_id, created_at
- Provides an explicit write API (no automatic middleware writes)
- Creates an append-only table with triggers to prevent UPDATE/DELETE

Notes:
- `created_at` is an ISO-8601 UTC string (e.g. 2025-12-20T15:04:05Z)
- Audit writes are synchronous and explicit at the call site; failures are logged and do not raise.
"""
from typing import Optional
from datetime import datetime
from app.db import get_conn

AUDIT_TABLE_SQL = """
CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    actor_role TEXT NOT NULL,
    action TEXT NOT NULL,
    resource TEXT NOT NULL,
    request_id TEXT,
    created_at TEXT NOT NULL
);
"""

PREVENT_UPDATE_TRIGGER = """
CREATE TRIGGER IF NOT EXISTS audit_prevent_update
BEFORE UPDATE ON audit_logs
BEGIN
    SELECT RAISE(ABORT, 'audit_logs is append-only');
END;
"""

PREVENT_DELETE_TRIGGER = """
CREATE TRIGGER IF NOT EXISTS audit_prevent_delete
BEFORE DELETE ON audit_logs
BEGIN
    SELECT RAISE(ABORT, 'audit_logs is append-only');
END;
"""


def _utc_now_iso() -> str:
    """Return current UTC time as ISO-8601 string without microseconds and with Z suffix."""
    return datetime.utcnow().replace(microsecond=0).isoformat() + "Z"


def init_audit_table():
    """Create audit table and append-only triggers if they do not exist."""
    conn = get_conn()
    c = conn.cursor()
    c.executescript(AUDIT_TABLE_SQL)
    c.executescript(PREVENT_UPDATE_TRIGGER)
    c.executescript(PREVENT_DELETE_TRIGGER)
    conn.commit()
    conn.close()


def write_audit(actor_role: str, action: str, resource: str, request_id: Optional[str] = None, created_at: Optional[str] = None) -> int:
    """Append a single audit record and return its new row id.

    - actor_role, action, resource are required and must not contain PII.
    - request_id is optional and should be sourced from the incoming X-Request-ID header if available.
    - created_at will be populated with current UTC ISO-8601 string if not provided.

    The function commits synchronously; if it encounters errors, it raises them so callers can catch and log (do NOT propagate to user).
    """
    if not actor_role or not action or not resource:
        raise ValueError("actor_role, action and resource are required for audit entries")

    ts = created_at or _utc_now_iso()

    conn = get_conn()
    c = conn.cursor()
    c.execute(
        "INSERT INTO audit_logs (actor_role, action, resource, request_id, created_at) VALUES (?, ?, ?, ?, ?)",
        (actor_role, action, resource, request_id, ts)
    )
    rowid = c.lastrowid
    conn.commit()
    conn.close()
    return rowid
