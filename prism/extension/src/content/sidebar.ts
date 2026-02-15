/**
 * Injects a floating Prism tab on the right side of the page.
 * Clicking it expands to show the extension UI in a side panel.
 */

const TAB_WIDTH = 60;
const TAB_HEIGHT = 60;
const PANEL_WIDTH = 420;

function shouldSkipSidebar(location: Location): boolean {
  const hostname = location.hostname.toLowerCase();
  const pathname = location.pathname.toLowerCase();
  const isGoogleDomain = hostname === "google" || hostname.startsWith("google.") || hostname.includes(".google.");
  const isBlockedPath = pathname === "/" || pathname === "/search" || pathname === "/webhp";
  return isGoogleDomain && isBlockedPath;
}

function createSidebar(): void {
  if (document.getElementById("prism-floating-root")) return;

  const root = document.createElement("div");
  root.id = "prism-floating-root";
  root.style.cssText = `
    position: fixed;
    right: 0;
    top: 100px;
    z-index: 2147483646;
    font-family: system-ui, sans-serif;
  `;

  const tab = document.createElement("div");
  tab.id = "prism-floating-tab";
  tab.setAttribute("aria-label", "Open Prism");
  tab.style.cssText = `
    width: ${TAB_WIDTH}px;
    height: ${TAB_HEIGHT}px;
    background: #2C2C2C;
    border: 1px solid #404040;
    border-right: none;
    border-radius: 12px 0 0 12px;
    box-shadow: -4px 0 12px rgba(0,0,0,0.2);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: box-shadow 0.2s;
  `;

  const logoUrl = chrome.runtime.getURL("icons/logo.png");
  const logoImg = document.createElement("img");
  logoImg.src = logoUrl;
  logoImg.alt = "Prism";
  logoImg.setAttribute("aria-hidden", "true");
  logoImg.style.cssText = `
    width: 28px;
    height: 28px;
    object-fit: contain;
  `;

  tab.appendChild(logoImg);

  const panel = document.createElement("div");
  panel.id = "prism-floating-panel";
  panel.style.cssText = `
    position: absolute;
    right: ${TAB_WIDTH}px;
    top: 10px;
    right: 10px;
    width: ${PANEL_WIDTH}px;
    height: 90vh;
    max-height: 600px;
    background: #121212;
    border: 1px solid #404040;
    border-radius: 12px;
    box-shadow: -8px 0 24px rgba(0,0,0,0.3);
    overflow: hidden;
    display: none;
  `;

  const iframe = document.createElement("iframe");
  iframe.src = chrome.runtime.getURL("popup.html");
  iframe.style.cssText = `
    width: 100%;
    height: 100%;
    border: none;
  `;

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "×";
  closeBtn.setAttribute("aria-label", "Close");
  closeBtn.style.cssText = `
    position: absolute;
    top: 8px;
    right: 8px;
    width: 28px;
    height: 28px;
    background: #2C2C2C;
    border: 1px solid #404040;
    border-radius: 6px;
    color: #FFFFFF;
    font-size: 18px;
    line-height: 1;
    cursor: pointer;
    z-index: 10;
  `;

  panel.appendChild(iframe);
  panel.appendChild(closeBtn);

  let isOpen = false;

  function openPanel(): void {
    isOpen = true;
    panel.style.display = "block";
    tab.style.display = "none";
    tab.style.borderRadius = "0";
  }

  function closePanel(): void {
    isOpen = false;
    panel.style.display = "none";
    tab.style.display = "flex";
    tab.style.borderRadius = "12px 0 0 12px";
  }

  tab.addEventListener("mouseenter", () => {
    if (!isOpen) tab.style.boxShadow = "-6px 0 16px rgba(0,0,0,0.3)";
  });
  tab.addEventListener("mouseleave", () => {
    if (!isOpen) tab.style.boxShadow = "-4px 0 12px rgba(0,0,0,0.2)";
  });

  tab.addEventListener("click", () => {
    if (isOpen) closePanel();
    else openPanel();
  });

  closeBtn.addEventListener("click", closePanel);

  window.addEventListener("prism-open-sidebar", () => {
    if (!isOpen) openPanel();
  });

  root.appendChild(panel);
  root.appendChild(tab);
  document.body.appendChild(root);
}

function mountSidebarIfAllowed(): void {
  if (shouldSkipSidebar(window.location)) return;
  createSidebar();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mountSidebarIfAllowed);
} else {
  mountSidebarIfAllowed();
}
