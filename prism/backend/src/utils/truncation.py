"""
=============================================================================
FILE PURPOSE
=============================================================================

This file provides safe truncation of text to stay within LLM context and
API limits. It ensures we never send oversized payloads and optionally
preserves sentence or paragraph boundaries when cutting.

=============================================================================
OWNER ROLE
=============================================================================

Backend Lead

=============================================================================
RESPONSIBILITIES
=============================================================================

- Expose a function (e.g. truncate(text, max_chars, options)) that returns
  a string no longer than max_chars. Options may include: break at sentence
  boundary, append ellipsis, or break at word boundary.
- Use character or token-based limits as required by the chosen LLM; if
  token-based, document the assumed tokenizer or use a conservative
  character-to-token ratio.
- No network or file I/O; pure string in, string out. Used after
  text_sanitizer so we truncate already-sanitized content.

=============================================================================
INTEGRATION NOTES
=============================================================================

- Called by routes/analyze_route.py (or in the route pipeline) after
  text_sanitizer. Truncated text is passed to prompt_builder and onward
  to llm_service.
=============================================================================
"""

from typing import Optional

DEFAULT_MAX_CHARS = 6000


def truncate_text(text: str, max_chars: Optional[int] = None) -> str:
    if not isinstance(text, str):
        raise ValueError("Input must be a string")

    limit = max_chars or DEFAULT_MAX_CHARS

    if len(text) <= limit:
        return text

    truncated = text[:limit]

    # Try cutting at last period to preserve sentence boundary
    last_period = truncated.rfind(".")
    if last_period > limit * 0.6:  # avoid cutting too aggressively
        return truncated[: last_period + 1]

    return truncated
