from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.modules.extract.router import router as extract_router

def create_app() -> FastAPI:
    app = FastAPI(
        title="PPT Extractor API",
        description="API for extracting content, formatting, tables, and diagrams from PPTX dynamically",
        version="1.0.0"
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(extract_router, prefix="/api/v1/extract", tags=["Extraction"])

    return app
