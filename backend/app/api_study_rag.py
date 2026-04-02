from fastapi import APIRouter
from pydantic import BaseModel
from app.services.rag_registry import get_store, embedding_service

router = APIRouter(prefix="/api/study", tags=["Study AI"])

class StudyRequest(BaseModel):
    question: str

@router.post("/ask")
async def ask_study(req: StudyRequest):
    store = get_store("study")

    q_embedding = embedding_service.embed_query(req.question)
    results = store.search(q_embedding, top_k=3)

    if not results:
        return {"answer": "No relevant study material found."}

    context = "\n".join([r[0] for r in results])

    # SIMPLE deterministic answer (safe MVP)
    answer = f"Based on study material:\n{context[:1500]}"

    return {"answer": answer}
