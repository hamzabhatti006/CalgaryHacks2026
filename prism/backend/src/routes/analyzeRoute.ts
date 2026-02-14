/**
 * =============================================================================
 * FILE PURPOSE
 * =============================================================================
 *
 * This file defines the HTTP route for content analysis: accept POST body
 * (URL, title, extracted text), call backend services to run LLM analysis
 * and bias detection, then return a response that conforms to the shared
 * analysis schema.
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
 * - Define POST handler for the analyze endpoint.
 * - Validate incoming body (required fields, basic types) and reject bad
 *   requests with 400 and a clear message.
 * - Sanitize/truncate input using utils (textSanitizer, truncation) before
 *   passing to services.
 * - Invoke llmService (with prompt from promptBuilder), then run
 *   responseValidator on the raw LLM output. Optionally run biasDetection
 *   logic and merge into the response.
 * - Return 200 with schema-shaped JSON; on LLM or validation failure,
 *   return 500 or 422 with error details.
 * - No prompt or model logic here; delegate to services and logic.
 *
 * =============================================================================
 * INTEGRATION NOTES
 * =============================================================================
 *
 * - Mounted by server.ts (e.g. app.use('/api/analyze', analyzeRoute)).
 * - Uses services/llmService.ts, services/promptBuilder.ts,
 *   services/responseValidator.ts and logic/biasDetection.ts.
 * - Uses utils/textSanitizer.ts and utils/truncation.ts for input safety.
 * - Request/response shapes must align with shared/schema/analysisSchema.json.
 * - Extension api/analyzeClient.ts calls this endpoint.
 *
 * =============================================================================
 */
