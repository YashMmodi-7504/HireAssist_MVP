def placement_probability(candidate, college_stats):
    """
    candidate: dict with skills, assessment_score, completion_status, experience_years
    college_stats: dict with avg_placement_rate
    """

    score = 0

    # 1. Assessment (40%)
    score += min(candidate["assessment_score"] / 100, 1.0) * 0.40

    # 2. Skills (25%)
    score += min(len(candidate["skills"]) / 10, 1.0) * 0.25

    # 3. Completion status (15%)
    if candidate["completion_status"] == "completed":
        score += 0.15

    # 4. Experience (10%)
    score += min(candidate["experience_years"] / 3, 1.0) * 0.10

    # 5. College placement history (10%)
    score += college_stats.get("avg_placement_rate", 0.5) * 0.10

    return round(score * 100, 2)  # percentage
