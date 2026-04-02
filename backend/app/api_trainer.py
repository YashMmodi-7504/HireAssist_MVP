from fastapi import APIRouter
from datetime import date
from app.db import get_conn
from app.services.realism_engine import fluctuate_score, readiness_from_score
from app.core.decision_engine import compute_decision_intelligence
from app.core.intervention_engine import compute_intervention
from app.xai import explain_cohort

router = APIRouter()

@router.get("/dashboard")
def trainer_dashboard():
    conn = get_conn()
    c = conn.cursor()

    cohorts = c.execute("""
        SELECT id, program_id, start_date, end_date, enrolled_count, seats, status
        FROM cohorts
        ORDER BY start_date DESC
    """).fetchall()

    cohort_data = []

    for c_id, p_id, start, end, enrolled, seats, status in cohorts:
        # -----------------------------
        # Core analytics (existing)
        # -----------------------------
        avg_score = c.execute("""
            SELECT AVG(assessment_score)
            FROM learners
            WHERE cohort_id=? AND assessment_score IS NOT NULL
        """, (c_id,)).fetchone()[0] or 0

        ready = c.execute("""
            SELECT COUNT(*) FROM learners
            WHERE cohort_id=? AND assessment_score >= 70
        """, (c_id,)).fetchone()[0]

        fluctuated_avg = fluctuate_score(avg_score, c_id)
        readiness_flag = readiness_from_score(fluctuated_avg)

        # -----------------------------
        # Phase 3.1 — Decision Intelligence
        # -----------------------------
        decision_intelligence = compute_decision_intelligence(
            readiness_flag=readiness_flag,
            trend="→"  # trainer-level trend not tracked yet
        )

        # -----------------------------
        # Phase 3.2 — Intervention Engine
        # -----------------------------
        intervention = compute_intervention(decision_intelligence)

        # -----------------------------
        # Phase 3.3 — Accountability (THIS IS THE PART YOU ASKED ABOUT)
        # -----------------------------
        if intervention["intervention_required"] and start:
            try:
                days_pending = (date.today() - date.fromisoformat(start)).days
            except Exception:
                days_pending = 0

            intervention["accountability"]["pending_days"] = days_pending
            intervention["accountability"]["breached"] = (
                intervention["sla_days"] is not None
                and days_pending > intervention["sla_days"]
            )

        # -----------------------------
        # Final response object (add small explainable risk fields)
        # -----------------------------
        # compute explicit ready percentage and deterministic risk explainers
        ready_pct_val = round((ready / enrolled) * 100, 1) if enrolled else 0

        explainers = []
        if readiness_flag == "red":
            explainers.append("low_avg_score")
        if ready_pct_val < 30:
            explainers.append("low_ready_pct")
        if enrolled < (seats * 0.5):
            explainers.append("low_enrollment")

        # map to human-friendly risk level
        if readiness_flag == "red" or ready_pct_val < 30:
            risk_level = "High"
        elif readiness_flag == "amber" or ready_pct_val < 60:
            risk_level = "Medium"
        else:
            risk_level = "Low"

        # Add explainable intelligence (Phase 5.3)
        xai = explain_cohort(readiness_flag, ready_pct_val, enrolled, seats, intervention)

        cohort_data.append({
            "cohort_id": c_id,
            "program_id": p_id,
            "duration": f"{start} → {end}",
            "enrolled": enrolled,
            "seats": seats,
            "avg_score": round(avg_score, 1),
            "fluctuated_avg_score": fluctuated_avg,
            "ready_pct": ready_pct_val,
            "status": status,
            "readiness_flag": readiness_flag,
            "risk_level": risk_level,                  # NEW derived field
            "risk_explainers": explainers,             # NEW explainers list
            # XAI fields (deterministic, derived)
            "explanation_summary": xai["explanation_summary"],
            "explanation_factors": xai["explanation_factors"],
            "confidence_explanation": xai["confidence_explanation"],
            "decision_intelligence": decision_intelligence,
            "intervention": intervention
        })

    # -----------------------------
    # Aggregate risk summary (derived, read-only)
    # -----------------------------
    risk_counts = {"High": 0, "Medium": 0, "Low": 0}
    highest_risk = None
    for c in cohort_data:
        rl = c.get("risk_level", "Low")
        risk_counts[rl] = risk_counts.get(rl, 0) + 1
        if highest_risk is None and rl == "High":
            highest_risk = {"cohort_id": c["cohort_id"], "risk_level": rl}

    # if no high, pick a medium if present
    if highest_risk is None:
        for c in cohort_data:
            if c.get("risk_level") == "Medium":
                highest_risk = {"cohort_id": c["cohort_id"], "risk_level": "Medium"}
                break

    conn.close()

    return {
        "total_cohorts": len(cohort_data),
        "cohorts": cohort_data,
        "cohort_risk_summary": risk_counts,      # NEW summary
        "highest_risk_cohort": highest_risk      # NEW helper
    }
