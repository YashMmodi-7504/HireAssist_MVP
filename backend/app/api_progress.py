from fastapi import APIRouter, HTTPException
from app.db import get_conn

router = APIRouter(prefix="/api/progress", tags=["Progress"])

@router.get("/student/{candidate_id}")
def student_progress(candidate_id: int):
    conn = get_conn()
    c = conn.cursor()

    candidate = c.execute(
        """
        SELECT resume_text, assessment_score
        FROM candidates
        WHERE id=?
        """,
        (candidate_id,)
    ).fetchone()

    if not candidate:
        conn.close()
        raise HTTPException(404, "Candidate not found")

    resume_text, assessment_score = candidate

    learner = c.execute(
        """
        SELECT COUNT(*)
        FROM learners
        WHERE candidate_id=?
        """,
        (candidate_id,)
    ).fetchone()[0]

    conn.close()

    skill_score = min(40, len(resume_text or "") // 50)
    assessment_score = assessment_score or 0
    learner_score = min(20, learner * 5)

    total_progress = min(100, skill_score + assessment_score + learner_score)

    readiness = (
        "Job Ready" if total_progress >= 75
        else "Near Ready" if total_progress >= 50
        else "Needs Training"
    )

    return {
        "progress_score": total_progress,
        "readiness": readiness,
        "recommendation": (
            "Focus on advanced projects"
            if readiness == "Near Ready"
            else "Complete core training modules"
        )
    }
