from fastapi import APIRouter, HTTPException
from src.services.llmService import complete
import json

router = APIRouter(prefix="/api/keywords", tags=["keywords"])

@router.post("/")
async def generate_keywords(payload: dict):
    label = payload.get("label")
    body = payload.get("body")
    title = payload.get("title")

    if not label or not body:
        raise HTTPException(status_code=400, detail="Missing fields")

    messages = [
        {
            "role": "system",
            "content": """You generate short search phrases to explore a viewpoint further.
Return valid JSON only.

Structure:
{
  "keywords": ["phrase 1", "phrase 2", "phrase 3"]
}

Rules:
- 3–5 phrases
- Not full sentences
- Useful for Google search
- Concrete and specific
"""
        },
        {
            "role": "user",
            "content": f"""
Perspective label: {label}
Perspective body: {body}
Article title: {title}

Generate keywords.
"""
        }
    ]

    raw = complete(messages, temperature=0.3)

    try:
        parsed = json.loads(raw)
        keywords = parsed.get("keywords", [])
        if not isinstance(keywords, list):
            keywords = []
        return {"keywords": keywords[:5]}
    except:
        return {"keywords": []}
