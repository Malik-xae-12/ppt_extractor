from fastapi import APIRouter, UploadFile, File, HTTPException
import shutil
import tempfile
import os
from .schema import ExtractionResponse
from .service import extract_content

router = APIRouter()

@router.post("/", response_model=ExtractionResponse)
async def extract_pptx(file: UploadFile = File(...)):
    if not file.filename.endswith(".pptx"):
        raise HTTPException(status_code=400, detail="Ensure the file is a .pptx file")

    with tempfile.NamedTemporaryFile(delete=False, suffix=".pptx") as temp:
        shutil.copyfileobj(file.file, temp)
        temp_path = temp.name

    try:
        response = extract_content(temp_path, file.filename)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

    return response
