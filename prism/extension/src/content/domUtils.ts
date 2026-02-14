/**
 * =============================================================================
 * FILE PURPOSE
 * =============================================================================
 *
 * This file provides reusable DOM utilities for the content script: selecting
 * main content nodes, safe text extraction, and any DOM normalization needed
 * across different site structures.
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
 * - Expose helpers to find "main" content (e.g. article, main, content selectors).
 * - Provide safe getTextContent / innerText-style helpers that avoid script/style.
 * - Optional: simple heuristics for common CMS/article patterns (e.g. role="main").
 * - Keep logic pure and testable where possible (e.g. accept root element).
 * - No direct network or extension API calls; DOM only.
 *
 * =============================================================================
 * INTEGRATION NOTES
 * =============================================================================
 *
 * - Used by extractContent.ts to gather text and structure from the page.
 * - Shared only within the content layer; popup and state do not use this
 *   unless content results are passed into them.
 *
 * =============================================================================
 */
