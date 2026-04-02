from fastapi import APIRouter
from app.db import get_conn

router = APIRouter(prefix="/api/admin/intelligence", tags=["Admin Intelligence"])

@router.get("/risk-forecast")
def risk_forecast():
    conn = get_conn()
    c = conn.cursor()

    total = c.execute("SELECT COUNT(*) FROM learners").fetchone()[0]
    at_risk = c.execute(
        "SELECT COUNT(*) FROM learners WHERE assessment_score < 50"
    ).fetchone()[0]

    cohorts = c.execute("""
        SELECT cohort_id, COUNT(*) 
        FROM learners 
        WHERE assessment_score < 50
        GROUP BY cohort_id
    """).fetchall()

    conn.close()

    return {
        "total_learners": total,
        "at_risk_learners": at_risk,
        "risk_percentage": round((at_risk / total) * 100, 1) if total else 0,
        "high_risk_cohorts": [
            {"cohort_id": c[0], "count": c[1]} for c in cohorts
        ]
    }
