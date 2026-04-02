from sentence_transformers import SentenceTransformer
import numpy as np

class EmbeddingService:
    def __init__(self):
        self.model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
        self.dim = 384

    def embed_query(self, text: str):
        return self.model.encode(text).tolist()

    def embed_documents(self, texts):
        return self.model.encode(texts).tolist()


# 🔥 SIMPLE FUNCTION EXPORTS (TO FIX YOUR IMPORT ERRORS)
_service = EmbeddingService()

def embed_text(text: str):
    return _service.embed_query(text)

def embed_documents(texts):
    return _service.embed_documents(texts)
