import logging
from fastapi import APIRouter
from pydantic import BaseModel
from app.llm_service import LLMService
from app.services.rag_registry import get_store, get_embedding_service

router = APIRouter(prefix="/api/resume", tags=["Resume Q&A"])
llm_service = LLMService()

RESUME_SYSTEM_PROMPT = (
    "You are a senior technical recruiter and career coach.\n"
    "For every answer, strictly follow this format:\n\n"
    "Profile Summary:\n"
    "<1–2 lines>\n\n"
    "Key Strengths:\n"
    "1. Technical strength with evidence from resume\n"
    "2. Analytical or problem-solving strength\n"
    "3. Communication or domain strength\n\n"
    "Career Advantage:\n"
    "<Explain why these strengths matter in jobs>\n\n"
    "Improvement Suggestion:\n"
    "<One clear next step>\n\n"
    "Rules:\n"
    "- Plain text only\n"
    "- Numbered lists only\n"
    "- No markdown or symbols\n"
    "- If resume content is missing, respond exactly:\n"
    "  'Please upload your resume first so I can analyze it.'\n"
)

class ResumeAskRequest(BaseModel):
    question: str
    candidate_id: str

class ResumeAskResponse(BaseModel):
    answer: str

@router.post("/ask", response_model=ResumeAskResponse)
async def ask_resume_question(req: ResumeAskRequest):
    logger = logging.getLogger("resume.rag")
    question = req.question.strip()
    candidate_id = req.candidate_id.strip()
    logger.info(f"Resume Q&A request received: {question}")

    store = get_store("resume", candidate_id)
    embedding_service = get_embedding_service()
    if not store.texts:
        logger.info("No resume content found for candidate.")
        return ResumeAskResponse(answer="Please upload your resume first so I can analyze it.")

    rag_context = ""
    try:
        q_embedding = embedding_service.embed_text(question)
        results = store.search(q_embedding, top_k=5)
        if results:
            rag_context = "\n".join([r[0] for r in results])
    except Exception as e:
        logger.warning(f"Optional resume RAG context failed: {e}")

    user_prompt = f"{rag_context}\n\nQuestion: {question}" if rag_context else question

    try:
        logger.info("Calling LLMService for Resume Q&A")
        answer = await llm_service.generate(RESUME_SYSTEM_PROMPT, user_prompt)
        logger.info("LLMService response generated")
        if not answer:
            return ResumeAskResponse(answer="Sorry, the AI could not generate a response. Please try again.")
        return ResumeAskResponse(answer=answer)
    except Exception as e:
        logger.error(f"LLMService error: {e}")
        return ResumeAskResponse(answer="Sorry, there was an error generating the answer. Please try again.")
import logging
from fastapi import APIRouter, UploadFile, File, Form
from pydantic import BaseModel
from app.llm_service import LLMService
from app.services.rag_registry import get_store, get_embedding_service


router = APIRouter(prefix="/api/resume", tags=["Resume Q&A"])
llm_service = LLMService()
RESUME_SYSTEM_PROMPT = (
    "You are a senior technical recruiter and career coach. Strictly follow this format for every answer:\n"
    "Profile Summary:\n"
    "Concise professional summary inferred from resume\n\n"
    "Key Strengths:\n"
    "- Strength 1 with justification\n"
    "- Strength 2 with justification\n\n"
    "Skill Gaps:\n"
    "- Missing skill 1 with recommendation\n"
    "- Missing skill 2 with recommendation\n\n"
    "Role Fit:\n"
    "Best suited roles with reasoning\n\n"
    "Actionable Improvements:\n"
    "Clear next steps in bullet format\n\n"
    "Do NOT use markdown symbols like *, **, or bullet asterisks. Use only plain text headings, line breaks, and clear spacing. If resume content is missing, respond: 'Please upload your resume first so I can analyze it.'"
)

# Request/Response models
class ResumeAskRequest(BaseModel):
    question: str
    candidate_id: str
class ResumeAskResponse(BaseModel):
    answer: str



# =============================
# POST /api/resume/ask (JSON)
# =============================
@router.post("/ask", response_model=ResumeAskResponse)
async def ask_resume_question(req: ResumeAskRequest):
    logger = logging.getLogger("rag.resume")
    question = req.question.strip()
    candidate_id = req.candidate_id.strip()
    store = get_store("resume", candidate_id)
    embedding_service = get_embedding_service()
    if not store.texts:
        return ResumeAskResponse(answer="Please upload your resume first so I can analyze it.")
    try:
        q_embedding = embedding_service.embed_text(question)
        results = store.search(q_embedding, top_k=5)
        context = "\n".join([r[0] for r in results]) if results else ""
        # Always use LLM, enrich with resume context if available
        if context:
            user_prompt = f"Resume context (optional):\n{context}\n\nQuestion: {question}"
        else:
            user_prompt = question
        answer = await llm_service.generate(RESUME_SYSTEM_PROMPT, user_prompt)
        return ResumeAskResponse(answer=answer)
    except Exception as e:
        logger.error(f"[RESUME] Ask error: {e}")
        return ResumeAskResponse(answer="Please upload your resume first so I can analyze it.")
