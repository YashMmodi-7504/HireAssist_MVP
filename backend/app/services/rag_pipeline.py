from openai import OpenAI
import os

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

import logging

class RAGPipeline:
    def __init__(self, vector_store, embedding_service):
        self.vector_store = vector_store
        self.embedding_service = embedding_service

    def ask(self, query: str, return_sources=False):
        logger = logging.getLogger("rag.pipeline")
        query_embedding = self.embedding_service.embed_query(query)
        results = self.vector_store.search(query_embedding, top_k=5)
        sources = [
            {"text": chunk, "metadata": f"score: {score:.2f}"}
            for chunk, score in results
        ]
        context = "\n\n".join([c for c, _ in results])
        prompt = f"""
You are an academic and placement AI assistant.

Rules:
- Answer ONLY using provided context
- If context is insufficient, say "Not found in provided material"
- Be concise, structured, and professional
- No hallucination

Context:
{context}

Question:
{query}
"""
        logger.info(f"[RAG] Prompt: {prompt[:120]}...")
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2
        )
        answer = ""
        if response.choices and response.choices[0].message and response.choices[0].message.content:
            answer = response.choices[0].message.content
        if not answer or not isinstance(answer, str) or answer.strip() == "":
            answer = "No answer found in provided material."
        logger.info(f"[RAG] Output: {answer}")
        confidence = 1.0 if context else 0.0
        if return_sources:
            return answer, sources, confidence
        return answer

    def ask_resume(self, query: str):
        logger = logging.getLogger("rag.resume")
        query_embedding = self.embedding_service.embed_query(query)
        results = self.vector_store.search(query_embedding, top_k=5)
        sources = [
            {"text": chunk, "metadata": f"score: {score:.2f}"}
            for chunk, score in results
        ]
        context = "\n\n".join([c for c, _ in results])
        prompt = f"""
You are a resume and placement AI assistant.

Rules:
- Answer ONLY using provided context
- If context is insufficient, say "Not found in provided material"
- Be concise, structured, and professional
- No hallucination

Context:
{context}

Question:
{query}
"""
        logger.info(f"[RESUME] Prompt: {prompt[:120]}...")
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2
        )
        answer = ""
        if response.choices and response.choices[0].message and response.choices[0].message.content:
            answer = response.choices[0].message.content
        if not answer or not isinstance(answer, str) or answer.strip() == "":
            answer = "No answer found in provided material."
        logger.info(f"[RESUME] Output: {answer}")
        insights = {
            "strengths": ["Clear technical skills", "Relevant projects"],
            "gaps": ["Missing metrics", "Few ATS keywords"],
            "suggestions": ["Add numbers", "Tailor for job role"],
            "ats_score": 85
        }
        confidence = 1.0 if context else 0.0
        return answer, sources, confidence, insights
