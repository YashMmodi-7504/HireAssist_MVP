from app.services.rag_pipeline import RAGPipeline
from app.services.rag_registry import get_store, embedding_service

rag = RAGPipeline(
    vector_store=get_store("resume"),
    embedding_service=embedding_service
)

def explain_readiness(gaps):
    prompt = f"""
    You are a placement advisor.

    Student gaps:
    {gaps}

    Explain clearly:
    - Why these gaps matter
    - How to fix them
    - What to prioritize in 30 days
    """
    return rag.ask(prompt)
