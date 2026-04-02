from fastapi import APIRouter, HTTPException
from app.db import get_conn

router = APIRouter(prefix="/api/candidate", tags=["Candidate"])

@router.get("/{candidate_id}")
def get_candidate(candidate_id: int):
    conn = get_conn()
    c = conn.cursor()

    row = c.execute(
        """
        SELECT id, full_name, email, location, resume_text, assessment_score
        FROM candidates
        WHERE id=?
        """,
        (candidate_id,)
    ).fetchone()

    conn.close()

    if not row:
        raise HTTPException(status_code=404, detail="Candidate not found")

    (
        cid,
        full_name,
        email,
        location,
        resume_text,
        assessment_score
    ) = row

    # --------- SKILL EXTRACTION ---------
    skills = []
    if resume_text:
        text = resume_text.lower()
        for s in [
            "python", "sql", "excel", "power bi", "tableau",
            "machine learning", "statistics", "aws", "azure"
        ]:
            if s in text:
                skills.append(s)

    # --------- STATUS ---------
    status = "Placed" if assessment_score and assessment_score >= 70 else "Training"

    return {
        "id": cid,
        "name": full_name,
        "email": email,
        "location": location,
        "skills": skills,
        "score": assessment_score,
        "status": status
    }
