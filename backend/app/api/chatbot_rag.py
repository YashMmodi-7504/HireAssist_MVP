
from fastapi import APIRouter, Request
from app.services.rag_pipeline import RAGPipeline
from app.services.rag_registry import get_store, embedding_service
from app.schemas.ai_response import AIResponse
import logging

router = APIRouter()

rag = RAGPipeline(
    vector_store=get_store("study"),
    embedding_service=embedding_service
)

@router.post("/chat")
async def chat_ai(request: Request, payload: dict):
    question = payload.get("question")
    logger = logging.getLogger("rag.study")
    logger.info(f"[STUDY] Query received: {question}")
    try:
        answer, sources, confidence = rag.ask(question, return_sources=True)
        logger.info(f"[STUDY] Retrieved {len(sources)} chunks. Answer: {answer}")
        if not sources or confidence == 0.0:
            return AIResponse(success=True, data={"answer": "No study material available. Please contact your administrator.", "sources": [], "confidence": 0.0}, error=None)
        return AIResponse(success=True, data={"answer": answer, "sources": sources, "confidence": confidence}, error=None)
    except Exception as e:
        logger.error(f"[STUDY] Error: {e}")
        return AIResponse(success=False, data=None, error=str(e))
