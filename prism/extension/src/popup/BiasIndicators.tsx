/**
 * =============================================================================
 * FILE PURPOSE
 * =============================================================================
 *
 * This file renders bias indicators derived from the analysis: signals such as
 * framing, language bias, or cognitive bias scores. It gives users a quick
 * visual summary of how the content might be slanted before they read
 * the full perspective expansions.
 *
 * =============================================================================
 * OWNER ROLE
 * =============================================================================
 *
 * UX/Interaction Lead
 *
 * =============================================================================
 * RESPONSIBILITIES
 * =============================================================================
 *
 * - Accept bias-related fields from the analysis result (schema-defined).
 * - Display indicators (e.g. tags, badges, or a small list) without overwhelming
 *   the popup; keep copy short and scannable.
 * - Handle missing or empty bias data gracefully (hide or show "No indicators").
 * - Purely presentational; no API or store writes.
 *
 * =============================================================================
 * INTEGRATION NOTES
 * =============================================================================
 *
 * - Data comes from Popup/analysisStore; structure aligns with backend
 *   logic/biasDetection.ts and analysisSchema (bias or indicators section).
 * - Rendered alongside PerspectiveMatrix in Popup.tsx.
 *
 * =============================================================================
 */
