/**
 * =============================================================================
 * FILE PURPOSE
 * =============================================================================
 *
 * This file provides sanitization of user-supplied or extracted text before
 * it is sent to the LLM or stored. It reduces risk of prompt injection and
 * ensures content is safe for JSON and for model context.
 *
 * =============================================================================
 * OWNER ROLE
 * =============================================================================
 *
 * Backend Lead
 *
 * =============================================================================
 * RESPONSIBILITIES
 * =============================================================================
 *
 * - Strip or escape characters that could break JSON or prompt structure.
 * - Optionally remove or redact very long repeated sequences to avoid
 *   context stuffing. Optionally normalize whitespace and control characters.
 * - Accept string (and optional max length); return sanitized string. No
 *   side effects. Idempotent where possible.
 * - Do not implement full HTML sanitization (that is the extension's concern
 *   for display); focus on text that goes into prompts and API responses.
 *
 * =============================================================================
 * INTEGRATION NOTES
 * =============================================================================
 *
 * - Used by routes/analyzeRoute.ts on incoming title, URL, and extracted
 *   text before passing to promptBuilder and llmService. truncation.ts may
 *   run after this to enforce length limits.
 *
 * =============================================================================
 */
