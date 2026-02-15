"""
 * =============================================================================
 * FILE PURPOSE
 * =============================================================================
 *
 * This file encapsulates all communication with the LLM provider (e.g. OpenAI,
 * Anthropic, or local model). It sends a prompt and optional system message,
 * receives raw text or structured output, and returns it for validation and
 * use by the analyze route.
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
 * - Expose a single function (e.g. complete(prompt, systemPrompt, options))
 *   that calls the LLM API.
 * - Handle API keys and endpoint configuration (from env or config); never
 *   log or expose keys.
 * - Support JSON mode or chat completion as required by the chosen provider.
 * - Map provider-specific errors (rate limits, context length) to simple
 *   internal errors the route can translate to HTTP status/messages.
 * - No prompt wording or schema logic here; promptBuilder and
 *   responseValidator own that. This file only "send prompt, return response."
 *
 * =============================================================================
 * INTEGRATION NOTES
 * =============================================================================
 *
 * - Called by routes/analyzeRoute.ts with the prompt string produced by
 *   promptBuilder.ts. Raw response is then passed to responseValidator.ts.
 * - Does not import promptBuilder or responseValidator; single responsibility.
 *
 * =============================================================================
 */

"""


import os
from google import genai
from google.genai import types
from dotenv import load_dotenv

# Load .env from prism directory (same location as test.py)
# llmService is at prism/backend/src/services/ → go up 4 levels to prism/
_prism_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
_load_dotenv_path = os.path.join(_prism_dir, ".env")
load_dotenv(dotenv_path=_load_dotenv_path)

# Parse API key same way as test.py: support GEMENI_API_KEY from .env
def _get_api_key():
    key = os.getenv("GEMENI_API_KEY") or os.getenv("GEMINI_API_KEY")
    if key:
        return key
    env_path = os.path.join(_prism_dir, ".env")
    if os.path.exists(env_path):
        with open(env_path) as f:
            for line in f:
                if line.startswith("GEMENI_API_KEY="):
                    return line.strip().split("=", 1)[1]
                if line.startswith("GEMINI_API_KEY="):
                    return line.strip().split("=", 1)[1]
    return None


# ---------------------------------------------------------------------------
# Custom Exception
# ---------------------------------------------------------------------------

class LLMServiceError(Exception):
    pass


# ---------------------------------------------------------------------------
# Client Setup
# ---------------------------------------------------------------------------

api_key = _get_api_key()

if not api_key:
    raise RuntimeError("GEMENI_API_KEY or GEMINI_API_KEY not set in .env (prism/.env)")

client = genai.Client(api_key=api_key)


# ---------------------------------------------------------------------------
# Main Completion Function
# ---------------------------------------------------------------------------

def complete(messages, temperature: float = 0.4) -> str:
    """
    Sends chat completion request to Gemini.

    Args:
        messages: List of {role, content}
        temperature: Controls randomness

    Returns:
        Raw JSON string from Gemini

    Raises:
        LLMServiceError on provider failure
    """

    try:
        # Convert OpenAI-style messages into Gemini prompt
        combined_prompt = ""
        for m in messages:
            role = m["role"]
            content = m["content"]
            combined_prompt += f"{role.upper()}:\n{content}\n\n"

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=combined_prompt,
            config=types.GenerateContentConfig(
                temperature=temperature,
                response_mime_type="application/json",  # Forces JSON mode
            ),
        )

        if not response.text:
            raise LLMServiceError("Empty response from Gemini")

        return response.text

    except Exception as e:
        raise LLMServiceError(str(e))
