import os
import json
from typing import List, Dict, Any
from .utils.file_loaders import load_text_from_file, simple_chunk

def ingest_file(path: str) -> Dict[str, Any]:
    """
    Process the uploaded file, extract text, split into chunks, and generate metadata.
    The chunks are stored in a JSON file (document.json).
    """
    if not os.path.exists(path):
        raise FileNotFoundError(f"File not found: {path}")

    # Extract text from the file (DOCX, PDF, TXT, etc.)
    try:
        text = load_text_from_file(path)
    except Exception as e:
        raise Exception(f"Error loading text from file {path}: {str(e)}")

    if not text:
        raise ValueError(f"Extracted text is empty from file: {path}")

    # Log the length of extracted text for debugging
    print(f"Extracted {len(text)} characters from {path}")

    # Split the extracted text into chunks
    chunks = simple_chunk(text, chunk_size=700, overlap=100)

    # Log the number of chunks created for debugging
    print(f"Created {len(chunks)} chunks from {path}")

    # Build metadata for each chunk
    metadata_list: List[Dict[str, Any]] = []
    for i, _ in enumerate(chunks):
        metadata_list.append({
            "source": os.path.basename(path),  # File name as the source
            "chunk": i  # Index of the chunk
        })

    # Save the chunks and metadata to a JSON file (document.json)
    document_data = {
        "chunks": chunks,
        "metadata_list": metadata_list,
    }

    # Define the path for the JSON file (document.json)
    json_file_path = os.path.join(os.path.dirname(path), "document.json")
    
    try:
        with open(json_file_path, 'w', encoding='utf-8') as f:
            json.dump(document_data, f, ensure_ascii=False, indent=4)
        print(f"Chunks and metadata saved to {json_file_path}")
    except Exception as e:
        print(f"Error saving to {json_file_path}: {str(e)}")
        raise

    return {
        "chunks": chunks,
        "metadata_list": metadata_list,
        "num_chunks": len(chunks),
        "chars": len(text)
    }
