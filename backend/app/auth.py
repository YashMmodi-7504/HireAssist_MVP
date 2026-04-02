from fastapi import Request

# ==================================================
# AUTH STUBS (MVP MODE)
# ==================================================
# This file exists ONLY to satisfy legacy imports like:
#   from app.auth import require_permission
#   from app.auth import get_current_user
#
# Real authentication (login) lives in:
#   app/routes/auth.py
# ==================================================

FAKE_CURRENT_USER = {
    "id": 1,
    "email": "student@hireassist.ai",
    "full_name": "Modi Yash Dipeshkumar",
    "role": "student"
}

# --------------------------------------------------
# Permission stub (Admin / Trainer / Director APIs)
# --------------------------------------------------

def require_permission(permission: str):
    """
    MVP stub for role/permission checks.
    Always allows access.
    """

    async def checker(request: Request):
        return True

    return checker

# --------------------------------------------------
# Current user stub (Student APIs)
# --------------------------------------------------

async def get_current_user(request: Request):
    """
    MVP stub for authenticated user.
    Always returns the same student user.
    """
    return FAKE_CURRENT_USER
