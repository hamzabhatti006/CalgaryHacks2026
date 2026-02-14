/**
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
