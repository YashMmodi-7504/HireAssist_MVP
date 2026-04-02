from fastapi import APIRouter
from pydantic import BaseModel
from app.db import get_conn
from datetime import datetime, timedelta

router = APIRouter()

class JobCreate(BaseModel):
    employer_id: str
    title: str
    description: str
    location: str = None
    salary_min: int = None
    salary_max: int = None

@router.post("/")
def create_job(job: JobCreate):
    conn = get_conn()
    c = conn.cursor()

    # Prevent duplicate job creation within 5 minutes
    window_minutes = 5
    cutoff_dt = datetime.utcnow() - timedelta(minutes=window_minutes)
    cutoff_str = cutoff_dt.strftime("%Y-%m-%d %H:%M:%S")

    existing = c.execute(
        """
        SELECT id FROM jobs 
        WHERE employer_id = ? AND title = ? AND created_at >= ?
        """,
        (job.employer_id, job.title, cutoff_str)
    ).fetchone()

    # If similar job exists, return that one instead of creating duplicate
    if existing:
        conn.close()
        return {
            "job_id": existing[0],
            "status": "duplicate",
            "note": f"Similar job created within last {window_minutes} minutes."
        }

    # Insert new job
    c.execute(
        """
        INSERT INTO jobs (employer_id, title, description, location, salary_min, salary_max)
        VALUES (?,?,?,?,?,?)
        """,
        (job.employer_id, job.title, job.description, job.location, job.salary_min, job.salary_max)
    )

    conn.commit()
    job_id = c.lastrowid
    conn.close()
    return {"job_id": job_id, "status": "created"}

@router.get("/")
def list_jobs(limit: int = 50):
    conn = get_conn()
    c = conn.cursor()

    rows = c.execute(
        """
        SELECT id, employer_id, title, description, location, salary_min, salary_max, created_at
        FROM jobs
        ORDER BY id DESC
        LIMIT ?
        """,
        (limit,)
    ).fetchall()

    jobs = []
    for r in rows:
        jobs.append({
            "id": r[0],
            "employer_id": r[1],
            "title": r[2],
            "description": r[3],
            "location": r[4],
            "salary_min": r[5],
            "salary_max": r[6],
            "created_at": r[7]
        })

    conn.close()
    return {"jobs": jobs}
