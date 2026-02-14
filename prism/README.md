# Prism

Browser extension + lightweight backend that analyzes content and generates structured perspective expansions. Built for a 24-hour hackathon with support for multiple experimental directions.

## Structure

- **extension/** — Browser extension: content extraction, popup UI, state, API client. See `extension/README.md`.
- **backend/** — HTTP API, LLM integration, prompt building, response validation, bias logic. See `backend/README.md`.
- **shared/schema/** — Request/response contract for analysis. See `shared/schema/README.md`.
- **experiments/** — Four idea READMEs (perspective matrix, cognitive bias scoring, source comparison, reflection mode). No implementation; only concept and “what would change” per idea.
- **docs/** — Architecture, demo script, product positioning.

## Roles

- **Extension Lead** — Manifest, content scripts, extractContent, domUtils, analysisStore, analyzeClient.
- **Backend Lead** — Server, analyze route, textSanitizer, truncation.
- **AI/Prompt Lead** — llmService, promptBuilder, responseValidator, biasDetection.
- **UX/Interaction Lead** — Popup and all popup components, layout.css.
- **Product/Demo Lead** — Schema design, docs (architecture, demo script, product positioning).

## Rules

- No executable code in the planned files yet; comments only in implementation files.
- Experiments are documented only; switch direction by changing backend prompts, frontend components, and optional schema fields as described in each `experiments/idea*/README.md`.

Start with `docs/architecture.md` for data flow and separation of concerns, then `docs/demo_script.md` and `docs/product_positioning.md` for pitch and narrative.
