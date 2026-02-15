# =============================================================================
# FILE PURPOSE
# =============================================================================
#
# This file provides sanitization of user-supplied or extracted text before
# it is sent to the LLM or stored. It reduces risk of prompt injection and
# ensures content is safe for JSON and for model context.
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
# - Strip or escape characters that could break JSON or prompt structure.
# - Optionally remove or redact very long repeated sequences to avoid
#   context stuffing. Optionally normalize whitespace and control characters.
# - Accept string (and optional max length); return sanitized string. No
#   side effects. Idempotent where possible.
# - Do not implement full HTML sanitization (that is the extension's concern
#   for display); focus on text that goes into prompts and API responses.
#
# =============================================================================
# INTEGRATION NOTES
# =============================================================================
#
# - Used by routes/analyzeRoute.ts on incoming title, URL, and extracted
#   text before passing to promptBuilder and llmService. truncation.ts may
#   run after this to enforce length limits.
#
# =============================================================================


import re
from typing import Optional

DEFAULT_MAX_LENGTH = 8000


def sanitize_text(text: str, max_length: Optional[int] = None):
    """
    Cleans text for safe prompt usage.
    - Removes control characters
    - Normalizes whitespace
    - Reduces repeated characters
    - Escapes prompt-breaking sequences
    """

    if not isinstance(text, str):
        raise ValueError("Input must be a string")

    # light html strip
    text = re.sub(r"<[^>]+>", "", text)

    # remove control characters
    text = re.sub(r"[\x00-\x1F\x7F]", "", text)

    # normalize whitespace
    text = re.sub(r"\s+", " ", text).strip()

    # reduce long repeated characters (!!!!! → !!!)
    text = re.sub(r"(.)\1{5,}", r"\1\1\1", text)

    # neutralize common prompt breakers
    text = text.replace("```", "`")
    text = text.replace('"""', '"')

    return text
