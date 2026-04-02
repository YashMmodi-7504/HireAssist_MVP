def calculate_prs(student):
    return round(
        student["skills_match"] * 0.3 +
        student["resume_score"] * 0.25 +
        student["assessment_avg"] * 0.2 +
        student["attendance"] * 0.1 +
        student["projects_score"] * 0.1 +
        student["ai_confidence"] * 0.05
    )
