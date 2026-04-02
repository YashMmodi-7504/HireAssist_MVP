from fastapi import APIRouter
from app.db import get_conn

router = APIRouter(prefix="/api/skills", tags=["Skills"])

@router.get("/heatmap")
def skill_gap_heatmap():
    conn = get_conn()
    c = conn.cursor()

    try:
        rows = c.execute("""
            SELECT skill, COUNT(*) as demand
            FROM analytics_events
            WHERE event_type='skill_gap' AND skill IS NOT NULL
            GROUP BY skill
            ORDER BY demand DESC
        """).fetchall()
    except Exception:
        # Table might be empty or missing — return empty list gracefully
        conn.close()
        return []

    conn.close()

    if not rows:
        return []

    return [{"skill": r[0], "demand": r[1] or 0} for r in rows]
