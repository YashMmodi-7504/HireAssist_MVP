from fastapi import APIRouter, Depends, Request
from app.db import get_conn
from app.auth import require_roles, get_current_user
from app.audit import write_audit

router = APIRouter(
    prefix="/api/admin/insights",
    tags=["Admin Intelligence"],
    dependencies=[Depends(require_roles(["admin"]))],
)

@router.get("/risk-summary")
def risk_summary(request: Request, user: dict = Depends(get_current_user)):
    # Explicit audit log (non-blocking, no PII)
    write_audit(
        actor_role=user.get("role") or "unknown",
        action="view_risk_summary",
        resource="admin:insights",
        request_id=request.headers.get("X-Request-ID"),
    )

    conn = get_conn()
    c = conn.cursor()

    at_risk = c.execute(
        "SELECT COUNT(*) FROM learners WHERE assessment_score < 50"
    ).fetchone()[0]

    total = c.execute(
        "SELECT COUNT(*) FROM learners"
    ).fetchone()[0]

    low_cohorts = c.execute("""
        SELECT COUNT(*)
        FROM (
            SELECT cohort_id,
                   AVG(assessment_score) AS avg_score,
                   SUM(CASE WHEN assessment_score >= 70 THEN 1 ELSE 0 END) * 100.0 / COUNT(*) AS placement_rate
            FROM learners
            GROUP BY cohort_id
            HAVING avg_score < 60 AND placement_rate < 40
        )
    """).fetchone()[0]

    conn.close()

    return {
        "total_learners": total,
        "at_risk_learners": at_risk,
        "low_performing_cohorts": low_cohorts,
        "risk_percentage": round((at_risk / total) * 100, 2) if total else 0,
    }
