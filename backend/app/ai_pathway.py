# ai_pathway.py
def compute_employability(strengths, gaps, assessment=None):
    base = len(strengths) * 10
    penalty = len(gaps) * 5
    score = max(0, base - penalty)

    if assessment:
        score += int(assessment * 0.5)

    return min(score, 100)


def recommend_best_cohort(candidate_skills, programs, cohorts):
    best = None
    best_score = -1

    for p in programs:
        prog_skills = p["skills_required"]
        prog_score = len([s for s in prog_skills if s in candidate_skills])

        # get cohorts for this program
        relevant = [c for c in cohorts if c["program_id"] == p["program_id"]]

        if relevant and prog_score > best_score:
            best_score = prog_score
            best = {
                "program_title": p["title"],
                "cohort": relevant[0],
                "match_score": best_score
            }

    return best
