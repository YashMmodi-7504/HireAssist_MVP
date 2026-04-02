from typing import Dict, List

def explain_cohort(readiness_flag: str, ready_pct: float, enrolled: int, seats: int, intervention: Dict) -> Dict:
    factors: List[str] = []

    # Primary performance signal
    if readiness_flag == "red":
        factors.append("Average assessment performance is below the expected threshold for the program.")
    elif readiness_flag == "amber":
        factors.append("Average assessment performance is close to the threshold and requires monitoring.")
    else:
        factors.append("Average assessment performance meets expectations.")

    # Readiness percentage signal
    if ready_pct < 30:
        factors.append("Fewer than 30% of learners are assessed as job-ready.")
    elif ready_pct < 60:
        factors.append("Between 30% and 60% of learners are assessed as job-ready.")
    else:
        factors.append("A majority of learners are assessed as job-ready.")

    # Enrollment vs capacity signal
    if seats and enrolled < (seats * 0.5):
        factors.append("Enrollment is low relative to capacity, which can reduce peer learning effects.")

    # Intervention signal
    if intervention and intervention.get("intervention_required"):
        itype = intervention.get("intervention_type", "intervention").replace("_", " ")
        factors.append(f"Recommended action: {itype}. This targets the primary risk drivers.")

    # Summary aligned strictly to readiness_flag
    if readiness_flag == "red":
        summary = "Cohort shows high risk indicators: assessment performance and readiness levels require urgent attention."
    elif readiness_flag == "amber":
        summary = "Cohort shows moderate risk indicators: performance is close to thresholds and should be monitored."
    else:
        summary = "Cohort shows low risk indicators: learners generally meet readiness and performance expectations."

    # Confidence explanation based on participation ratio
    ratio = (enrolled / seats) if seats else 0
    if ratio < 0.3:
        confidence = "Lower confidence: limited participation means signals may be less stable."
    elif ratio < 0.7:
        confidence = "Moderate confidence: participation provides reasonable insight into cohort performance."
    else:
        confidence = "High confidence: strong participation provides reliable signals about performance."

    return {
        "explanation_summary": summary,
        "explanation_factors": factors,
        "confidence_explanation": confidence
    }
