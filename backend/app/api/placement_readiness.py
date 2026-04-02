from fastapi import APIRouter
from app.services.placement_engine import PlacementEngine
from app.services.placement_rag import explain_readiness

router = APIRouter(prefix="/placement-ai")

engine = PlacementEngine()

@router.post("/evaluate")
async def evaluate(data: dict):
    score, status, risk = engine.calculate(
        data["attendance"],
        data["assessment"],
        data["ats_score"],
        data["skills_score"]
    )

    explanation = explain_readiness(data["gaps"])

    return {
        "score": score,
        "status": status,
        "risk": risk,
        "explanation": explanation
    }
