from app.services.rag_pipeline import RAGPipeline
from app.services.rag_registry import get_store, embedding_service

rag = RAGPipeline(
    vector_store=get_store("resume"),
    embedding_service=embedding_service
)

def explain_role(role, gaps):
    prompt = f"""
    Act as a senior career mentor.

    Role: {role}
    Missing skills: {gaps}

    Explain:
    - Why this role fits
    - Why gaps matter
    - How to close them
    """
    return rag.ask(prompt)
