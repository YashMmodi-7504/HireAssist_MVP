# app/core/whatif_engine.py

from typing import Dict


def simulate_whatif(
    current_at_risk_pct: float,
    readiness_flag: str,
    trainer_readiness_improvement_pct: float = 0,
    skill_gap_reduction_pct: float = 0
) -> Dict:
    """
    Deterministic what-if simulation engine
    NO DB writes
    NO randomness
    """

    # ---- Risk reduction logic (simple & explainable) ----
    risk_reduction = (
        (trainer_readiness_improvement_pct * 0.4) +
        (skill_gap_reduction_pct * 0.6)
    )

    projected_at_risk = max(
        0,
        round(current_at_risk_pct - risk_reduction, 1)
    )

    # ---- Readiness flag projection ----
    if projected_at_risk >= 40:
        projected_flag = "red"
    elif projected_at_risk >= 25:
        projected_flag = "amber"
    else:
        projected_flag = "green"

    return {
        "projected_at_risk_pct": projected_at_risk,
        "risk_delta": round(projected_at_risk - current_at_risk_pct, 1),
        "projected_readiness_flag": projected_flag
    }
