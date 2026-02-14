# Prism Extension

## Purpose

Browser extension that runs in the user's context: extracts page content, sends it to the backend for analysis, and surfaces structured perspective expansions and bias indicators in the popup.

## Manifest (manifest.json)

- **Owner:** Extension Lead
- **Responsibilities:** Declare manifest v3, permissions (activeTab, storage, host), popup entry, content script hooks. Keep minimal to support multiple experiment branches.
- **Integration:** Entry point for the extension; popup loads from `popup.html`; content scripts and background can be wired per experiment.

## Folder Structure

- `src/content/` — Content script logic (extraction, DOM helpers).
- `src/popup/` — Popup UI components (React).
- `src/state/` — Client-side analysis state.
- `src/api/` — Backend API client.
- `src/styles/` — Shared layout and theme.

## Building / Experiments

Structure allows clean branching: swap popup components or content behavior per experiment without changing core extraction or API contract.
