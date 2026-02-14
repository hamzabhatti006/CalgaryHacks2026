/**
 * =============================================================================
 * FILE PURPOSE
 * =============================================================================
 *
 * This file defines the client-side state for the current analysis: loading
 * flag, result (perspectives, bias indicators, reflection), error state, and
 * optionally the last analyzed content/source. It is the single source of
 * truth for the popup UI.
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
 * - Hold: status (idle | loading | success | error), result (schema-shaped),
 *   error message, and optionally request metadata (URL, title).
 * - Provide a minimal store interface: get/set or subscribe so Popup and
 *   children can read and react to state changes.
 * - Persist to extension storage only if we want "last analysis" to survive
 *   popup close (optional; document in integration notes).
 * - No API calls or DOM access; pure state.
 *
 * =============================================================================
 * INTEGRATION NOTES
 * =============================================================================
 *
 * - Popup.tsx and popup components read from this store.
 * - api/analyzeClient.ts (or Popup) updates the store after API success/failure.
 * - Result shape must match shared/schema/analysisSchema.json so UI and backend
 *   stay in sync. Experiments may extend the schema; store should hold whatever
 *   the API returns.
 *
 * =============================================================================
 */
