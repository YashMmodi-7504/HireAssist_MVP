from fastapi import APIRouter
from app.db import get_conn

router = APIRouter(prefix="/api/skills", tags=["Skills"])

SKILLS = [
    "python", "sql", "excel", "power bi", "tableau",
    "machine learning", "statistics", "aws", "azure",
    "data analysis"
]

@router.get("/heatmap")
def skills_heatmap():
    conn = get_conn()
    c = conn.cursor()

    rows = c.execute(
        "SELECT resume_text FROM candidates WHERE resume_text IS NOT NULL"
    ).fetchall()

    conn.close()

    counts = {s: 0 for s in SKILLS}

    for (text,) in rows:
        text = text.lower()
        for s in SKILLS:
            if s in text:
                counts[s] += 1

    return [
        {"skill": k, "count": v}
        for k, v in counts.items()
        if v > 0
    ]
