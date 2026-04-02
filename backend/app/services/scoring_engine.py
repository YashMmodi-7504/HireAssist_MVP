def evaluate_candidate(candidate, learner_stats):
    score = 0
    strengths = []
    gaps = []

    skills = (candidate["resume_text"] or "").lower()

    SKILL_SET = ["python", "sql", "excel", "power bi", "statistics"]

    for skill in SKILL_SET:
        if skill in skills:
            score += 8
            strengths.append(skill)
        else:
            gaps.append(skill)

    if learner_stats.get("avg_score"):
        score += min(learner_stats["avg_score"] / 2, 20)

    score = min(int(score), 100)

    readiness = (
        "Job Ready" if score >= 75 else
        "Almost Ready" if score >= 50 else
        "Not Ready"
    )

    return {
        "employability_score": score,
        "readiness": readiness,
        "strengths": strengths,
        "skill_gaps": gaps
    }
