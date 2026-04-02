from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
import pdfplumber
from app.services.llm import ask_llm

router = APIRouter()

RESUME_TEXT = ""

class ResumeQuestion(BaseModel):
    question: str

@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    global RESUME_TEXT

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF resumes supported")

    text = ""
    with pdfplumber.open(file.file) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""

    if not text.strip():
        raise HTTPException(status_code=400, detail="Empty resume")

    RESUME_TEXT = text

    return {"status": "success", "message": "Resume uploaded successfully"}

@router.post("/ask")
async def ask_resume(req: ResumeQuestion):
    if not RESUME_TEXT:
        return {"answer": "No resume uploaded yet."}

    context = f"""
Resume Content:
{RESUME_TEXT}
"""

    answer = ask_llm(req.question, context=context)
    return {"answer": answer}
