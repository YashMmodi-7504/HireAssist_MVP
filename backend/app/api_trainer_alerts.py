from fastapi import APIRouter
from app.db import get_conn

router = APIRouter()

@router.get("/alerts")
def trainer_alerts():
    conn = get_conn()
    c = conn.cursor()

    rows = c.execute("""
        SELECT 
            l.candidate_id,
            c.full_name,
            c.email,
            AVG(l.assessment_score) as avg_score,
            COUNT(*) as attempts
        FROM learners l
        JOIN candidates c ON l.candidate_id = c.id
        GROUP BY l.candidate_id
    """).fetchall()

    conn.close()

    alerts = []

    for cid, name, email, avg_score, attempts in rows:
        avg_score = avg_score or 0

        if avg_score < 50:
            risk = "HIGH"
        elif avg_score < 70:
            risk = "MEDIUM"
        else:
            risk = "LOW"

        alerts.append({
            "candidate_id": cid,
            "name": name,
            "email": email,
            "avg_score": round(avg_score, 1),
            "risk_level": risk,
            "attempts": attempts
        })

    return {
        "total_learners": len(alerts),
        "at_risk": [a for a in alerts if a["risk_level"] != "LOW"],
        "alerts": alerts
    }
