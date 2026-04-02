from fastapi import APIRouter
from app.services.recruiter_match_engine import RecruiterMatchEngine

router = APIRouter(prefix="/recruiter")
engine = RecruiterMatchEngine()

@router.post("/shortlist")
async def shortlist(payload: dict):
    students = payload["students"]
    job = payload["job"]
    ranked = []
    for student in students:
        score = engine.score_student(student, job)
        ranked.append({
            "student_id": student["id"],
            "score": score,
            "explanation": f"Skill match: {score}% | Resume: {student['resume_score']} | Assessment: {student['assessment_avg']} | Attendance: {student['attendance']}"
        })
    ranked.sort(key=lambda x: x["score"], reverse=True)
    return {"ranked_students": ranked}
