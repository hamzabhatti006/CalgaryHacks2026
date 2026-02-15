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
 *
 * - Expose helpers to find "main" content (e.g. article, main, content selectors).
 * - Provide safe getTextContent / innerText-style helpers that avoid script/style.
 * - Optional: simple heuristics for common CMS/article patterns (e.g. role="main").
 * - Keep logic pure and testable where possible (e.g. accept root element).
 * - No direct network or extension API calls; DOM only.
 *
 * =============================================================================
 */

/** Selectors for primary content, in priority order */
const MAIN_CONTENT_SELECTORS = [
  'article',
  '[role="main"]',
  'main',
  '.article-body',
  '.post-content',
  '.entry-content',
  '.content',
  '.article-content',
  '#content',
  '#main',
  '.story-body',
  '.page-content',
] as const;

/** Elements to exclude when extracting text */
const SKIP_TAGS = new Set(
  'script style noscript iframe svg math nav footer header aside form button'.split(' ')
);

/**
 * Get the first element matching any main content selector within root.
 */
export function findMainContent(root: Document | Element = document): Element | null {
  for (const sel of MAIN_CONTENT_SELECTORS) {
    const el = root.querySelector(sel);
    if (el && getVisibleTextLength(el) > 100) {
      return el;
    }
  }
  return null;
}

/**
 * Extract visible text from an element, excluding script, style, nav, etc.
 * Uses a simple walk to skip non-content nodes. Stops early when maxLength is reached.
 */
export function getVisibleText(el: Element, maxLength = 0): string {
  const parts: string[] = [];
  const limit = maxLength > 0 ? maxLength + 256 : 0;

  function walk(node: Node): void {
    if (limit > 0 && parts.join(' ').length >= limit) return;

    if (node.nodeType === Node.TEXT_NODE) {
      const t = node.textContent?.trim();
      if (t) parts.push(t);
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;

    const tag = (node as Element).tagName?.toLowerCase();
    if (tag && SKIP_TAGS.has(tag)) return;

    for (let i = 0; i < node.childNodes.length; i++) {
      walk(node.childNodes[i]);
      if (limit > 0 && parts.join(' ').length >= limit) return;
    }
    if (['p', 'br', 'div', 'li', 'h1', 'h2', 'h3', 'h4', 'blockquote'].includes(tag || '')) {
      parts.push('\n');
    }
  }

  walk(el);
  let text = parts.join(' ').replace(/\n{3,}/g, '\n\n').replace(/[ \t]+/g, ' ').trim();
  if (maxLength > 0 && text.length > maxLength) {
    text = text.slice(0, maxLength) + '...';
  }
  return text;
}

/**
 * Approximate visible text length for heuristics (avoids full extraction).
 */
function getVisibleTextLength(el: Element): number {
  const clone = el.cloneNode(true) as Element;
  for (const tag of SKIP_TAGS) {
    for (const node of clone.querySelectorAll(tag)) node.remove();
  }
  return (clone.textContent || '').trim().length;
}
