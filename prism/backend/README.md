# Prism Backend

## Purpose

Lightweight backend for Prism: accepts extracted page content from the extension, runs LLM-based perspective expansion and optional bias detection, and returns structured JSON that matches the shared analysis schema.

## Roles

- **Backend Lead:** server, routes, utils (sanitizer, truncation).
- **AI/Prompt Lead:** llmService, promptBuilder, responseValidator, biasDetection logic.

## Structure

- `src/server.ts` — HTTP server and route mounting.
- `src/routes/analyzeRoute.ts` — Single analyze endpoint; orchestrates services and logic.
- `src/services/` — LLM call, prompt construction, response validation.
- `src/logic/` — Bias detection (extensible for experiments).
- `src/utils/` — Text sanitization and truncation.

## Experiments

Experiments may swap or extend promptBuilder and biasDetection without changing the route contract. Keep request/response aligned with `shared/schema/analysisSchema.json` so the extension stays compatible across branches.
