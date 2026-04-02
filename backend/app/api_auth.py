
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import jwt
import os

router = APIRouter()
SECRET_KEY = os.getenv("SECRET_KEY", "supersecret")

class LoginRequest(BaseModel):
    email: str
    password: str

demo_users = {
    "student@hireassist.ai": {
        "name": "Modi Yash Dipeshkumar",
        "email": "student@hireassist.ai",
        "role": "student",
        "password": "student123"
    },
    "admin@hireassist.ai": {
        "name": "Admin User",
        "email": "admin@hireassist.ai",
        "role": "admin",
        "password": "admin123"
    },
    "faculty@hireassist.ai": {
        "name": "Faculty User",
        "email": "faculty@hireassist.ai",
        "role": "faculty",
        "password": "faculty123"
    },
    "placement@hireassist.ai": {
        "name": "Placement User",
        "email": "placement@hireassist.ai",
        "role": "placement",
        "password": "placement123"
    },
}

def create_access_token(data: dict):
    return jwt.encode(data, SECRET_KEY, algorithm="HS256")

@router.post("/api/auth/login")
def login(req: LoginRequest):
    user = demo_users.get(req.email)
    if not user or user["password"] != req.password:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token({"email": user["email"], "role": user["role"]})
    return {
        "access_token": token,
        "role": user["role"].lower(),
        "user": {"name": user["name"], "email": user["email"], "role": user["role"].lower()}
    }


# Simple token verification endpoint to help debugging token/headers
@router.get("/me")
def whoami(payload: dict = Depends(__import__("app.auth").auth.get_current_user)):
    """Return the decoded token payload to verify the token is accepted by the server.

    This endpoint is handy for quick debugging of Authorization headers and tokens. It requires
    a valid Bearer token.
    """
    return payload
