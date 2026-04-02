from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(
    prefix="/api/auth",
    tags=["Auth"]
)

# -------------------------------------------------
# TEMP MVP USER (PLAIN TEXT — INTENTIONAL)
# -------------------------------------------------

FAKE_USER = {
    "id": 1,
    "email": "student@hireassist.ai",
    "full_name": "Modi Yash Dipeshkumar",
    "role": "student",
    "password": "student123"
}

# -------------------------------------------------
# SCHEMAS
# -------------------------------------------------

class LoginRequest(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    role: str

class LoginResponse(BaseModel):
    user: UserResponse

# -------------------------------------------------
# LOGIN ENDPOINT
# -------------------------------------------------

@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest):

    if payload.email != FAKE_USER["email"]:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if payload.password != FAKE_USER["password"]:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {
        "user": {
            "id": FAKE_USER["id"],
            "email": FAKE_USER["email"],
            "full_name": FAKE_USER["full_name"],
            "role": FAKE_USER["role"]
        }
    }
