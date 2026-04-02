import faiss
import numpy as np

class VectorStore:
    def __init__(self, dim: int):
        self.index = faiss.IndexFlatL2(dim)
        self.texts = []

    def add(self, embeddings, chunks):
        vectors = np.array(embeddings).astype("float32")
        self.index.add(vectors)
        self.texts.extend(chunks)

    def search(self, query_embedding, top_k=3):
        if self.index.ntotal == 0:
            return []

        query = np.array([query_embedding]).astype("float32")
        D, I = self.index.search(query, top_k)

        results = []
        for idx in I[0]:
            if idx < len(self.texts):
                results.append(self.texts[idx])
        return results
