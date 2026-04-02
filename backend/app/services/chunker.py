from typing import List
import re

class Chunker:
    """
    Splits text into chunks of 300-500 tokens for embedding.
    """
    def __init__(self, chunk_size: int = 400, overlap: int = 50):
        self.chunk_size = chunk_size
        self.overlap = overlap

    def chunk_text(self, text: str) -> List[str]:
        sentences = re.split(r'(?<=[.!?]) +', text)
        chunks = []
        current = []
        tokens = 0
        for sentence in sentences:
            sentence_tokens = len(sentence.split())
            if tokens + sentence_tokens > self.chunk_size:
                chunks.append(" ".join(current))
                current = current[-self.overlap:] if self.overlap else []
                tokens = sum(len(s.split()) for s in current)
            current.append(sentence)
            tokens += sentence_tokens
        if current:
            chunks.append(" ".join(current))
        return [c for c in chunks if c.strip()]
