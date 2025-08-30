# backend/utils/file_loaders.py
import os
from typing import Tuple, List

from docx import Document as DocxDocument
import pdfplumber
from PIL import Image
import pytesseract

SUPPORTED_EXTS = {".txt", ".docx", ".pdf", ".png", ".jpg", ".jpeg"}

def load_text_from_file(path: str) -> str:
    ext = os.path.splitext(path)[1].lower()
    if ext not in SUPPORTED_EXTS:
        raise ValueError(f"Unsupported file type: {ext}")

    if ext == ".txt":
        with open(path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read()

    if ext == ".docx":
        doc = DocxDocument(path)
        parts = [p.text.strip() for p in doc.paragraphs if p.text.strip()]
        return "\n".join(parts)

    if ext == ".pdf":
        text_parts: List[str] = []
        with pdfplumber.open(path) as pdf:
            for page in pdf.pages:
                txt = page.extract_text() or ""
                if txt.strip():
                    text_parts.append(txt.strip())
        return "\n".join(text_parts)

    if ext in {".png", ".jpg", ".jpeg"}:
        # OCR image
        img = Image.open(path)
        return pytesseract.image_to_string(img)

    raise ValueError(f"Unexpected file type: {ext}")


def simple_chunk(
    text: str,
    chunk_size: int = 700,
    overlap: int = 100
) -> List[str]:
    """Simple sliding window chunker."""
    text = " ".join(text.split())  # normalize whitespace
    if not text:
        return []
    chunks = []
    start = 0
    n = len(text)
    while start < n:
        end = min(start + chunk_size, n)
        chunks.append(text[start:end])
        if end == n:
            break
        start = end - overlap
        if start < 0:
            start = 0
    return chunks
