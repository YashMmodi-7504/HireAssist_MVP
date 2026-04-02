from fastapi import Request, HTTPException
from functools import wraps

# Example: role-based dependency

def require_role(roles):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            request: Request = kwargs.get('request')
            user = getattr(request.state, 'user', None)
            if not user or user.get('role') not in roles:
                raise HTTPException(status_code=403, detail="Forbidden")
            return await func(*args, **kwargs)
        return wrapper
    return decorator

# Example: institution_id extraction

def get_institution_id(request: Request):
    return getattr(request.state, 'institution_id', None)
