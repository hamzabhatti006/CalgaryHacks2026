/**
 * Service worker: when extension icon is clicked, ask the active tab to open the sidebar.
 * No popup — sidebar only.
 */

chrome.action.onClicked.addListener((tab) => {
  if (tab?.id == null) return;
  chrome.tabs.sendMessage(tab.id, { type: 'OPEN_SIDEBAR' }).catch(() => {
    // Tab may not have content script (e.g. chrome://, new tab); ignore
  });
});
