/**
 * =============================================================================
 * FILE PURPOSE
 * =============================================================================
 *
 * This file is responsible for extracting meaningful text and metadata from
 * the current page's DOM so it can be sent to the backend for analysis.
 * It is the bridge between "what the user is reading" and "what Prism analyzes."
 *
 * =============================================================================
 * OWNER ROLE
 * =============================================================================
 *
 * Extension Lead
 *
 * =============================================================================
 * RESPONSIBILITIES
 *
 * - Walk the DOM (or use domUtils) to collect main article/content text.
 * - Strip scripts, styles, nav, ads; focus on primary content.
 * - Extract metadata: page title, URL, optional author/site name.
 * - Respect length limits (e.g. truncation) before sending to backend.
 * - Return a structured payload compatible with shared/schema/analysisSchema.json.
 * - Handle edge cases: paywalls, SPA content, iframes (document behavior only).
 *
 * =============================================================================
 * INTEGRATION NOTES
 *
 * - Uses domUtils for DOM traversal and selection (e.g. main, article, selectors).
 * - Consumed by the popup or background flow that triggers analysis; that flow
 *   will call the analyze client (api/analyzeClient.ts) with this extracted payload.
 * - Output shape must align with the "input" or "request" side of analysisSchema
 *   so the backend can accept it without transformation.
 *
 * =============================================================================
 */

import { findMainContent, getVisibleText } from './domUtils';

/** Max characters for main content before truncation (backend will truncate further) */
const MAX_TEXT_LENGTH = 12000;

/** Minimum text length to consider extraction successful */
const MIN_TEXT_LENGTH = 50;

/**
 * Request payload shape per shared/schema/analysisSchema.json
 */
export interface ExtractResult {
  url: string;
  title: string;
  text: string;
}

/**
 * Extract page content and metadata for analysis.
 * Returns a payload matching the schema request shape.
 */
export function extractContent(doc: Document = document): ExtractResult {
  const url = doc.defaultView?.location?.href ?? window.location.href;
  const title = doc.title || 'Untitled';

  const main = findMainContent(doc);
  let text = main ? getVisibleText(main, MAX_TEXT_LENGTH) : '';

  if (text.length < MIN_TEXT_LENGTH) {
    const body = doc.body;
    text = body ? getVisibleText(body, MAX_TEXT_LENGTH) : '';
  }

  if (text.length < MIN_TEXT_LENGTH) {
    text = doc.body?.innerText?.slice(0, MAX_TEXT_LENGTH) || title;
  }

  return { url, title, text };
}
