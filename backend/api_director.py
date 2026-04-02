from fastapi import APIRouter
from app.db import get_conn

router = APIRouter()

@router.get("/dashboard")
def director_dashboard():
    conn = get_conn()
    c = conn.cursor()

    total = c.execute("SELECT COUNT(*) FROM candidates").fetchone()[0]
    placements = c.execute(
        "SELECT COUNT(*) FROM candidates WHERE assessment_score >= 70"
    ).fetchone()[0]

    avg_score = c.execute(
        "SELECT AVG(assessment_score) FROM candidates"
    ).fetchone()[0] or 0

    programs = c.execute(
        "SELECT COUNT(*) FROM training_programs"
    ).fetchone()[0]

    risk = c.execute(
        "SELECT COUNT(*) FROM learners WHERE assessment_score < 50"
    ).fetchone()[0]

    conn.close()

    placement_rate = round((placements / total) * 100, 1) if total else 0

    return {
        "total_learners": total,
        "placement_rate": placement_rate,
        "avg_score": round(avg_score, 1),
        "active_programs": programs,
        "at_risk_learners": risk
    }
