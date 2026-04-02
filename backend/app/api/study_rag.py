


import logging
from fastapi import APIRouter
from pydantic import BaseModel
from app.services.rag_registry import get_store, embedding_service
from app.llm_service import LLMService

router = APIRouter(prefix="/api/study", tags=["Study AI"])
llm_service = LLMService()


class StudyRequest(BaseModel):
    question: str

@router.post("/ask")
async def ask_study(req: StudyRequest):
    logger = logging.getLogger("study.rag")
    question = req.question.strip()
    store = get_store("study")
    context = ""
    if store.texts:
        try:
            q_embedding = embedding_service.embed_query(question)
            results = store.search(q_embedding, top_k=3)
            if results:
                context = "\n".join([r[0] for r in results])
        except Exception as e:
            logger.error(f"[STUDY] RAG error: {e}")
    try:
        if context:
            user_prompt = f"Context (optional):\n{context}\n\nQuestion: {question}"
        else:
            user_prompt = question
        answer = await llm_service.generate(
            "You are a senior computer science mentor. Use any context provided, but always answer the question professionally, clearly, and concisely.",
            user_prompt
        )
        return {"answer": answer}
    except Exception as e:
        logger.error(f"[STUDY] LLM error: {e}")
        return {"answer": "Sorry, there was an error preparing your answer. Please try again."}
