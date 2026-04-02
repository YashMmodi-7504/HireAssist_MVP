from fastapi import APIRouter, Query
from app.db import get_conn

router = APIRouter()

@router.get("/insights")
def get_insights(
    college: str = Query(None),
    status: str = Query(None)  # enrolled / completed
):
    conn = get_conn()
    c = conn.cursor()

    conditions = []
    params = []

    if college:
        conditions.append("college_name = ?")
        params.append(college)

    if status:
        conditions.append("completion_status = ?")
        params.append(status)

    where_sql = "WHERE " + " AND ".join(conditions) if conditions else ""

    # 1️⃣ Learners Trained
    trained = c.execute(
        f"SELECT COUNT(*) FROM candidates {where_sql}", params
    ).fetchone()[0]

    # 2️⃣ Actual Placements (REAL DATA)
    placed = c.execute(
        f"""
        SELECT COUNT(*) FROM candidates
        {where_sql}
        {"AND" if where_sql else "WHERE"} placement_status='placed'
        """,
        params
    ).fetchone()[0]

    # 3️⃣ Average Assessment Score
    avg_score = c.execute(
        f"SELECT AVG(assessment_score) FROM candidates {where_sql}",
        params
    ).fetchone()[0] or 0

    # 4️⃣ College-wise distribution
    college_rows = c.execute("""
        SELECT college_name,
               COUNT(*) AS total,
               SUM(CASE WHEN placement_status='placed' THEN 1 ELSE 0 END) AS placed
        FROM candidates
        GROUP BY college_name
    """).fetchall()

    conn.close()

    return {
        "trained": trained,
        "placements": placed,
        "avg_score": round(avg_score, 2),
        "college_distribution": [
            {
                "college": r[0],
                "students": r[1],
                "placed": r[2],
                "placement_rate": round((r[2] / r[1]) * 100, 1) if r[1] else 0
            }
            for r in college_rows
        ]
    }
