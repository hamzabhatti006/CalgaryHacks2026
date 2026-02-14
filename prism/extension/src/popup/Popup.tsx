/**
 * =============================================================================
 * FILE PURPOSE
 * =============================================================================
 *
 * This file is the root popup component. It composes the popup UI: triggering
 * analysis, showing the perspective matrix, bias indicators, reflection prompt,
 * and loading state. It wires extension state and API calls into child components.
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
 * - Compose PerspectiveMatrix, BiasIndicators, ReflectionPrompt, LoadingState.
 * - Read/write analysis state from state/analysisStore.ts.
 * - Trigger content extraction and api/analyzeClient.ts when user requests analysis.
 * - Handle popup lifecycle: open tab context, loading vs result vs error.
 * - Provide a single entry layout and accessibility baseline (focus, headings).
 *
 * =============================================================================
 * INTEGRATION NOTES
 * =============================================================================
 *
 * - Imports and renders: PerspectiveMatrix.tsx, BiasIndicators.tsx,
 *   ReflectionPrompt.tsx, LoadingState.tsx.
 * - Subscribes to and updates analysisStore (state/analysisStore.ts).
 * - Calls analyzeClient to send extracted content and receive analysis result.
 * - layout.css (styles/layout.css) should be applied at this root or via a global
 *   style entry so all popup components share the same layout and theme.
 *
 * =============================================================================
 */
