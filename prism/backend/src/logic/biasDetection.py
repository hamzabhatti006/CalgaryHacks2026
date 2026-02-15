"""
Bias detection logic layer.

Generates high-level bias indicator labels (string array only).
Aligned with analysisSchema.json:

"bias": {
  "indicators": [ "Emotional framing", "Generalization", ... ]
}
"""

from typing import Dict, Any, List
from ..services.llmService import complete, LLMServiceError
import json


# ---------------------------------------------------------------------------
# EXCEPTION
# ---------------------------------------------------------------------------

class BiasValidationError(Exception):
    pass


# ---------------------------------------------------------------------------
# PROMPT BUILDER
# ---------------------------------------------------------------------------

def _build_bias_messages(title: str, url: str, text: str) -> List[Dict[str, str]]:
    system_prompt = """You are a neutral media framing analyst.

Your task:
Identify potential bias indicators in the content.

Rules:
- Output valid JSON only.
- Do NOT moralize or accuse.
- Do NOT introduce new facts.
- Keep indicators short (2-4 words).
- Return general bias pattern labels only.

Examples of valid indicators:
- Emotional framing
- Loaded language
- Generalization
- Authority emphasis
- Us-vs-them framing
- Selective omission
"""

    user_prompt = f"""Analyze the following content.

Return JSON in this exact structure:

{{
  "indicators": [
    "Emotional framing",
    "Loaded language"
  ]
}}

Title: {title}
URL: {url}

\"\"\"
{text}
\"\"\"
"""

    return [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt},
    ]


# ---------------------------------------------------------------------------
# VALIDATION
# ---------------------------------------------------------------------------

def _validate_bias(raw_output: str) -> Dict[str, Any]:
    try:
        parsed = json.loads(raw_output)
    except json.JSONDecodeError:
        raise BiasValidationError("Invalid JSON from bias detection")

    if not isinstance(parsed, dict) or "indicators" not in parsed:
        raise BiasValidationError("Missing 'indicators'")

    indicators = parsed["indicators"]

    if not isinstance(indicators, list):
        raise BiasValidationError("'indicators' must be array")

    normalized = []

    for i, item in enumerate(indicators):
        if not isinstance(item, str):
            raise BiasValidationError(f"Indicator {i + 1} must be string")

        label = item.strip()
        if not label:
            raise BiasValidationError(f"Indicator {i + 1} cannot be empty")

        normalized.append(label)

    return {"indicators": normalized}


# ---------------------------------------------------------------------------
# PUBLIC FUNCTION
# ---------------------------------------------------------------------------

def detect_bias(title: str, url: str, text: str) -> Dict[str, Any]:
    """
    Runs bias detection via LLM and validates output.
    Returns:
        {
          "indicators": [ "Emotional framing", ... ]
        }
    Fail-soft: returns empty array on error.
    """

    try:
        messages = _build_bias_messages(title, url, text)
        raw = complete(messages, temperature=0.2)
        return _validate_bias(raw)

    except (LLMServiceError, BiasValidationError):
        # Do not break overall analysis if bias fails
        return {"indicators": []}
