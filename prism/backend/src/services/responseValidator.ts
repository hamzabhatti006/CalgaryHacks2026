/**
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
 */
