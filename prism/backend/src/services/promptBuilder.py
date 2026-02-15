""""
 * =============================================================================
 * FILE PURPOSE
 * =============================================================================
 *
 * This file builds the prompt (and optional system prompt) sent to the LLM
 * for perspective expansion and any inline bias-awareness instructions. It
 * turns sanitized content and options into a single string (or message list)
 * that the LLM can follow to produce schema-compliant output.
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
 * - Accept inputs: title, URL, extracted text, and optional flags (e.g.
 *   include reflection prompt, bias focus). All text must already be
 *   sanitized/truncated by the route or utils.
 * - Compose system and user messages that instruct the LLM to output
 *   structured content (e.g. perspectives array, optional bias indicators,
 *   optional reflection question) matching analysisSchema.
 * - Include clear output format instructions (JSON shape, key names) so
 *   responseValidator can parse and validate without guesswork.
 * - No LLM API calls; only string/message construction. Experiment branches
 *   (e.g. idea2_cognitive_bias_scoring, idea4_reflection_mode) may require
 *   different prompt variants; this file is the single place to add or
 *   switch prompt logic.
 *
 * =============================================================================
 * INTEGRATION NOTES
 * =============================================================================
 *
 * - Used by routes/analyzeRoute.ts before calling llmService. Route passes
 *   sanitized content; promptBuilder returns prompt(s) for llmService.
 * - Output format must align with shared/schema/analysisSchema.json and
 *   services/responseValidator.ts expectations.
 *
 * =============================================================================
 */
"""

from typing import List, Dict


# ---------------------------------------------------------------------------
# FIXED PERSPECTIVE LABELS
# ---------------------------------------------------------------------------

PERSPECTIVE_LABELS = [
    "Market-Oriented Perspective",
    "Social Equity Perspective",
    "Institutional Stability Perspective",
    "Civil Liberties Perspective"
]

# Allowed framing bias categories (do not change order casually)
ALLOWED_BIAS_TYPES = [
    "Emotional Amplification",
    "Authority Framing",
    "Individual Blame Emphasis",
    "Economic Reductionism",
    "Cultural Framing Dominance"
]


# ---------------------------------------------------------------------------
# SYSTEM PROMPT
# ---------------------------------------------------------------------------

def build_system_prompt() -> str:
    return """
You are a structured perspective-expansion engine.

Your role:
Interpret how content could be viewed under different value-based
ideological frameworks, and identify framing biases.

Strict rules:
- Do NOT evaluate factual accuracy.
- Do NOT add statistics or outside information.
- Do NOT cite real-world examples.
- Do NOT mention political parties.
- Do NOT stereotype groups.
- Do NOT advocate or persuade.
- Do NOT moralize.
- Do NOT output markdown.
- Do NOT include commentary outside JSON.
- Output valid JSON only.

Focus only on interpretive framing.
""".strip()


# ---------------------------------------------------------------------------
# USER PROMPT BUILDER
# ---------------------------------------------------------------------------

def build_user_prompt(
    title: str,
    url: str,
    text: str
) -> str:

    schema_block = f"""
Return JSON in this EXACT structure:

{{
  "perspectives": [
    {{
      "label": "{PERSPECTIVE_LABELS[0]}",
      "body": ""
    }},
    {{
      "label": "{PERSPECTIVE_LABELS[1]}",
      "body": ""
    }},
    {{
      "label": "{PERSPECTIVE_LABELS[2]}",
      "body": ""
    }},
    {{
      "label": "{PERSPECTIVE_LABELS[3]}",
      "body": ""
    }}
  ],
  "bias": [
    {{
      "type": "",
      "explanation": ""
    }}
  ]
}}

Perspective definitions:

- Market-Oriented Perspective:
  Emphasizes economic freedom, incentives, market efficiency, and limited regulation.

- Social Equity Perspective:
  Emphasizes fairness, redistribution, public welfare, and collective responsibility.

- Institutional Stability Perspective:
  Emphasizes rule of law, continuity, tradition, and systemic order.

- Civil Liberties Perspective:
  Emphasizes individual autonomy, rights, and protection from overreach.

Bias instructions:

Identify 2–4 framing biases present in the original content.
Allowed bias types:
{ALLOWED_BIAS_TYPES}

Each bias must:
- Use only one of the allowed types exactly as written.
- Provide a short neutral explanation of how the framing reflects that bias.

Requirements:
- Exactly 4 perspectives in this exact order.
- Each body must interpret the content according to that value framework.
- No repetition across perspectives.
- Bias count must be between 2 and 4.
- No extra keys.
"""

    content_block = f"""
Title: {title}
URL: {url}

Content to analyze:
\"\"\"{text}\"\"\"

Generate structured ideological perspective expansion and framing bias detection.
"""

    return (schema_block + content_block).strip()


# ---------------------------------------------------------------------------
# PUBLIC INTERFACE
# ---------------------------------------------------------------------------

def build_messages(
    title: str,
    url: str,
    text: str
) -> List[Dict[str, str]]:

    system_prompt = build_system_prompt()
    user_prompt = build_user_prompt(
        title=title,
        url=url,
        text=text
    )

    return [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt}
    ]
