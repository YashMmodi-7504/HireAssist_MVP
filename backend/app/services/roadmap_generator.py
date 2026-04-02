def generate_roadmap(role, gaps):
    return {
        "month_1": [f"Learn fundamentals of {g}" for g in gaps[:1]],
        "month_2": [f"Build project using {g}" for g in gaps[1:2]],
        "month_3": ["Mock interviews", "Resume optimization"]
    }
