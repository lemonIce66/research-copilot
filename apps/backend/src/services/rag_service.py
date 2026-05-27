import os
import fitz  # PyMuPDF
from langchain_text_splitters import RecursiveCharacterTextSplitter
import chromadb
from src.core.config import settings


chroma_client = chromadb.PersistentClient(path=settings.CHROMA_PERSIST_DIR)


def extract_text_from_pdf(file_path: str) -> str:
    doc = fitz.open(file_path)
    text_parts = []
    for page in doc:
        text_parts.append(page.get_text())
    doc.close()
    return "\n".join(text_parts)


def chunk_text(text: str, chunk_size: int = 500, chunk_overlap: int = 50) -> list:
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        separators=["\n\n", "\n", ". ", " ", ""],
    )
    return splitter.split_text(text)


def store_chunks(session_id: str, chunks: list, filename: str):
    collection = chroma_client.get_or_create_collection(name=f"session_{session_id}")

    ids = [f"{filename}_chunk_{i}" for i in range(len(chunks))]
    metadatas = [{"filename": filename, "chunk_index": i} for i in range(len(chunks))]

    collection.add(documents=chunks, ids=ids, metadatas=metadatas)
    return len(chunks)


def retrieve_documents(session_id: str, query: str, n_results: int = 3) -> str:
    try:
        collection = chroma_client.get_collection(name=f"session_{session_id}")
    except Exception:
        return ""

    results = collection.query(query_texts=[query], n_results=n_results)

    docs = results.get("documents", [[]])[0]
    if not docs:
        return ""

    return "\n\n---\n\n".join(docs)


async def process_pdf(file_path: str, session_id: str, filename: str) -> dict:
    text = extract_text_from_pdf(file_path)

    if not text.strip():
        return {"chunks": 0, "error": "No text extracted from PDF"}

    chunks = chunk_text(text)
    count = store_chunks(session_id, chunks, filename)

    return {"chunks": count, "filename": filename}
