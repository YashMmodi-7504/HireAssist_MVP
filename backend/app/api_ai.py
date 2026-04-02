from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.db import get_conn
from app.services.scoring_engine import evaluate_candidate
from app.services.realism_engine import fluctuate_score, readiness_from_score

router = APIRouter(prefix="/api/ai", tags=["AI"])

# -------------------------------
# Request Model
# -------------------------------
class AIRequest(BaseModel):
    candidate_id: int

# -------------------------------
# Skill Vocabulary
# -------------------------------
SKILLS = [
    "python", "sql", "excel", "power bi", "tableau",
    "etl", "dbt", "snowflake", "machine learning",
    "statistics", "communication", "cloud", "aws",
    "azure", "data analysis", "airflow"
]

# -------------------------------
# Utilities
# -------------------------------
def extract_skills(text: str):
    text = (text or "").lower()
    return [s for s in SKILLS if s in text]

def readiness_label(score: int):
    if score >= 75:
        return "Job Ready"
    if score >= 50:
        return "Near Ready"
    return "Needs Training"

# -------------------------------
# AI EVALUATION (INTERNAL)
# -------------------------------
@router.get("/evaluate/{candidate_id}")
def evaluate(candidate_id: int):
    conn = get_conn()
    c = conn.cursor()

    cand = c.execute(
        "SELECT resume_text FROM candidates WHERE id=?",
        (candidate_id,)
    ).fetchone()

    if not cand:
        conn.close()
        raise HTTPException(404, "Candidate not found")

    learner = c.execute(
        "SELECT AVG(assessment_score) FROM learners WHERE candidate_id=?",
        (candidate_id,)
    ).fetchone()

    conn.close()

    raw = evaluate_candidate(
        {"resume_text": cand[0]},
        {"avg_score": learner[0] or 0}
    )

    # Apply deterministic fluctuation to the employability score and map to green/amber/red
    base_score = int(raw.get("employability_score", 0))
    fluctuated = fluctuate_score(base_score, candidate_id)
    readiness_flag = readiness_from_score(fluctuated)

    return {
        "employability_score": int(fluctuated),
        "readiness_level": readiness_flag,
        "strengths": raw.get("strengths", []),
        "skill_gaps": raw.get("skill_gaps", [])
    }

# -------------------------------
# AI RECOMMEND TRAINING (FRONTEND)
# -------------------------------
@router.post("/recommend-training")
def recommend_training(req: AIRequest):
    conn = get_conn()
    c = conn.cursor()

    row = c.execute(
        """
        SELECT id, full_name, resume_text
        FROM candidates
        WHERE id=?
        """,
        (req.candidate_id,)
    ).fetchone()

    if not row:
        conn.close()
        raise HTTPException(404, "Candidate not found")

    cid, name, resume_text = row
    student_skills = extract_skills(resume_text)

    programs_raw = c.execute(
        "SELECT id, title, description FROM training_programs"
    ).fetchall()

    programs = []
    all_program_skills = set()

    for pid, title, desc in programs_raw:
        prog_skills = extract_skills(desc)
        all_program_skills.update(prog_skills)

        overlap = set(student_skills) & set(prog_skills)
        score = round((len(overlap) / len(prog_skills)) * 100, 1) if prog_skills else 0

        programs.append({
            "program_id": pid,
            "title": title,
            "score": score,
            "explanation": {
                "matched_skills": list(overlap),
                "missing_skills": list(set(prog_skills) - set(student_skills))
            }
        })

    programs.sort(key=lambda x: x["score"], reverse=True)

    employability_score = min(100, 40 + len(student_skills) * 8)
    readiness = readiness_label(employability_score)

    conn.close()

    return {
        "candidate_id": cid,
        "student_name": name,
        "employability_score": employability_score,
        "readiness_level": readiness,
        "strengths": student_skills,
        "skill_gaps": list(all_program_skills - set(student_skills)),
        "recommended_programs": programs[:3]
    }
