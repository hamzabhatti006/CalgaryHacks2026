/**
 * =============================================================================
 * FILE PURPOSE
 * =============================================================================
 *
 * This file renders the "perspective matrix" visualization: the set of
 * structured perspective expansions returned by the backend (e.g. different
 * viewpoints or framings). It presents them in a clear, scannable way so
 * users can compare and reflect.
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
 * - Accept analysis result (or slice from analysisStore) that contains
 *   perspective/expansion data as defined in analysisSchema.
 * - Render each perspective with a clear label and body (e.g. card or list).
 * - Support compact layout for popup constraints; optional expand/collapse.
 * - No business logic; present data only. Parent (Popup) handles loading/empty.
 *
 * =============================================================================
 * INTEGRATION NOTES
 * =============================================================================
 *
 * - Receives data from Popup.tsx (sourced from analysisStore).
 * - Data shape must match shared/schema/analysisSchema.json (perspectives array
 *   or equivalent). Backend (promptBuilder, responseValidator) defines that shape.
 * - Styled via layout.css and any component-level styles.
 *
 * =============================================================================
 */
