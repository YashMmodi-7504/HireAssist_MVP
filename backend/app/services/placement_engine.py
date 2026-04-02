class PlacementEngine:
    def calculate(self, attendance, assessment, ats_score, skills_score):
        score = (
            attendance * 0.25 +
            assessment * 0.30 +
            ats_score * 0.25 +
            skills_score * 0.20
        )

        if score >= 80:
            status = "Ready"
            risk = "Low"
        elif score >= 60:
            status = "Almost Ready"
            risk = "Medium"
        else:
            status = "Not Ready"
            risk = "High"

        return round(score), status, risk
