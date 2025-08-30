# backend/vectorstore/faiss_store.py
import os
import json
from typing import List, Tuple

import faiss
from sentence_transformers import SentenceTransformer

# Paths
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
PERSIST_DIR = os.path.join(BASE_DIR, "vectorstore")
os.makedirs(PERSIST_DIR, exist_ok=True)

INDEX_FILE = os.path.join(PERSIST_DIR, "faiss_index.bin")
DOCS_FILE = os.path.join(PERSIST_DIR, "document.json")

# Embedding model (384-dim)
MODEL_NAME = "all-MiniLM-L6-v2"
_model = SentenceTransformer(MODEL_NAME)
EMB_DIM = 384

# Load / init FAISS
if os.path.exists(INDEX_FILE):
    index = faiss.read_index(INDEX_FILE)
else:
    index = faiss.IndexFlatL2(EMB_DIM)

# Load docs metadata
if os.path.exists(DOCS_FILE):
    with open(DOCS_FILE, "r", encoding="utf-8") as f:
        documents = json.load(f)
else:
    documents = []


def _save_index_and_docs():
    faiss.write_index(index, INDEX_FILE)
    with open(DOCS_FILE, "w", encoding="utf-8") as f:
        json.dump(documents, f, indent=2, ensure_ascii=False)


def reset_store():
    """Delete index + metadata and re-init."""
    global index, documents
    if os.path.exists(INDEX_FILE):
        os.remove(INDEX_FILE)
    if os.path.exists(DOCS_FILE):
        os.remove(DOCS_FILE)
    index = faiss.IndexFlatL2(EMB_DIM)
    documents = []
    _save_index_and_docs()


def add_documents(chunks: List[str], metadata_list: List[dict]) -> int:
    """Append chunks + metadata, persist to disk, and update FAISS index."""
    if not chunks:
        return 0

    # Encode the new chunks into embeddings
    embeddings = _model.encode(chunks)

    # Add the new embeddings to the FAISS index
    index.add(embeddings)

    # Append the new chunks and metadata to the documents list
    for txt, meta in zip(chunks, metadata_list):
        documents.append({"page_content": txt, "metadata": meta})

    # Save both the FAISS index and documents metadata to disk
    _save_index_and_docs()

    print(f"✅ Added {len(chunks)} chunks. Total vectors in index: {index.ntotal}")
    return len(chunks)

def search_documents(query: str, top_k: int = 3) -> List[Tuple[dict, float]]:
    """Return up to top_k unique (doc, distance)."""
    if index.ntotal == 0:
        return []

    qemb = _model.encode([query])
    distances, indices = index.search(qemb, top_k)

    seen = set()
    out: List[Tuple[dict, float]] = []
    for idx, dist in zip(indices[0], distances[0]):
        if idx == -1 or idx >= len(documents):
            continue
        if idx in seen:
            continue
        seen.add(idx)
        out.append((documents[idx], float(dist)))
    return out


def stats() -> dict:
    return {
        "total_vectors": int(index.ntotal),
        "total_documents": len(documents),
        "model": MODEL_NAME,
        "persist_dir": PERSIST_DIR,
        "index_file": INDEX_FILE,
        "docs_file": DOCS_FILE,
    }
