"""Centralized backend configuration (phase 4 hardening).

This module exposes environment-driven configuration with safe defaults for
local development. No secrets are required here and values are intentionally
conservative.

DO NOT put secrets here. Keep this file minimal and reviewable.
"""

import os

ENV = os.getenv("ENV", "development").lower()  # 'development' or 'production'

# Logging
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO").upper()

# Request limits (seconds / milliseconds)
try:
    REQUEST_TIMEOUT_SECS = int(os.getenv("REQUEST_TIMEOUT_SECS", "15"))
except Exception:
    REQUEST_TIMEOUT_SECS = 15

try:
    SLOW_REQUEST_MS = int(os.getenv("SLOW_REQUEST_MS", "2000"))
except Exception:
    SLOW_REQUEST_MS = 2000

# Request ID limits
try:
    MAX_REQUEST_ID_LEN = int(os.getenv("MAX_REQUEST_ID_LEN", "32"))
except Exception:
    MAX_REQUEST_ID_LEN = 32

# Lightweight runtime flags
DEBUG = ENV != "production"

# Export a small validation helper
def validate():
    """Run quick, non-invasive validations. Returns list of warnings (strings)."""
    warnings = []
    if ENV not in ("development", "production"):
        warnings.append(f"Unexpected ENV value: {ENV}")

    if LOG_LEVEL not in ("DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"):
        warnings.append(f"Invalid LOG_LEVEL: {LOG_LEVEL}")

    if REQUEST_TIMEOUT_SECS <= 0:
        warnings.append("REQUEST_TIMEOUT_SECS should be > 0")

    return warnings
