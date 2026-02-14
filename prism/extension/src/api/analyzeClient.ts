/**
 * =============================================================================
 * FILE PURPOSE
 * =============================================================================
 *
 * This file is the extension's client for the Prism backend analyze API. It
 * sends extracted content (and optional options) to the backend and returns
 * the structured analysis response. All network calls to the backend go
 * through this module.
 *
 * =============================================================================
 * OWNER ROLE
 * =============================================================================
 *
 * Extension Lead
 *
 * =============================================================================
 * RESPONSIBILITIES
 * =============================================================================
 *
 * - Expose a single function (e.g. analyze(contentPayload, options)) that
 *   POSTs to the backend analyze route (see backend routes/analyzeRoute.ts).
 * - Serialize request body to match backend expectations (and analysisSchema).
 * - Parse JSON response and validate or pass through to caller.
 * - Handle network errors, timeouts, and non-2xx responses; surface clear
 *   error info so Popup/analysisStore can show error state.
 * - Backend base URL should be configurable (env or config) for dev vs prod.
 *
 * =============================================================================
 * INTEGRATION NOTES
 * =============================================================================
 *
 * - Called from Popup (or background) after content is extracted via
 *   content/extractContent.ts. Request payload shape must align with
 *   backend routes/analyzeRoute.ts and shared schema.
 * - Response shape must match analysisSchema (backend responseValidator
 *   ensures this). Caller (Popup) typically writes result into analysisStore.
 *
 * =============================================================================
 */
