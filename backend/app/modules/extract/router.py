from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
import shutil
import tempfile
import os
from .schema import ExtractionResponse, ProjectCharter
from .service import extract_content
from .charter_service import generate_charter_from_text, generate_charter_from_pptx

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

class CharterRequest(BaseModel):
    markdown_text: str

@router.post("/charter", response_model=ProjectCharter)
async def extract_charter(request: CharterRequest):
    charter = generate_charter_from_text(request.markdown_text)
    if not charter:
        raise HTTPException(status_code=500, detail="Failed to generate charter.")
    return charter

@router.post("/enhance", response_model=ProjectCharter)
async def enhance_pptx(file: UploadFile = File(...)):
    if not file.filename.endswith(".pptx"):
        raise HTTPException(status_code=400, detail="Ensure the file is a .pptx file")

    with tempfile.NamedTemporaryFile(delete=False, suffix=".pptx") as temp:
        shutil.copyfileobj(file.file, temp)
        temp_path = temp.name

    try:
        charter = generate_charter_from_pptx(temp_path)
        if not charter:
            raise HTTPException(status_code=500, detail="Failed to generate enhanced charter.")
        return charter
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)
