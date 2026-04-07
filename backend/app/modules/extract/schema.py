from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class ExtractedSlide(BaseModel):
    slide_number: int
    text_content: str
    markdown_content: str
    images: List[str]  # Base64 encoded or URLs
    tables: List[List[List[str]]]  # Rows & Columns
    architecture_diagrams: List[str]

class ProjectCharter(BaseModel):
    objective: str
    scope: str
    assumptions: str
    milestones: str

class ExtractionResponse(BaseModel):
    filename: str
    full_markdown: str
    slides: List[ExtractedSlide]
    project_charter: Optional[ProjectCharter] = None
