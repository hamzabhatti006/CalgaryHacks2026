# Shared Schema

## Purpose

Single source of truth for the analysis request and response shape. Both extension and backend consume this so that UI, API, and validation stay aligned across MVP and experiment branches.

## Owner

- **Product/Demo Lead** — Schema design and evolution.
- **Backend Lead / Extension Lead** — Consumption (validation, types, API contract).

## analysisSchema.json

- Describes **request**: url, title, text (and any optional flags).
- Describes **response**: perspectives (array of { label, body }), optional bias, optional reflection.
- Experiments may extend with additional optional fields; required fields should remain stable for backward compatibility.

## Integration

- Backend: `responseValidator.ts` and `analyzeRoute.ts` use this for validation and response shape.
- Extension: `analyzeClient.ts` and `analysisStore` expect the same response shape; popup components (PerspectiveMatrix, BiasIndicators, ReflectionPrompt) read from it.
