def resume_job_fit(resume_skills, job_skills, experience, min_exp):
    skill_score = len(set(resume_skills) & set(job_skills)) / max(len(job_skills), 1)
    exp_score = min(experience / max(min_exp, 1), 1)

    final = (skill_score * 0.7) + (exp_score * 0.3)
    return round(final * 100, 2)
