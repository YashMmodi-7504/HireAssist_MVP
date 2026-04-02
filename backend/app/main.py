import logging
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# ==================================================
# CORE APP
# ==================================================

app = FastAPI(
    title="HireAssist API",
    description="Edunet-style Hiring & Training Platform",
    version="1.0.0"
)

# ==================================================
# ROUTER IMPORTS
# ==================================================

from app.api_health import router as health_router
from app.api_chat import router as chat_router
from app.api.resume_rag import router as resume_rag_router

from app.api_jobs import router as jobs_router
from app.api_training import router as training_router
from app.api_candidate import router as candidate_router

from app.api_admin import router as admin_router
from app.api_analytics import router as analytics_router
from app.api_trainer import router as trainer_router
from app.api_director import router as director_router
from app.api_progress import router as progress_router
from app.api_skill_gap import router as skills_router
from app.api_student import router as student_router
from app.api.study_rag import router as study_rag_router

# 🔐 AUTH ROUTER (LOGIN ONLY)
from app.routes.auth import router as auth_router

# ==================================================
# STARTUP EVENTS (SAFE RAG INITIALIZATION)
# ==================================================

try:
    from app.services.study_indexer import index_study_material

    @app.on_event("startup")
    def load_rag_indexes():
        index_study_material()

except Exception as e:
    logging.warning("RAG startup skipped: %s", e)

# ==================================================
# MIDDLEWARE
# ==================================================

from app.core.logging import log_request
app.middleware("http")(log_request)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================================================
# ROUTE REGISTRATION
# ==================================================

# ---- Health ----
app.include_router(
    health_router,
    prefix="/api/health",
    tags=["Health"]
)

# ---- Auth (Single Source of Truth) ----
app.include_router(
    auth_router
)

# ---- AI / Resume ----
app.include_router(
    chat_router,
    prefix="/api/ai",
    tags=["AI Chat"]
)

app.include_router(
    resume_rag_router,
    prefix="/api/resume",
    tags=["Resume AI"]
)

# ---- Core Business ----
app.include_router(jobs_router, prefix="/api/jobs")
app.include_router(training_router, prefix="/api/training")
app.include_router(candidate_router, prefix="/api/candidate")

# ---- Admin / Ops ----
app.include_router(admin_router, prefix="/api/admin")
app.include_router(analytics_router, prefix="/api/analytics")
app.include_router(trainer_router, prefix="/api/trainer")
app.include_router(director_router, prefix="/api/director")
app.include_router(progress_router, prefix="/api/progress")
app.include_router(skills_router, prefix="/api/skills")

# ---- Student ----
app.include_router(student_router, prefix="/api/student")
app.include_router(study_rag_router)

# ==================================================
# GLOBAL ERROR HANDLING
# ==================================================

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logging.getLogger("hireassist").exception("Unhandled exception")
    return JSONResponse(
        status_code=500,
        content={"error": "Internal Server Error"}
    )
