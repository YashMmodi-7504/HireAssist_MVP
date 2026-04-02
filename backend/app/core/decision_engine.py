# app/core/decision_engine.py

from typing import List, Dict, Optional

# -------------------------------
# Threshold Constants
# -------------------------------
AT_RISK_INTERVENE_THRESHOLD = 25
AT_RISK_ESCALATE_THRESHOLD = 40
TIME_ESCALATE_DAYS = 14


def compute_decision_intelligence(
    readiness_flag: str,
    trend: str,
    at_risk_percentage: Optional[float] = None,
    time_in_state_days: Optional[int] = None,
    skill_gap_count: Optional[int] = None
) -> Dict:
    """
    Deterministic decision intelligence engine.
    NO DB calls. NO randomness. Backend-only logic.
    """

    reason_codes: List[str] = []

    # -------------------------------
    # Reason Code Detection
    # -------------------------------
    if readiness_flag == "red":
        reason_codes.append("critical_readiness")

    if trend == "↓":
        reason_codes.append("sustained_decline")

    if time_in_state_days is not None and time_in_state_days >= TIME_ESCALATE_DAYS:
        reason_codes.append("time_threshold_exceeded")

    if at_risk_percentage is not None:
        if at_risk_percentage >= AT_RISK_INTERVENE_THRESHOLD:
            reason_codes.append("high_risk_population")

    if skill_gap_count is not None and skill_gap_count > 0:
        reason_codes.append("skill_gap_exceeds_threshold")

    # -------------------------------
    # Decision State Logic
    # -------------------------------
    decision_state = "monitor"

    if (
        readiness_flag == "red"
        and trend == "↓"
        and time_in_state_days is not None
        and time_in_state_days >= TIME_ESCALATE_DAYS
    ) or (
        at_risk_percentage is not None
        and at_risk_percentage >= AT_RISK_ESCALATE_THRESHOLD
    ):
        decision_state = "escalate"

    elif (
        readiness_flag == "red"
        or (readiness_flag == "amber" and trend == "↓")
        or (at_risk_percentage is not None and at_risk_percentage >= AT_RISK_INTERVENE_THRESHOLD)
    ):
        decision_state = "intervene"

    # -------------------------------
    # Confidence Level Logic
    # -------------------------------
    if len(reason_codes) >= 3:
        confidence_level = "high"
    elif len(reason_codes) == 2:
        confidence_level = "medium"
    else:
        confidence_level = "low"

    return {
        "decision_state": decision_state,
        "confidence_level": confidence_level,
        "reason_codes": reason_codes
    }