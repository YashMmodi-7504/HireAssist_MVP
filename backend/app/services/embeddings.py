import numpy as np
from typing import List
from importlib import import_module

try:
    SentenceTransformer = import_module("sentence_transformers").SentenceTransformer
except Exception:
    SentenceTransformer = None


class EmbeddingService:
    def __init__(self):
        self.dim = 384
        self.model = None
        if SentenceTransformer is not None:
            self.model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

    def _fallback_embed(self, text: str) -> List[float]:
        # Deterministic character-hash embedding used when transformer model is unavailable.
        vec = np.zeros(self.dim, dtype=float)
        for token in text.lower().split():
            idx = hash(token) % self.dim
            vec[idx] += 1.0
        norm = np.linalg.norm(vec)
        if norm > 0:
            vec = vec / norm
        return vec.tolist()

    def embed_query(self, text: str) -> List[float]:
        if not text:
            return np.zeros(self.dim).tolist()
        if self.model is None:
            return self._fallback_embed(text)
        return self.model.encode(text).tolist()

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        if not texts:
            return []
        if self.model is None:
            return [self._fallback_embed(text) for text in texts]
        return self.model.encode(texts).tolist()

    def embed_text(self, text: str) -> List[float]:
        return self.embed_query(text)
