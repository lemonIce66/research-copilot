import os
import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException
from src.services.rag_service import process_pdf

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...), session_id: str = "default"):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    file_id = str(uuid.uuid4())[:8]
    file_path = os.path.join(UPLOAD_DIR, f"{file_id}_{file.filename}")

    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)

    result = await process_pdf(file_path, session_id, file.filename)

    return {
        "status": "success",
        "filename": file.filename,
        "chunks": result["chunks"],
        "session_id": session_id,
    }
