from app.services.vector_store import VectorStore
from app.services.embeddings import EmbeddingService

_embedding_service = EmbeddingService()
_stores = {}

def get_store(name: str):
    if name not in _stores:
        _stores[name] = VectorStore(dim=_embedding_service.dim)
    return _stores[name]


embedding_service = _embedding_service

def get_embedding_service():
    """Return the singleton embedding service instance."""
    return embedding_service
