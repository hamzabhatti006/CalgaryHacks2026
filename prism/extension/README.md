# Prism Extension

## Purpose

Browser extension that runs in the user's context: extracts page content, sends it to the backend for analysis, and surfaces structured perspective expansions and bias indicators in the popup.

## Setup

```bash
cd extension
npm install
```

## Build

```bash
npm run build
```

Output goes to `dist/`. Use `npm run dev` for watch mode during development.

## Load in Chrome

1. Open `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `dist` folder

## Usage

1. Start the backend (see `../backend/README.md`). Default: `http://localhost:3000`
2. Open any page (article, social post, etc.)
3. Click the Prism icon
4. Click "Analyze page"
5. View perspectives, bias indicators, and reflection prompts

## Architecture

- **Content script** (`src/content/index.ts`): Listens for `EXTRACT` messages, runs `extractContent` in the page context, returns `{ url, title, text }`
- **extractContent** (`src/content/extractContent.ts`): Uses `domUtils` to find main content and extract text (schema request shape)
- **domUtils** (`src/content/domUtils.ts`): DOM helpers for main content selection and safe text extraction
- **analyzeClient** (`src/api/analyzeClient.ts`): POSTs to `POST /api/analyze`, returns schema response
- **analysisStore** (`src/state/analysisStore.ts`): Holds status, result, error; subscribe pattern for popup reactivity
- **Popup** (`src/popup/main.tsx`): Orchestrates extract → analyze → store; minimal UI until UX lead refines

## Manifest (manifest.json)

- **Owner:** Extension Lead
- **Responsibilities:** Manifest v3, permissions (activeTab, storage), host_permissions, popup, content_scripts on all_urls
- **Integration:** Content script injects on every page for message-based extraction; popup triggers analysis

## Folder Structure

- `src/content/` — Content script: index (message listener), extractContent, domUtils
- `src/popup/` — Popup UI: main (entry), Popup, PerspectiveMatrix, BiasIndicators, ReflectionPrompt, LoadingState
- `src/state/` — analysisStore
- `src/api/` — analyzeClient
- `src/styles/` — layout.css

## Configuration

Backend URL defaults to `http://localhost:3000`. Override via `analyze(payload, { baseUrl: '...' })` when calling the client (or extend to read from storage).

## Building / Experiments

Structure allows clean branching: swap popup components or content behavior per experiment without changing core extraction or API contract.
