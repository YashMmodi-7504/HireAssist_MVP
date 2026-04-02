class CareerEngine:
    ROLE_MATRIX = {
        "Data Analyst": ["SQL", "Excel", "Power BI", "Statistics"],
        "ML Engineer": ["Python", "ML", "Math", "Projects"],
        "Backend Developer": ["Python", "APIs", "Databases"],
        "Business Analyst": ["Excel", "Communication", "Documentation"]
    }

    def recommend(self, skills):
        scores = {}
        for role, reqs in self.ROLE_MATRIX.items():
            match = len(set(skills) & set(reqs))
            scores[role] = round((match / len(reqs)) * 100)

        ranked = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        return ranked
