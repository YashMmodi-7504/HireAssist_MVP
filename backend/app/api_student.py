from fastapi import APIRouter, Depends
from app.auth import get_current_user
from app.db import get_conn
from app.api_progress import student_progress

router = APIRouter()

@router.get("/api/student/dashboard")
def student_dashboard(payload: dict = Depends(get_current_user)):
    """Aggregate student-centric dashboard data for the frontend.

    Returns a consistent shape even if some backend pieces are missing.
    """
    user_id = int(payload.get("sub")) if payload.get("sub") else None

    conn = get_conn()
    c = conn.cursor()

    # Attempt to find linked candidate id from users table
    linked = c.execute("SELECT linked_candidate_id, email FROM users WHERE id=?", (user_id,)).fetchone()

    result = {
        "student": {"name": None, "email": None},
        "program": {"name": None, "cohort": None},
        "progress": {"completed": 0, "total": 12},
        "attendance_pct": None,
        "learning_status": None,
        "upcoming_assessment": None,
        "courses": [],
        "profile_readiness": 0,
    }

    if linked:
        linked_candidate_id = linked[0]
        result["student"]["email"] = linked[1]
    else:
        linked_candidate_id = None

    if not linked_candidate_id:
        conn.close()
        return result

    # Candidate details
    cand = c.execute(
        "SELECT id, full_name, email, resume_text, assessment_score, placement_status, attendance_pct FROM candidates WHERE id=?",
        (linked_candidate_id,)
    ).fetchone()

    if cand:
        cid, full_name, email, resume_text, assessment_score, placement_status, attendance_pct = cand
        result["student"]["name"] = full_name
        result["student"]["email"] = email or result["student"]["email"]
        result["attendance_pct"] = attendance_pct

    # Progress & readiness (reuse existing logic)
    try:
        prog = student_progress(linked_candidate_id)
        score = prog.get("progress_score") if prog else 0
        readiness = prog.get("readiness") if prog else None
    except Exception:
        score = 0
        readiness = None

    # Map progress to modules (12 total)
    total_modules = 12
    completed = round((score or 0) / 100 * total_modules)

    result["progress"] = {"completed": completed, "total": total_modules}
    result["learning_status"] = readiness
    result["profile_readiness"] = score or 0

    # Enrolled courses (learner's cohorts)
    rows = c.execute(
        """
        SELECT c.id, p.title, c.start_date, c.end_date, c.status, c.enrolled_count
        FROM learners l
        JOIN cohorts c ON l.cohort_id = c.id
        JOIN training_programs p ON c.program_id = p.id
        WHERE l.candidate_id = ?
        ORDER BY c.start_date DESC
        """,
        (linked_candidate_id,)
    ).fetchall()

    courses = []
    for r in rows:
        cid, program_title, start_date, end_date, status, enrolled_count = r
        courses.append({
            "cohort_id": cid,
            "program_title": program_title,
            "start_date": start_date,
            "end_date": end_date,
            "status": status,
            "enrolled_count": enrolled_count,
        })

    result["courses"] = courses

    # Upcoming assessment: best-effort (no explicit table -> rely on candidate upcoming_assessments if present)
    # Some deployments may store upcoming assessments in a lessons table; fallback to None
    # For now, check if candidate row has assessment_score and treat upcoming assessment as None

    conn.close()
    return result
