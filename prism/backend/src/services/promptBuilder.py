"""
 * =============================================================================
 * FILE PURPOSE
 * =============================================================================
 *
 * Two-step perspective expansion:
 * 1. Generate content-specific perspective headers (different each time).
 * 2. Generate descriptions for each header as it applies to the content.
 *
 * Example: Article about "Trump saying something racist"
 *   Headers: "How a hardworking immigrant would feel based on the statement",
 *            "Economic impact on affected communities", etc.
 *
 * =============================================================================
 """

from typing import List, Dict


# ---------------------------------------------------------------------------
# STEP 1: GENERATE PERSPECTIVE HEADERS
# ---------------------------------------------------------------------------

def build_headers_messages(title: str, url: str, text: str) -> List[Dict[str, str]]:
    """
    Step 1: Ask the LLM to propose 4-5 perspective headers that would be
    most valuable for THIS specific content. Headers represent different
    stakeholder viewpoints, lenses, or angles.
    """

    system_prompt = """You are a perspective-expansion analyst. Your job is to identify the most relevant viewpoints for understanding a given piece of content.

CRITICAL - FORBIDDEN LABELS (never use these):
- "Market-Oriented Perspective"
- "Social Equity Perspective"
- "Institutional Stability Perspective"
- "Civil Liberties Perspective"
- "Economic Perspective" (too generic)
- "Cultural Perspective" (too generic)

You MUST create NEW, content-specific headers. Examples of good headers:
- "How a hardworking immigrant would feel based on the statement"
- "Economic perspective of a poor person"
- "View of a frontline worker in this industry"
- "How affected communities would experience this"
- "Interpretation from a religious minority viewpoint"

Prioritize: socioeconomic lenses, affected communities, lived experiences, emotional impact, grassroots vs institutional views. 4-5 headers. Output valid JSON only."""

    user_prompt = f"""Analyze this content and propose 4-5 perspective headers. Each header MUST be specific to this content—name a concrete person, group, or lens (e.g., "How a single parent would view this policy", "Economic lens of a small business owner"). Do NOT use generic labels like "Market-Oriented" or "Institutional". Create fresh headers for THIS content.

Return JSON in this exact structure:
{{
  "headers": [
    "First perspective header (e.g. How X group would experience this)",
    "Second perspective header",
    "Third perspective header",
    "Fourth perspective header"
  ]
}}

Content to analyze:

Title: {title}
URL: {url}

Content:
\"\"\"
{text}
\"\"\"

Generate the headers."""

    return [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt},
    ]


# ---------------------------------------------------------------------------
# STEP 2: GENERATE DESCRIPTIONS FOR EACH HEADER
# ---------------------------------------------------------------------------

def build_descriptions_messages(
    title: str, url: str, text: str, headers: List[str]
) -> List[Dict[str, str]]:
    """
    Step 2: For each header, generate a description/analysis of how that
    perspective applies to the content.
    """

    headers_json = "\n".join([f'    - "{h}"' for h in headers])
    n = len(headers)
    examples = ", ".join([f'{{"label": "<header {i+1}>", "body": "<description {i+1}>"}}' for i in range(n)])

    system_prompt = """You are a perspective-expansion analyst. For each given perspective header, you write a clear, interpretive description of how that perspective applies to the content.

Rules:
- Output valid JSON only. No markdown, no commentary.
- Do NOT add statistics, cite sources, or introduce new facts.
- Interpret the content through each lens. Describe how someone with that viewpoint would understand or react to the content.
- Be empathetic and nuanced. Do not stereotype or moralize.
- Each body should be 2-4 sentences. Distinct and non-overlapping."""

    user_prompt = f"""Content:
Title: {title}
URL: {url}

Content:
\"\"\"
{text}
\"\"\"

Perspective headers to expand (in this exact order):
{headers_json}

For each header, write a description (body) that interprets the content through that lens.

Return JSON in this exact structure (use the exact header text for each label):
{{
  "perspectives": [
    {examples}
  ]
}}

Generate the descriptions."""

    return [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt},
    ]


# ---------------------------------------------------------------------------
# SINGLE-STEP: GENERATE PERSPECTIVES (Headers + Descriptions Together)
# ---------------------------------------------------------------------------

# ---------------------------------------------------------------------------
# SINGLE-STEP: GENERATE PERSPECTIVES (HEADERS + DESCRIPTIONS TOGETHER)
# ---------------------------------------------------------------------------

# ---------------------------------------------------------------------------
# SINGLE-STEP: GENERATE HIGH-QUALITY PERSPECTIVES
# ---------------------------------------------------------------------------

def build_perspectives_messages(title: str, url: str, text: str) -> List[Dict[str, str]]:
    """
    Single LLM call: generate 4–5 high-quality, content-specific perspective
    headers AND their descriptions together.

    Combines the strict header-generation rules and the strict interpretation
    rules from the previous two-step flow.
    """

    system_prompt = """You are a perspective-expansion analyst.

Your job:
1) Identify the most relevant viewpoints for understanding a given piece of content.
2) Write a clear, interpretive description of how each viewpoint applies to the content.

------------------------------------------------------------------
HEADER REQUIREMENTS
------------------------------------------------------------------

CRITICAL - FORBIDDEN LABELS (never use these):
- "Market-Oriented Perspective"
- "Social Equity Perspective"
- "Institutional Stability Perspective"
- "Civil Liberties Perspective"
- "Economic Perspective" (too generic)
- "Cultural Perspective" (too generic)

You MUST create NEW, content-specific headers.

Examples of strong headers:
- "How a hardworking immigrant would feel based on the statement"
- "Economic perspective of a poor person"
- "View of a frontline worker in this industry"
- "How affected communities would experience this"
- "Interpretation from a religious minority viewpoint"

Prioritize:
- Socioeconomic lenses
- Affected communities
- Lived experiences
- Emotional impact
- Grassroots vs institutional views

Each header must reference a concrete person, group, or clearly defined lens.

------------------------------------------------------------------
DESCRIPTION REQUIREMENTS
------------------------------------------------------------------

For each header:

- Interpret the content through that lens.
- Describe how someone with that viewpoint would understand or react to the content.
- Do NOT add statistics, cite sources, or introduce new facts.
- Do NOT stereotype or moralize.
- Be empathetic and nuanced.
- Each body must be 2–4 sentences.
- Each perspective must be distinct and non-overlapping.

------------------------------------------------------------------

Output valid JSON only. No markdown. No commentary.
"""

    user_prompt = f"""Analyze this content and generate 4–5 high-quality perspectives.

Return JSON in this exact structure:

{{
  "pageSummary": [
    "One brief sentence: main topic.",
    "One brief sentence: key fact.",
    "One brief sentence: significance or takeaway."
  ],
  "perspectives": [
    {{
      "label": "Content-specific header (concrete stakeholder or lens)",
      "body": "2–4 sentence interpretation through this lens"
    }}
  ]
}}

pageSummary: Write exactly 3 brief sentences. One sentence per bullet. Each must be under 15 words. Cover: (1) main topic, (2) one key fact, (3) significance or takeaway. No run-ons.

Content:

Title: {title}
URL: {url}

\"\"\"
{text}
\"\"\"

Generate the perspectives now.
"""

    return [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt},
    ]
