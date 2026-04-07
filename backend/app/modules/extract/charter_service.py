import os
import json
from openai import AzureOpenAI
from app.modules.extract.schema import ProjectCharter
from typing import Optional

# Azure OpenAI configuration from environment variables
AZURE_OPENAI_API_KEY = os.getenv("AZURE_OPENAI_API_KEY")
AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
AZURE_OPENAI_DEPLOYMENT_NAME = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME", "gpt-4o")
AZURE_OPENAI_API_VERSION = os.getenv("AZURE_OPENAI_API_VERSION", "2024-05-01-preview")

# Initialize Azure OpenAI client
client = None
if AZURE_OPENAI_API_KEY and AZURE_OPENAI_ENDPOINT:
    client = AzureOpenAI(
        api_key=AZURE_OPENAI_API_KEY,
        api_version=AZURE_OPENAI_API_VERSION,
        azure_endpoint=AZURE_OPENAI_ENDPOINT
    )

PROJECT_CHARTER_PROMPT = """
You are an expert project manager. Analyze the following document and extract a "Project Charter".
Your output must be a valid JSON object with the following keys:
- objective: A concise summary of what the project aims to achieve.
- scope: What is included in the project boundaries.
- assumptions: Key assumptions made for the project.
- milestones: Significant phases or deliverables with estimated timelines if available.

Keep the text professional and structured. If a section is not found, marks it as "Not specified in document".

TEXT CONTENT:
---
{markdown_content}
---

Return ONLY the JSON object.
"""

def generate_charter_from_text(markdown_content: str) -> Optional[ProjectCharter]:
    if not client:
        print("Azure OpenAI client not initialized. Check your environment variables.")
        return None
    
    try:
        response = client.chat.completions.create(
            model=AZURE_OPENAI_DEPLOYMENT_NAME,
            messages=[
                {"role": "system", "content": "You are a helpful assistant that extracts project charters in JSON format."},
                {"role": "user", "content": PROJECT_CHARTER_PROMPT.format(markdown_content=markdown_content)}
            ],
            response_format={"type": "json_object"}
        )
        
        response_text = response.choices[0].message.content
        data = json.loads(response_text)
        return ProjectCharter(**data)
    except Exception as e:
        print(f"Error calling Azure OpenAI: {e}")
        return None

def generate_charter_from_pptx(file_path: str) -> Optional[ProjectCharter]:
    from app.modules.extract.service import extract_content
    result = extract_content(file_path, "charter_gen")
    return generate_charter_from_text(result.full_markdown)
