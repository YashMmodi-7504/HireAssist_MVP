from fastapi import APIRouter
from pydantic import BaseModel
from app.services.rag_registry import get_store, embedding_service

router = APIRouter(prefix="/api/study", tags=["Study AI"])


class StudyRequest(BaseModel):
    question: str


class StudyResponse(BaseModel):
    answer: str


@router.post("/ask", response_model=StudyResponse)
def ask_study(req: StudyRequest):
    question = req.question.strip()

    if not question:
        return {"answer": "Please ask a valid question."}

    store = get_store("study")

    if store.index.ntotal == 0:
        return {"answer": "Study material is not indexed yet."}

    query_embedding = embedding_service.embed_query(question)
    results = store.search(query_embedding, top_k=3)

    if not results:
        return {"answer": "No relevant study material found."}

    context = "\n\n".join([r[0] for r in results])
    return {"answer": f"Based on study material:\n\n{context[:1500]}"}
