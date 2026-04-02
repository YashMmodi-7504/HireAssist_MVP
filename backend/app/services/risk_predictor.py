def predict_risk(student):
    risk = []
    if student["attendance"] < 70:
        risk.append("Attendance risk")
    if student["assessment_avg"] < 60:
        risk.append("Assessment risk")
    if student["resume_score"] < 65:
        risk.append("Resume risk")

    return {
        "risk_level": "High" if len(risk) >= 2 else "Medium" if risk else "Low",
        "reasons": risk
    }
