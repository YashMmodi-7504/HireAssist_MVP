from fastapi import APIRouter
from app.services.career_engine import CareerEngine
from app.services.career_rag import explain_role
from app.services.roadmap_generator import generate_roadmap

router = APIRouter(prefix="/career-ai")

engine = CareerEngine()

@router.post("/recommend")
async def recommend(data: dict):
    ranked = engine.recommend(data["skills"])
    best_role, confidence = ranked[0]

    gaps = list(set(engine.ROLE_MATRIX[best_role]) - set(data["skills"]))

    return {
        "primary_role": best_role,
        "confidence": confidence,
        "alternate_roles": [r for r, _ in ranked[1:3]],
        "explanation": explain_role(best_role, gaps),
        "roadmap_90_days": generate_roadmap(best_role, gaps)
    }
