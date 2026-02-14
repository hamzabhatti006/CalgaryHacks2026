/**
 * =============================================================================
 * FILE PURPOSE
 * =============================================================================
 *
 * This file renders the loading state of the popup while analysis is in
 * progress: spinner, progress message, or skeleton so users know the extension
 * is working and not frozen.
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
 * - Show a clear loading indicator (e.g. spinner or skeleton for matrix/indicators).
 * - Optional: short status text (e.g. "Analyzing…", "Building perspectives…").
 * - No logic for triggering analysis; only display. Parent controls when to show.
 * - Accessible: ensure screen readers get loading state (e.g. aria-live or role).
 *
 * =============================================================================
 * INTEGRATION NOTES
 * =============================================================================
 *
 * - Rendered by Popup.tsx when analysisStore indicates loading (or equivalent).
 * - Styling consistent with layout.css and the rest of the popup.
 *
 * =============================================================================
 */
