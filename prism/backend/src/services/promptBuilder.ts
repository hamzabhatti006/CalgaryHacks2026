/**
 * =============================================================================
 * FILE PURPOSE
 * =============================================================================
 *
 * This file builds the prompt (and optional system prompt) sent to the LLM
 * for perspective expansion and any inline bias-awareness instructions. It
 * turns sanitized content and options into a single string (or message list)
 * that the LLM can follow to produce schema-compliant output.
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
 * - Accept inputs: title, URL, extracted text, and optional flags (e.g.
 *   include reflection prompt, bias focus). All text must already be
 *   sanitized/truncated by the route or utils.
 * - Compose system and user messages that instruct the LLM to output
 *   structured content (e.g. perspectives array, optional bias indicators,
 *   optional reflection question) matching analysisSchema.
 * - Include clear output format instructions (JSON shape, key names) so
 *   responseValidator can parse and validate without guesswork.
 * - No LLM API calls; only string/message construction. Experiment branches
 *   (e.g. idea2_cognitive_bias_scoring, idea4_reflection_mode) may require
 *   different prompt variants; this file is the single place to add or
 *   switch prompt logic.
 *
 * =============================================================================
 * INTEGRATION NOTES
 * =============================================================================
 *
 * - Used by routes/analyzeRoute.ts before calling llmService. Route passes
 *   sanitized content; promptBuilder returns prompt(s) for llmService.
 * - Output format must align with shared/schema/analysisSchema.json and
 *   services/responseValidator.ts expectations.
 *
 * =============================================================================
 */
