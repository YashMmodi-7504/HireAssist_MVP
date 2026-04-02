from app.services.study_loader import StudyLoader
from app.services.rag_registry import get_store, embedding_service

def index_study_material():
    texts = StudyLoader.load_folder("data/study_docs")
    chunks = []
    for t in texts:
        chunks.extend([t[i:i+800] for i in range(0, len(t), 800)])
    embeddings = embedding_service.embed_documents(chunks)
    store = get_store("study")
    # Only add if embeddings and chunks are valid and embeddings is 2D
    if embeddings and chunks and isinstance(embeddings, list) and hasattr(embeddings[0], '__len__'):
        store.add(embeddings, chunks)
    else:
        print("[WARN] No valid study material found to index.")
