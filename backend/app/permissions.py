"""
Central permission map for HireAssist (Phase 5.1).

This module is intentionally declarative:
- No FastAPI imports
- No auth imports
- No side effects

It defines which roles are allowed to access which logical resources.
"""

PERMISSIONS = {
    "admin:metrics": ["admin"],
    "admin:insights": ["admin"],
    "trainer:dashboard": ["trainer", "admin"],
    "director:dashboard": ["director", "admin"],
}

def allowed_roles_for(resource: str):
    """
    Return allowed roles for a given resource key.
    Returns empty list if resource is not configured.
    """
    return PERMISSIONS.get(resource, [])
