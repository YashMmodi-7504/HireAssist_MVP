import logging
from fastapi import APIRouter
from pydantic import BaseModel
from app.llm_service import LLMService

router = APIRouter(prefix="/api/ai", tags=["AI Chat"])
llm_service = LLMService()

SYSTEM_PROMPT = (
    "You are an expert computer science tutor, industry mentor, and interview coach.\n"
    "For every answer, strictly follow this format:\n\n"
    "Definition:\n"
    "<one concise paragraph>\n\n"
    "Real-World Examples:\n"
    "1. Example one\n"
    "2. Example two\n"
    "3. Example three\n\n"
    "Industry Applications:\n"
    "1. Industry – use case\n"
    "2. Industry – use case\n\n"
    "Interview Tip:\n"
    "<short confident advice>\n\n"
    "Rules:\n"
    "- Use ONLY plain text\n"
    "- Use numbered lists only\n"
    "- No markdown, no bullets, no symbols\n"
    "- Tone must be professional and confident\n"
    "- Never mention internal systems or context\n"
)

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    answer: str

@router.post("/message", response_model=ChatResponse)
async def chat(req: ChatRequest):
    logger = logging.getLogger("ai.chat")
    text = req.message.strip()
    logger.info(f"AI Chat request received: {text}")

    # Block resume/CV/profile questions
    if any(k in text.lower() for k in ["resume", "cv", "profile"]):
        return ChatResponse(answer="Sorry, please use the Resume Assistant tab for resume-related questions.")

    rag_context = ""
    try:
        # RAG context is optional, never required
        from app.services.rag_registry import get_store, get_embedding_service
        store = get_store("study")
        embedding_service = get_embedding_service()
        if store.texts:
            q_embedding = embedding_service.embed_text(text)
            results = store.search(q_embedding, top_k=3)
            if results:
                rag_context = "\n".join([r[0] for r in results])
    except Exception as e:
        logger.warning(f"Optional RAG context failed: {e}")

    user_prompt = f"{rag_context}\n\nQuestion: {text}" if rag_context else text

    try:
        logger.info("Calling LLMService for AI Chat")
        answer = await llm_service.generate(SYSTEM_PROMPT, user_prompt)
        logger.info("LLMService response generated")
        if not answer:
            return ChatResponse(answer="Sorry, the AI could not generate a response. Please try again.")
        return ChatResponse(answer=answer)
    except Exception as e:
        logger.error(f"LLMService error: {e}")
        return ChatResponse(answer="Sorry, there was an error generating the answer. Please try again.")
import logging
from fastapi import APIRouter
from pydantic import BaseModel
from app.llm_service import LLMService
from app.services.rag_registry import get_store, get_embedding_service

router = APIRouter(prefix="/api/ai", tags=["AI Chat"])
llm_service = LLMService()
SYSTEM_PROMPT = (
    "You are a senior computer science mentor and interview coach. STRICTLY follow this format for every answer:\n"
    "Title\n"
    "Short definition paragraph\n\n"
    "Real-world examples:\n"
    "- Example 1\n"
    "- Example 2\n\n"
    "Industry usage:\n"
    "- Use case 1\n"
    "- Use case 2\n\n"
    "Interview tip:\n"
    "One concise interview-ready explanation\n\n"
    "Do NOT use markdown symbols like *, **, or bullet asterisks. Use only plain text headings, line breaks, and clear spacing. Tone must be clear, confident, and professional."
)

class ChatRequest(BaseModel):
    message: str
class ChatResponse(BaseModel):
    answer: str

@router.post("/message", response_model=ChatResponse)
async def chat(req: ChatRequest):
    logger = logging.getLogger("ai.chat")
    text = req.message.strip()
    if not text:
        return ChatResponse(answer="Please enter a message.")

    # Only use RAG if question explicitly mentions resume/CV/profile/experience
    rag_keywords = ["resume", "cv", "my profile", "my experience"]
    use_rag = any(k in text.lower() for k in rag_keywords)
    user_prompt = text

    if use_rag:
        try:
            store = get_store("study")
            embedding_service = get_embedding_service()
            rag_context = ""
            if store.texts:
                q_embedding = embedding_service.embed_text(text)
                results = store.search(q_embedding, top_k=3)
                if results:
                    rag_context = "\n".join([r[0] for r in results])
            if rag_context:
                user_prompt = f"Context (optional):\n{rag_context}\n\nQuestion: {text}"
        except Exception as e:
            logger.error(f"[AI] RAG context error: {e}")

    try:
        answer = await llm_service.generate(SYSTEM_PROMPT, user_prompt)
        if not answer:
            return ChatResponse(answer="Sorry, the AI could not generate a response. Please try again.")
        return ChatResponse(answer=answer)
    except Exception as e:
        logger.error(f"[AI] LLM error: {e}")
        return ChatResponse(answer="Sorry, there was an error generating the answer. Please try again.")
