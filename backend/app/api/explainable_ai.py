from fastapi import APIRouter, Request, HTTPException
from app.services.unified_rag import UnifiedRAG
from app.services.auth import require_role, get_institution_id
from app.services.feature_gate import is_feature_enabled

router = APIRouter(prefix="/ai")

@router.post("/ask")
async def ask_ai(request: Request, payload: dict):
    user = getattr(request.state, 'user', None)
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    institution_id = get_institution_id(request)
    plan = user.get('plan', 'basic')
    domain = payload.get('domain')
    if not is_feature_enabled(plan, f"{domain}_rag"):
        raise HTTPException(status_code=403, detail="Feature not enabled for your plan")
    rag = UnifiedRAG(institution_id)
    answer = rag.ask(payload['question'], domain)
    return {"answer": answer, "explanation": "RAG-based, explainable output", "actions": ["Review context", "Follow recommendations"]}
