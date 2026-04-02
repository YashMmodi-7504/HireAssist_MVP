from app.services.rag_pipeline import RAGPipeline
from app.services.rag_registry import get_store, embedding_service

class UnifiedRAG:
    def __init__(self, institution_id: str):
        # In a real system, use institution_id to select the right vector stores
        self.resume_store = get_store(f"resume_{institution_id}")
        self.study_store = get_store(f"study_{institution_id}")
        self.placement_store = get_store(f"placement_{institution_id}")
        self.embedding_service = embedding_service

    def ask(self, query: str, domain: str):
        if domain == "resume":
            store = self.resume_store
        elif domain == "study":
            store = self.study_store
        elif domain == "placement":
            store = self.placement_store
        else:
            raise ValueError("Invalid RAG domain")
        rag = RAGPipeline(vector_store=store, embedding_service=self.embedding_service)
        return rag.ask(query)
