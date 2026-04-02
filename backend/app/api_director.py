from fastapi import APIRouter
from app.db import get_conn
from app.services.realism_engine import trend, fluctuate_score, readiness_from_score
from app.core.decision_engine import compute_decision_intelligence
from app.core.intervention_engine import compute_intervention
from app.core.whatif_engine import simulate_whatif

router = APIRouter()

# -------------------------------------------------
# DIRECTOR DASHBOARD
# GET /api/director/dashboard
# -------------------------------------------------
@router.get("/dashboard")
def director_dashboard():
    conn = get_conn()
    c = conn.cursor()

    # -----------------------------
    # CORE METRICS
    # -----------------------------
    total_learners = c.execute(
        "SELECT COUNT(*) FROM candidates"
    ).fetchone()[0]

    placements = c.execute(
        "SELECT COUNT(*) FROM candidates WHERE assessment_score >= 70"
    ).fetchone()[0]

    avg_score = c.execute(
        "SELECT AVG(assessment_score) FROM candidates"
    ).fetchone()[0] or 0

    active_programs = c.execute(
        "SELECT COUNT(*) FROM training_programs"
    ).fetchone()[0]

    at_risk_learners = c.execute(
        "SELECT COUNT(*) FROM candidates WHERE assessment_score < 50"
    ).fetchone()[0]

    # -----------------------------
    # TREND CALCULATION (SAFE)
    # -----------------------------
    try:
        rows = c.execute(
            "SELECT id FROM cohorts ORDER BY start_date DESC LIMIT 2"
        ).fetchall()

        if len(rows) >= 2:
            last_id, prev_id = rows[0][0], rows[1][0]

            placements_last = c.execute(
                "SELECT COUNT(*) FROM learners WHERE cohort_id=? AND assessment_score >= 70",
                (last_id,)
            ).fetchone()[0]

            placements_prev = c.execute(
                "SELECT COUNT(*) FROM learners WHERE cohort_id=? AND assessment_score >= 70",
                (prev_id,)
            ).fetchone()[0]

            placement_trend = trend(placements_last, placements_prev)
        else:
            placement_trend = "→"
    except Exception:
        placement_trend = "→"

    # -----------------------------
    # AT-RISK % (REALISTIC)
    # -----------------------------
    try:
        rows = c.execute(
            "SELECT id, assessment_score FROM learners WHERE assessment_score IS NOT NULL"
        ).fetchall()

        total_with_scores = len(rows)
        red_count = 0

        for lid, score in rows:
            f = fluctuate_score(score or 0, lid)
            if readiness_from_score(f) == "red":
                red_count += 1

        at_risk_pct = round(
            (red_count / total_with_scores) * 100, 1
        ) if total_with_scores else 0
    except Exception:
        at_risk_pct = round(
            (at_risk_learners / total_learners) * 100, 1
        ) if total_learners else 0

    # -----------------------------
    # Cohort-level risk scan (derived)
    # -----------------------------
    try:
        highest = None
        cohort_rows = c.execute("SELECT id FROM cohorts").fetchall()
        for (cohort_id,) in cohort_rows:
            lrows = c.execute(
                "SELECT id, assessment_score FROM learners WHERE cohort_id=? AND assessment_score IS NOT NULL",
                (cohort_id,)
            ).fetchall()
            total = len(lrows)
            red_c = 0
            for lid, score in lrows:
                f = fluctuate_score(score or 0, lid)
                if readiness_from_score(f) == "red":
                    red_c += 1
            red_pct = round((red_c / total) * 100, 1) if total else 0

            if (highest is None) or red_pct > highest["red_pct"]:
                highest = {"cohort_id": cohort_id, "red_pct": red_pct, "red_count": red_c, "total": total}

        if highest is None:
            highest_risk_cohort = None
            intervention_recommendation = None
        else:
            highest_risk_cohort = highest
            # simple rule-based recommendation (explainable):
            if highest["red_pct"] >= 40:
                intervention_recommendation = f"Immediate intervention recommended for cohort {highest['cohort_id']}"
            elif highest["red_pct"] >= 25:
                intervention_recommendation = f"Targeted support recommended for cohort {highest['cohort_id']}"
            else:
                intervention_recommendation = f"Monitor cohort {highest['cohort_id']}"
    except Exception:
        highest_risk_cohort = None
        intervention_recommendation = None

    conn.close()

    placement_rate = round(
        (placements / total_learners) * 100, 1
    ) if total_learners else 0

    # -----------------------------
    # PHASE 3.1 — DECISION INTELLIGENCE
    # -----------------------------
    readiness_flag = (
        "red" if at_risk_pct >= 40
        else "amber" if at_risk_pct >= 25
        else "green"
    )

    decision_intelligence = compute_decision_intelligence(
        readiness_flag=readiness_flag,
        trend=placement_trend,
        at_risk_percentage=at_risk_pct
    )

    # -----------------------------
    # PHASE 3.2 + 3.3 — INTERVENTION + ACCOUNTABILITY
    # -----------------------------
    intervention = compute_intervention(decision_intelligence)

    return {
        "total_learners": total_learners,
        "placement_rate": placement_rate,
        "avg_score": round(avg_score, 1),
        "active_programs": active_programs,
        "at_risk_learners": at_risk_learners,
        "at_risk_pct": at_risk_pct,
        "placement_trend": placement_trend,

        # 🧠 Intelligence Layer
        "decision_intelligence": decision_intelligence,
        "intervention": intervention,

        # Derived director helpers (non-breaking additions)
        "highest_risk_cohort": highest_risk_cohort,
        "intervention_recommendation": intervention_recommendation
    }


# -------------------------------------------------
# DIRECTOR WHAT-IF SIMULATOR
# POST /api/director/what-if
# -------------------------------------------------
@router.post("/what-if")
def director_what_if(payload: dict):
    """
    Read-only what-if simulation.
    No DB writes. Deterministic.
    """

    current_at_risk_pct = payload.get("current_at_risk_pct", 0)
    trainer_improvement = payload.get("trainer_readiness_improvement_pct", 0)
    skill_gap_reduction = payload.get("skill_gap_reduction_pct", 0)

    simulation = simulate_whatif(
        current_at_risk_pct=current_at_risk_pct,
        readiness_flag=(
            "red" if current_at_risk_pct >= 40
            else "amber" if current_at_risk_pct >= 25
            else "green"
        ),
        trainer_readiness_improvement_pct=trainer_improvement,
        skill_gap_reduction_pct=skill_gap_reduction
    )

    return {
        "inputs": {
            "trainer_readiness_improvement_pct": trainer_improvement,
            "skill_gap_reduction_pct": skill_gap_reduction
        },
        "projected": simulation
    }
