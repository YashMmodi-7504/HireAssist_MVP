from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.db import get_conn

router = APIRouter()

# -----------------------------
# MODELS
# -----------------------------
class ProgramCreate(BaseModel):
    employer_id: str
    title: str
    description: str
    mode: str = "online"
    seats: int = 20


class CohortCreate(BaseModel):
    program_id: int
    start_date: str
    end_date: str
    seats: int = 20


class Enrollment(BaseModel):
    candidate_id: int
    assessment_score: int | None = None


# ----------------------------------------------------
# 1) CREATE TRAINING PROGRAM
# ----------------------------------------------------
@router.post("/programs")
def create_program(p: ProgramCreate):
    conn = get_conn()
    c = conn.cursor()

    c.execute(
        """
        INSERT INTO training_programs (employer_id, title, description, mode, seats)
        VALUES (?, ?, ?, ?, ?)
        """,
        (p.employer_id, p.title, p.description, p.mode, p.seats),
    )

    conn.commit()
    pid = c.lastrowid
    conn.close()

    return {"program_id": pid, "status": "created"}


# ----------------------------------------------------
# 2) LIST TRAINING PROGRAMS
# ----------------------------------------------------
@router.get("/programs")
def list_programs(employer_id: str):
    conn = get_conn()
    c = conn.cursor()

    rows = c.execute(
        """
        SELECT id, title, description, mode, seats
        FROM training_programs
        WHERE employer_id=?
        ORDER BY id DESC
        """,
        (employer_id,),
    ).fetchall()

    conn.close()

    return {
        "programs": [
            {
                "id": r[0],
                "title": r[1],
                "description": r[2],
                "mode": r[3],
                "seats": r[4],
            }
            for r in rows
        ]
    }


# ----------------------------------------------------
# 3) TRAINING IMPACT (REAL DATA)
# ----------------------------------------------------
@router.get("/impact/{employer_id}")
def training_impact(employer_id: str):
    conn = get_conn()
    c = conn.cursor()

    learners = c.execute(
        """
        SELECT COUNT(*)
        FROM learners l
        JOIN cohorts c2 ON l.cohort_id = c2.id
        JOIN training_programs p ON c2.program_id = p.id
        WHERE p.employer_id=?
        """,
        (employer_id,),
    ).fetchone()[0]

    avg_score = c.execute(
        """
        SELECT AVG(l.assessment_score)
        FROM learners l
        JOIN cohorts c2 ON l.cohort_id = c2.id
        JOIN training_programs p ON c2.program_id = p.id
        WHERE p.employer_id=? AND l.assessment_score IS NOT NULL
        """,
        (employer_id,),
    ).fetchone()[0] or 0

    placements = c.execute(
        """
        SELECT COUNT(*)
        FROM learners l
        JOIN cohorts c2 ON l.cohort_id = c2.id
        JOIN training_programs p ON c2.program_id = p.id
        WHERE p.employer_id=? AND l.assessment_score >= 70
        """,
        (employer_id,),
    ).fetchone()[0]

    conn.close()

    return {
        "employer_id": employer_id,
        "learners_trained": learners,
        "placements": placements,
        "avg_assessment_score": round(avg_score, 1),
    }


# ----------------------------------------------------
# 4) CREATE COHORT (WITH ENTERPRISE COHORT CODE)
# ----------------------------------------------------
@router.post("/cohorts")
def create_cohort(cinfo: CohortCreate):
    conn = get_conn()
    c = conn.cursor()

    exists = c.execute(
        "SELECT id FROM training_programs WHERE id=?",
        (cinfo.program_id,),
    ).fetchone()

    if not exists:
        raise HTTPException(status_code=400, detail="Program does not exist")

    # Generate next cohort code
    last = c.execute(
        "SELECT cohort_code FROM cohorts ORDER BY id DESC LIMIT 1"
    ).fetchone()

    next_num = 1
    if last and last[0]:
        try:
            next_num = int(last[0].split("-")[-1]) + 1
        except:
            pass

    cohort_code = f"EDU-COH-2025-{str(next_num).zfill(2)}"

    c.execute(
        """
        INSERT INTO cohorts (
            program_id, start_date, end_date,
            seats, enrolled_count, status, cohort_code
        )
        VALUES (?, ?, ?, ?, 0, 'planned', ?)
        """,
        (cinfo.program_id, cinfo.start_date, cinfo.end_date, cinfo.seats, cohort_code),
    )

    conn.commit()
    cid = c.lastrowid
    conn.close()

    return {
        "cohort_id": cid,
        "cohort_code": cohort_code,
        "status": "created",
    }


# ----------------------------------------------------
# 5) LIST COHORTS (FRONTEND SAFE)
# ----------------------------------------------------
@router.get("/cohorts")
def list_cohorts():
    conn = get_conn()
    c = conn.cursor()

    rows = c.execute(
        """
        SELECT id, program_id, start_date, end_date,
               seats, enrolled_count, status, cohort_code
        FROM cohorts
        ORDER BY id DESC
        """
    ).fetchall()

    conn.close()

    return {
        "cohorts": [
            {
                "id": r[0],                     # internal only
                "cohort_code": r[7],            # show this in UI
                "program_id": r[1],
                "start_date": r[2],
                "end_date": r[3],
                "seats": r[4],
                "enrolled_count": r[5],
                "status": r[6],
            }
            for r in rows
        ]
    }


# ----------------------------------------------------
# 6) ENROLL LEARNER (SAFE + SCALABLE)
# ----------------------------------------------------
@router.post("/cohorts/{cohort_id}/enroll")
def enroll_candidate(cohort_id: int, payload: Enrollment):
    conn = get_conn()
    c = conn.cursor()

    cohort = c.execute(
        """
        SELECT seats, enrolled_count, status
        FROM cohorts WHERE id=?
        """,
        (cohort_id,),
    ).fetchone()

    if not cohort:
        raise HTTPException(status_code=404, detail="Cohort does not exist")

    seats, enrolled, status = cohort

    if enrolled >= seats:
        raise HTTPException(status_code=400, detail="Cohort seats full")

    exists = c.execute(
        """
        SELECT id FROM learners
        WHERE cohort_id=? AND candidate_id=?
        """,
        (cohort_id, payload.candidate_id),
    ).fetchone()

    if exists:
        raise HTTPException(
            status_code=400,
            detail="Candidate already enrolled in this cohort",
        )

    c.execute(
        """
        INSERT INTO learners (candidate_id, cohort_id, assessment_score)
        VALUES (?, ?, ?)
        """,
        (payload.candidate_id, cohort_id, payload.assessment_score),
    )

    c.execute(
        """
        UPDATE cohorts
        SET enrolled_count = enrolled_count + 1,
            status = CASE
                WHEN enrolled_count + 1 >= seats THEN 'full'
                ELSE 'ongoing'
            END
        WHERE id=?
        """,
        (cohort_id,),
    )

    conn.commit()
    conn.close()

    return {
        "status": "enrolled",
        "cohort_id": cohort_id,
    }
