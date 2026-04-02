
from fastapi import APIRouter, HTTPException
from app.services.embeddings import EmbeddingService
from backend.app.services.vector_store import VectorStore
from app.services.rag_pipeline import RAGPipeline

router = APIRouter()

# In-memory store for demo; use persistent storage in production
placement_vector_store = None
rag_pipeline = None
embedding_service = EmbeddingService()

@router.post("/rag/placement/upload")
async def upload_placement_material(text: str):
    # In production, accept file uploads or batch documents
    chunks = text.split("\n\n")
    embeddings = embedding_service.embed_documents(chunks)
    global placement_vector_store, rag_pipeline
    placement_vector_store = VectorStore(dim=len(embeddings[0]))
    placement_vector_store.add(embeddings, chunks)
    rag_pipeline = RAGPipeline(placement_vector_store, embedding_service)
    return {"message": "Placement material uploaded and indexed successfully.", "chunks": len(chunks)}

@router.post("/rag/placement/ask")
async def ask_placement_question(question: str):
    if rag_pipeline is None:
        raise HTTPException(status_code=400, detail="No placement material indexed.")
    answer = rag_pipeline.ask(question)
    return {"answer": answer}
