class RecruiterMatchEngine:
    def score_student(self, student, job):
        skill_match = len(set(student["skills"]) & set(job["required_skills"]))
        skill_score = round((skill_match / len(job["required_skills"])) * 100)

        resume_score = student["resume_score"]
        attendance_score = student["attendance"]
        assessment_score = student["assessment_avg"]

        final_score = round(
            (skill_score * 0.4) +
            (resume_score * 0.25) +
            (assessment_score * 0.25) +
            (attendance_score * 0.10)
        )

        return final_score
