# =============================================================================
# FILE PURPOSE
# =============================================================================
#
# This file defines the HTTP route for content analysis: accept POST body
# (URL, title, extracted text), call backend services to run LLM analysis
# and bias detection, then return a response that conforms to the shared
# analysis schema.
#
# =============================================================================
# OWNER ROLE
# =============================================================================
#
# Backend Lead
#
# =============================================================================
# RESPONSIBILITIES
# =============================================================================
#
# - Define POST handler for the analyze endpoint.
# - Validate incoming body (required fields, basic types) and reject bad
#   requests with 400 and a clear message.
# - Sanitize/truncate input using utils (textSanitizer, truncation) before
#   passing to services.
# - Invoke llmService (with prompt from promptBuilder), then run
#   responseValidator on the raw LLM output. Optionally run biasDetection
#   logic and merge into the response.
# - Return 200 with schema-shaped JSON; on LLM or validation failure,
#   return 500 or 422 with error details.
# - No prompt or model logic here; delegate to services and logic.
#
# =============================================================================
# INTEGRATION NOTES
# =============================================================================
#
# - Mounted by server.py (e.g. app.include_router(analyze_route)).
# - Uses services/llm_service.py, services/prompt_builder.py,
#   services/response_validator.py and logic/bias_detection.py.
# - Uses utils/text_sanitizer.py and utils/truncation.py for input safety.
# - Request/response shapes must align with shared/schema/analysisSchema.json.
# - Extension api/analyzeClient.ts calls this endpoint.
#
# =============================================================================

import asyncio

from fastapi import APIRouter, HTTPException

from src.utils.textSanitizer import sanitize_text
from src.utils.truncation import truncate_text
from src.services.promptBuilder import build_perspectives_messages
from src.services.responseValidator import validate, ValidationError
from src.services.llmService import complete, LLMServiceError
from src.logic.biasDetection import detect_bias

router = APIRouter(prefix="/api/analyze", tags=["analyze"])


@router.post("/")
async def analyze_content(payload: dict):
    required_fields = ["url", "title", "text"]
    for field in required_fields:
        if field not in payload:
            raise HTTPException(status_code=400, detail="Missing text field")

    clean_title = sanitize_text(payload["title"])
    clean_text = sanitize_text(payload["text"])
    final_text = truncate_text(clean_text, max_chars=6000)
    url = payload["url"]

    try:
       # Build single-step prompt
        messages = build_perspectives_messages(
            title=clean_title,
            url=url,
            text=final_text
        )

        # Run perspectives + bias in parallel
        perspectives_task = asyncio.to_thread(
            lambda: validate(complete(messages))
        )

        bias_task = asyncio.to_thread(
            detect_bias, clean_title, url, final_text
        )

        perspectives_result, bias = await asyncio.gather(
            perspectives_task,
            bias_task
        )

        return {
            "perspectives": perspectives_result["perspectives"],
            "bias": bias
        }

    except ValidationError as e:
        # Retry once
        try:
            messages = build_perspectives_messages(
            title=clean_title,
            url=url,
            text=final_text
            )

            # Run perspectives + bias in parallel
            perspectives_task = asyncio.to_thread(
                lambda: validate(complete(messages))
            )

            bias_task = asyncio.to_thread(
                detect_bias, clean_title, url, final_text
            )

            perspectives_result, bias = await asyncio.gather(
                perspectives_task,
                bias_task
            )

            return {
                "perspectives": perspectives_result["perspectives"],
                "bias": bias
            }


        except ValidationError:
            raise HTTPException(
                status_code=422, detail=f"LLM output failed validation: {str(e)}"
            )
    except LLMServiceError as e:
        raise HTTPException(status_code=502, detail=f"LLM service error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected server error: {str(e)}")
