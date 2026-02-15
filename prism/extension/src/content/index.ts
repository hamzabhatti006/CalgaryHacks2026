/**
 * Content script entry: listens for EXTRACT messages from popup and returns
 * extracted content. Must run in page context for DOM access.
 */

import { extractContent } from './extractContent';

chrome.runtime.onMessage.addListener(
  (
    msg: { type?: string },
    _sender: chrome.runtime.MessageSender,
    sendResponse: (r: unknown) => void
  ) => {
    if (msg?.type !== 'EXTRACT') return;
    try {
      const result = extractContent(document);
      sendResponse({ ok: true, data: result });
    } catch (err) {
      sendResponse({ ok: false, error: err instanceof Error ? err.message : 'Extraction failed' });
    }
    return true;
  }
);
