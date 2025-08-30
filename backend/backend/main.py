from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import PlainTextResponse
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv  # For loading environment variables from .env
import traceback
from .vectorstore.faiss_store import search_documents, add_documents, reset_store, stats
from .ingestion import ingest_file
from groq import Groq
import json
from typing import List  # Import List from typing

# Load environment variables from the .env file
load_dotenv()

# Set your Grok AI API key from the environment variable
GROK_API_KEY = os.getenv("GROK_API_KEY")

if not GROK_API_KEY:
    raise ValueError("API key is missing! Please set it in the .env file.")

app = FastAPI(title="F&B DocBot Backend", version="0.1.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "vector"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@app.post("/ingest")
async def ingest(files: List[UploadFile] = File(...)):
    """
    Upload multiple files, process them, and add them to the FAISS index for future queries.
    Limits the number of files to a maximum of 10.
    """
    try:
        # Ensure we don't upload more than 10 files
        if len(files) > 10:
            return {"status": "error", "error": "You can only upload a maximum of 10 files."}

        all_chunks = []  # This will aggregate the chunks of all uploaded files
        all_metadata = []  # This will store metadata of all uploaded files

        for file in files:
            # Save the uploaded file to disk
            file_path = os.path.join(UPLOAD_DIR, file.filename)
            with open(file_path, "wb") as f:
                f.write(await file.read())

            # Process the file and extract chunks and metadata
            result = ingest_file(file_path)
            
            # Aggregate the chunks and metadata
            all_chunks.extend(result["chunks"])
            all_metadata.extend(result["metadata_list"])

            print(f"Chunks added for file {file.filename}: {len(result['chunks'])}")
        
        # Add the aggregated chunks and metadata to the FAISS index
        added = add_documents(all_chunks, all_metadata)

        print(f"Total chunks added to FAISS: {added}")

        # Save the chunks and metadata into the document.json file
        document_data = {
            "chunks": all_chunks,
            "metadata_list": all_metadata
        }

        document_json_path = os.path.join(UPLOAD_DIR, "document.json")
        with open(document_json_path, 'w', encoding='utf-8') as f:
            json.dump(document_data, f, ensure_ascii=False, indent=4)
        print(f"Chunks and metadata saved to {document_json_path}")

        return {
            "status": "success",
            "file_count": len(files),
            "chunks_added": added,
            "num_chunks": len(all_chunks),
            "chars": sum([result["chars"] for result in result])
        }

    except Exception as e:
        return {"status": "error", "error": str(e), "traceback": traceback.format_exc()}


@app.post("/reset")
def reset():
    """Reset the FAISS index and documents metadata."""
    try:
        reset_store()
        return {"status": "success", "message": "Vector store reset."}
    except Exception as e:
        return {"status": "error", "error": str(e), "traceback": traceback.format_exc()}


@app.get("/stats")
def get_stats():
    """Get stats about the number of vectors in the FAISS index."""
    return {"status": "success", "stats": stats()}


@app.post("/query", response_class=PlainTextResponse)
async def query(question: str = Form(..., example="What are the startup steps for the espresso machine?")):
    """
    Ask a question and get a human-readable, formatted answer based on document content from multiple files.
    The answer is grounded in the uploaded documents only.
    """
    try:
        # First, check for chunks in the document.json file
        context = ""

        # Path to the document.json file (stored in the same directory as the uploaded file)
        document_json_path = os.path.join(UPLOAD_DIR, "document.json")

        if os.path.exists(document_json_path):
            with open(document_json_path, 'r', encoding='utf-8') as f:
                document_data = json.load(f)
                context = "\n".join([chunk for chunk in document_data.get("chunks", [])])
                print(f"Using {len(document_data.get('chunks', []))} chunks from document.json")

        # If no relevant content is found in document.json, fallback to FAISS index
        if not context:
            print("No relevant chunks found in document.json, querying FAISS index...")
            results = search_documents(question, top_k=3)

            if not results:
                return "No relevant content found in the file."

            # Prepare context by joining the top-k relevant chunks from FAISS
            context = "\n".join([doc["page_content"] for doc, _ in results])

        # Call Grok AI API to generate an answer from the context of the document
        client = Groq(api_key=GROK_API_KEY)
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",  # Replace with the specific Grok model you want to use
            messages=[
                {
                    "role": "user",
                    "content": f"Using the following document content, answer the question only from the provided documents. no answer should be out of the context of the files:\n\nContext: {context}\n\nQuestion: {question}"
                }
            ]
        )

        if response.choices[0].message:
            answer = response.choices[0].message.content
        else:
            answer = f"Error: Grok AI API call failed."

        return f"Answer: {answer}" if answer else "No answer found from the file."

    except Exception as e:
        return f"Error: {str(e)}\n{traceback.format_exc()}"
