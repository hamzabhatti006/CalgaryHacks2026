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
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


# ---------------------------------------------------------------------------
# Custom Exception
# ---------------------------------------------------------------------------

class LLMServiceError(Exception):
    pass


# ---------------------------------------------------------------------------
# Client Setup
# ---------------------------------------------------------------------------

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise RuntimeError("GEMINI_API_KEY not set")

genai.configure(api_key=api_key)

model = genai.GenerativeModel("gemini-1.5-flash")  
# Use gemini-1.5-pro if needed (slower but stronger)


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

        response = model.generate_content(
            combined_prompt,
            generation_config={
                "temperature": temperature,
                "response_mime_type": "application/json"  # Forces JSON mode
            }
        )

        if not response.text:
            raise LLMServiceError("Empty response from Gemini")

        return response.text

    except Exception as e:
        raise LLMServiceError(str(e))
