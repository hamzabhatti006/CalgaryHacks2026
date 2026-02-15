/**
 * Content script entry: listens for EXTRACT messages, injects floating sidebar.
 */

import { extractContent } from './extractContent';
import './sidebar';

chrome.runtime.onMessage.addListener(
  (
    msg: { type?: string },
    _sender: chrome.runtime.MessageSender,
    sendResponse: (r: unknown) => void
  ) => {
    if (msg?.type === 'OPEN_SIDEBAR') {
      window.dispatchEvent(new CustomEvent('prism-open-sidebar'));
      sendResponse({ ok: true });
      return true;
    }
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
