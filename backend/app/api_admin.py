from fastapi import APIRouter, Depends
from app.db import get_conn
from app.auth import require_permission
from app.core.decision_engine import compute_decision_intelligence
from app.core.intervention_engine import compute_intervention

router = APIRouter(tags=["Admin"])

# -------------------------------------------------
# ADMIN METRICS DASHBOARD
# GET /api/admin/metrics
# Protected: admin only
# -------------------------------------------------
@router.get("/metrics", dependencies=[Depends(require_permission("admin:metrics"))])
def get_admin_metrics():
    conn = get_conn()
    c = conn.cursor()

    total_candidates = c.execute(
        "SELECT COUNT(*) FROM candidates"
    ).fetchone()[0]

    learners_trained = c.execute(
        "SELECT COUNT(DISTINCT candidate_id) FROM learners"
    ).fetchone()[0]

    placements = c.execute(
        "SELECT COUNT(*) FROM candidates WHERE assessment_score >= 70"
    ).fetchone()[0]

    avg_score = c.execute(
        "SELECT AVG(assessment_score) FROM candidates"
    ).fetchone()[0] or 0

    at_risk_learners = c.execute(
        "SELECT COUNT(*) FROM candidates WHERE assessment_score < 50"
    ).fetchone()[0]

    at_risk_pct = (
        round((at_risk_learners / learners_trained) * 100, 2)
        if learners_trained else 0
    )

    conn.close()

    decision_intelligence = compute_decision_intelligence(
        readiness_flag="red" if at_risk_pct >= 40 else "amber" if at_risk_pct >= 25 else "green",
        trend="→",
        at_risk_percentage=at_risk_pct
    )

    intervention = compute_intervention(decision_intelligence)

    return {
        "total_candidates": total_candidates,
        "learners_trained": learners_trained,
        "placements": placements,
        "avg_assessment_score": round(avg_score, 2),
        "at_risk_pct": at_risk_pct,
        "decision_intelligence": decision_intelligence,
        "intervention": intervention
    }
