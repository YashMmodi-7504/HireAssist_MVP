@router.get("/college-performance")
def college_performance():

    conn = get_conn()
    c = conn.cursor()

    rows = c.execute("""
        SELECT college_name,
               COUNT(*) as students,
               AVG(assessment_score) as avg_score,
               SUM(CASE WHEN placement_status='placed' THEN 1 ELSE 0 END)*1.0 / COUNT(*) as placement_rate
        FROM candidates
        GROUP BY college_name
    """).fetchall()

    conn.close()

    return {
        "colleges": [
            {
                "college": r[0],
                "students": r[1],
                "avg_assessment": round(r[2], 1),
                "placement_rate": round(r[3] * 100, 1)
            }
            for r in rows
        ]
    }
