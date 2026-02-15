"""
 * =============================================================================
 * FILE PURPOSE
 * =============================================================================
 *
 * This file validates the raw LLM response and normalizes it into the
 * canonical analysis shape defined by the shared schema. It ensures the
 * API always returns a consistent structure to the extension, even when
 * the LLM output is malformed or partial.
 *
 * =============================================================================
 * OWNER ROLE
 * =============================================================================
 *
 * AI/Prompt Lead
 *
 * =============================================================================
 * RESPONSIBILITIES
 * =============================================================================
 *
 * - Accept raw string or parsed JSON from llmService.
 * - Parse JSON if needed; handle parse errors with a clear error type.
 * - Validate required fields and types against analysisSchema (e.g. perspectives
 *   array, each with label and body; optional bias, reflection).
 * - Normalize: coerce types, fill defaults for optional fields, or return
 *   a validation error so the route can respond with 422 or retry logic.
 * - Return either a validated/normalized object (schema-shaped) or an error
 *   payload. No HTTP or logging; pure validation.
 *
 * =============================================================================
 * INTEGRATION NOTES
 * =============================================================================
 *
 * - Called by routes/analyzeRoute.ts with the output of llmService. Route
 *   merges in biasDetection results if needed, then sends the final object
 *   to the client. Schema lives in shared/schema/analysisSchema.json; this
 *   file should reference it (or a generated type) for validation rules.
 *
 * =============================================================================
"""

import json
from typing import Dict, Any, List


# ---------------------------------------------------------------------------
# CONSTANTS (MUST MATCH promptBuilder.py)
# ---------------------------------------------------------------------------

EXPECTED_LABELS = [
    "Market-Oriented Perspective",
    "Social Equity Perspective",
    "Institutional Stability Perspective",
    "Civil Liberties Perspective"
]

ALLOWED_BIAS_TYPES = [
    "Emotional Amplification",
    "Authority Framing",
    "Individual Blame Emphasis",
    "Economic Reductionism",
    "Cultural Framing Dominance"
]


# ---------------------------------------------------------------------------
# EXCEPTION
# ---------------------------------------------------------------------------

class ValidationError(Exception):
    pass


# ---------------------------------------------------------------------------
# VALIDATION LOGIC
# ---------------------------------------------------------------------------

def validate(raw_output: str) -> Dict[str, Any]:
    """
    Parses and validates LLM output.

    Raises ValidationError if invalid.
    Returns normalized dict if valid.
    """

    # -------------------------------
    # Parse JSON
    # -------------------------------
    try:
        parsed = json.loads(raw_output)
    except json.JSONDecodeError:
        raise ValidationError("Invalid JSON from LLM")

    # -------------------------------
    # Top-level keys
    # -------------------------------
    if not isinstance(parsed, dict):
        raise ValidationError("Response must be JSON object")

    if "perspectives" not in parsed:
        raise ValidationError("Missing 'perspectives'")

    if "bias" not in parsed:
        raise ValidationError("Missing 'bias'")

    # -------------------------------
    # Validate perspectives
    # -------------------------------
    perspectives = parsed["perspectives"]

    if not isinstance(perspectives, list):
        raise ValidationError("'perspectives' must be array")

    if len(perspectives) != 4:
        raise ValidationError("Must return exactly 4 perspectives")

    labels = []

    for p in perspectives:
        if not isinstance(p, dict):
            raise ValidationError("Perspective must be object")

        if "label" not in p or "body" not in p:
            raise ValidationError("Perspective missing label/body")

        if not isinstance(p["label"], str) or not isinstance(p["body"], str):
            raise ValidationError("Perspective fields must be strings")

        if not p["body"].strip():
            raise ValidationError("Perspective body cannot be empty")

        labels.append(p["label"])

    if labels != EXPECTED_LABELS:
        raise ValidationError("Perspective labels incorrect or out of order")

    # -------------------------------
    # Validate bias
    # -------------------------------
    bias = parsed["bias"]

    if not isinstance(bias, list):
        raise ValidationError("'bias' must be array")

    if not (2 <= len(bias) <= 4):
        raise ValidationError("Bias count must be between 2 and 4")

    for b in bias:
        if not isinstance(b, dict):
            raise ValidationError("Bias entry must be object")

        if "type" not in b or "explanation" not in b:
            raise ValidationError("Bias missing type/explanation")

        if b["type"] not in ALLOWED_BIAS_TYPES:
            raise ValidationError("Invalid bias type")

        if not isinstance(b["explanation"], str):
            raise ValidationError("Bias explanation must be string")

        if not b["explanation"].strip():
            raise ValidationError("Bias explanation cannot be empty")

    # -------------------------------
    # Reject extra keys (strict mode)
    # -------------------------------
    allowed_top_keys = {"perspectives", "bias"}
    for key in parsed.keys():
        if key not in allowed_top_keys:
            raise ValidationError(f"Unexpected key: {key}")

    return parsed


