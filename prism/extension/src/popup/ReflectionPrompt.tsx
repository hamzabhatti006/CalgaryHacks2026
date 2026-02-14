/**
 * =============================================================================
 * FILE PURPOSE
 * =============================================================================
 *
 * This file provides the "reflection" UI: a prompt or CTA that encourages
 * the user to reflect on what they read (e.g. a question or short suggestion).
 * It supports the experiment "idea4_reflection_mode" and can be swapped or
 * enhanced for that branch.
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
 * - Display a reflection prompt or suggestion derived from the analysis
 *   (e.g. from backend response or a local template).
 * - Keep the prompt concise and actionable; avoid long paragraphs.
 * - Optional: allow copy or share of the prompt. No analytics or tracking here.
 * - Support conditional visibility (e.g. only when analysis has reflection data).
 *
 * =============================================================================
 * INTEGRATION NOTES
 * =============================================================================
 *
 * - Used inside Popup.tsx. May consume a "reflection" or "prompt" field from
 *   analysisStore/analysis result (schema and backend promptBuilder define this).
 * - experiments/idea4_reflection_mode describes how this component could be
 *   expanded or replaced for deeper reflection flows.
 *
 * =============================================================================
 */
