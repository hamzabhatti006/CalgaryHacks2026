"""
 * =============================================================================
 * FILE PURPOSE
 * =============================================================================
 *
 * Validates LLM outputs for the two-step perspective flow:
 * 1. Headers response: {"headers": ["...", ...]}
 * 2. Perspectives response: {"perspectives": [{"label": "...", "body": "..."}, ...]}
 *
 * =============================================================================
 """

import json
from typing import Dict, Any, List


# ---------------------------------------------------------------------------
# EXCEPTION
# ---------------------------------------------------------------------------

class ValidationError(Exception):
    pass


# ---------------------------------------------------------------------------
# FORBIDDEN GENERIC LABELS (reject to force content-specific headers)
# ---------------------------------------------------------------------------

FORBIDDEN_HEADERS = [
    "market-oriented perspective",
    "social equity perspective",
    "institutional stability perspective",
    "civil liberties perspective",
    "economic perspective",
    "cultural perspective",
]


# ---------------------------------------------------------------------------
# STEP 1: VALIDATE HEADERS RESPONSE
# ---------------------------------------------------------------------------

def validate_headers(raw_output: str) -> List[str]:
    """
    Parse and validate step 1 output. Returns list of header strings.
    """
    try:
        parsed = json.loads(raw_output)
    except json.JSONDecodeError:
        raise ValidationError("Invalid JSON from LLM")

    if not isinstance(parsed, dict) or "headers" not in parsed:
        raise ValidationError("Missing 'headers' in response")

    headers = parsed["headers"]
    if not isinstance(headers, list):
        raise ValidationError("'headers' must be array")

    if not (4 <= len(headers) <= 6):
        raise ValidationError("Must return 4-6 headers")

    result = []
    for i, h in enumerate(headers):
        if not isinstance(h, str):
            raise ValidationError(f"Header {i + 1} must be string")
        h = h.strip()
        if not h:
            raise ValidationError(f"Header {i + 1} cannot be empty")
        h_lower = h.lower()
        for forbidden in FORBIDDEN_HEADERS:
            if forbidden in h_lower:
                raise ValidationError(
                    f"Header '{h}' is too generic. Use content-specific headers."
                )
        result.append(h)

    return result


# ---------------------------------------------------------------------------
# STEP 2: VALIDATE PERSPECTIVES RESPONSE
# ---------------------------------------------------------------------------

def validate_perspectives(
    raw_output: str, expected_labels: List[str]
) -> Dict[str, Any]:
    """
    Parse and validate step 2 output. Ensures each expected label has a body.
    Returns full analysis dict with perspectives (and optional empty bias).
    """
    try:
        parsed = json.loads(raw_output)
    except json.JSONDecodeError:
        raise ValidationError("Invalid JSON from LLM")

    if not isinstance(parsed, dict) or "perspectives" not in parsed:
        raise ValidationError("Missing 'perspectives' in response")

    perspectives = parsed["perspectives"]
    if not isinstance(perspectives, list):
        raise ValidationError("'perspectives' must be array")

    if len(perspectives) != len(expected_labels):
        raise ValidationError(
            f"Expected {len(expected_labels)} perspectives, got {len(perspectives)}"
        )

    normalized = []
    for i, p in enumerate(perspectives):
        if not isinstance(p, dict):
            raise ValidationError("Perspective must be object")

        body = p.get("body", str(p.get("label", ""))).strip()
        if not body:
            raise ValidationError(f"Perspective {i + 1} body cannot be empty")

        # Use expected label from step 1 to ensure consistency
        label = expected_labels[i] if i < len(expected_labels) else p.get("label", "").strip() or f"Perspective {i + 1}"
        normalized.append({"label": label, "body": body})

    return {
        "perspectives": normalized,
        "bias": {"indicators": []},  # Optional; can add bias detection later
    }


# ---------------------------------------------------------------------------
# LEGACY: Single-step validate (kept for compatibility if needed)
# ---------------------------------------------------------------------------

def validate(raw_output: str) -> Dict[str, Any]:
    """
    Validates a single-step perspectives response (no fixed labels).
    Used when we get perspectives directly without the headers step.
    """
    try:
        parsed = json.loads(raw_output)
    except json.JSONDecodeError:
        raise ValidationError("Invalid JSON from LLM")

    if not isinstance(parsed, dict) or "perspectives" not in parsed:
        raise ValidationError("Missing 'perspectives'")

    perspectives = parsed["perspectives"]
    if not isinstance(perspectives, list):
        raise ValidationError("'perspectives' must be array")

    if len(perspectives) < 3 or len(perspectives) > 6:
        raise ValidationError("Must return 3-6 perspectives")

    normalized = []
    for p in perspectives:
        if not isinstance(p, dict):
            raise ValidationError("Perspective must be object")
        if "label" not in p or "body" not in p:
            raise ValidationError("Perspective missing label or body")
        label = str(p["label"]).strip()
        body = str(p["body"]).strip()
        if not body:
            raise ValidationError("Perspective body cannot be empty")
        normalized.append({"label": label, "body": body})

    # Extract and validate pageSummary (exactly 3 brief bullets)
    page_summary = []
    if "pageSummary" in parsed and isinstance(parsed["pageSummary"], list):
        for s in parsed["pageSummary"]:
            if isinstance(s, str) and s.strip():
                page_summary.append(s.strip())
        page_summary = page_summary[:3]  # Keep only first 3
        if len(page_summary) < 3:
            page_summary = []

    result = {"perspectives": normalized}
    if page_summary:
        result["pageSummary"] = page_summary
    return result
