from fastapi import APIRouter
from app.services.placement_score import calculate_prs
from app.services.risk_predictor import predict_risk

router = APIRouter(prefix="/placement")

@router.post("/score")
async def score(payload: dict):
    prs = calculate_prs(payload["student"])
    return {"placement_readiness_score": prs}

@router.post("/risk")
async def risk(payload: dict):
    risk_info = predict_risk(payload["student"])
    return risk_info
