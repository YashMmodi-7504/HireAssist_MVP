# Feature gating for paid plans

FEATURES = {
    "basic": ["resume_rag", "study_rag"],
    "pro": ["placement_rag", "career_ai", "recruiter_shortlist"],
    "enterprise": ["institution_analytics", "risk_predictor"]
}

def is_feature_enabled(plan, feature):
    for tier, features in FEATURES.items():
        if plan == tier and feature in features:
            return True
    return False
