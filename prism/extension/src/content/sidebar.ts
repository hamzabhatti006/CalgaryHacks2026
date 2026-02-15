/**
 * Injects a floating Prism tab on the right side of the page.
 * Clicking it expands to show the extension UI in a side panel.
 */

const TAB_WIDTH = 40;
const TAB_HEIGHT = 120;
const PANEL_WIDTH = 420;

function createSidebar(): void {
  if (document.getElementById('prism-floating-root')) return;

  const root = document.createElement('div');
  root.id = 'prism-floating-root';
  root.style.cssText = `
    position: fixed;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2147483646;
    font-family: system-ui, sans-serif;
  `;

  const tab = document.createElement('div');
  tab.id = 'prism-floating-tab';
  tab.setAttribute('aria-label', 'Open Prism');
  tab.style.cssText = `
    width: ${TAB_WIDTH}px;
    height: ${TAB_HEIGHT}px;
    background: linear-gradient(135deg, #37353E 0%, #44444E 100%);
    border: 1px solid #715A5A;
    border-right: none;
    border-radius: 12px 0 0 12px;
    box-shadow: -4px 0 12px rgba(0,0,0,0.2);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: box-shadow 0.2s;
  `;

  const label = document.createElement('span');
  label.textContent = 'Prism';
  label.style.cssText = `
    writing-mode: vertical-rl;
    text-orientation: mixed;
    font-size: 14px;
    font-weight: 600;
    color: #D3DAD9;
    letter-spacing: 1px;
  `;

  tab.appendChild(label);

  const panel = document.createElement('div');
  panel.id = 'prism-floating-panel';
  panel.style.cssText = `
    position: absolute;
    right: ${TAB_WIDTH}px;
    top: 50%;
    transform: translateY(-50%);
    width: ${PANEL_WIDTH}px;
    height: 90vh;
    max-height: 600px;
    background: #37353E;
    border: 1px solid #715A5A;
    border-radius: 12px 0 0 12px;
    box-shadow: -8px 0 24px rgba(0,0,0,0.3);
    overflow: hidden;
    display: none;
  `;

  const iframe = document.createElement('iframe');
  iframe.src = chrome.runtime.getURL('popup.html');
  iframe.style.cssText = `
    width: 100%;
    height: 100%;
    border: none;
  `;

  const closeBtn = document.createElement('button');
  closeBtn.textContent = '×';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.style.cssText = `
    position: absolute;
    top: 8px;
    right: 8px;
    width: 28px;
    height: 28px;
    background: rgba(255,255,255,0.1);
    border: 1px solid #715A5A;
    border-radius: 6px;
    color: #D3DAD9;
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
    panel.style.display = 'block';
    tab.style.borderRadius = '0';
  }

  function closePanel(): void {
    isOpen = false;
    panel.style.display = 'none';
    tab.style.borderRadius = '12px 0 0 12px';
  }

  tab.addEventListener('mouseenter', () => {
    if (!isOpen) tab.style.boxShadow = '-6px 0 16px rgba(0,0,0,0.3)';
  });
  tab.addEventListener('mouseleave', () => {
    if (!isOpen) tab.style.boxShadow = '-4px 0 12px rgba(0,0,0,0.2)';
  });

  tab.addEventListener('click', () => {
    if (isOpen) closePanel();
    else openPanel();
  });

  closeBtn.addEventListener('click', closePanel);

  root.appendChild(panel);
  root.appendChild(tab);
  document.body.appendChild(root);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createSidebar);
} else {
  createSidebar();
}
