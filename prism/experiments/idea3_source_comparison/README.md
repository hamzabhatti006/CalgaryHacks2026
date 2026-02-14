# Experiment: Idea 3 — Source Comparison

## Experimental Concept

Beyond “perspectives on this article,” allow users to compare the current source with another URL or with a “neutral” or “counter” summary. For example: “Compare with a fact-check,” “See how another outlet framed this,” or “Add a second source.” The value is “don’t read in isolation.”

## How It Differs From Main MVP

- **MVP:** Single source (current page); analysis is one-shot.
- **This idea:** Two (or more) inputs: current page + optional second URL or pasted text. Backend produces perspectives that explicitly compare or contrast sources, or a side-by-side summary.

## What Would Need to Change

### Backend prompt logic

- **promptBuilder:** Accept a second content block (URL + title + text or pasted text). Build prompts that ask the LLM to compare/contrast the two sources, or to generate “source A says X, source B says Y, here’s how they differ.” Output might include a `comparison` section in addition to or instead of a generic perspectives array.
- **routes/analyzeRoute:** Request body must accept optional `secondSource: { url?, title?, text }`. Fetch or accept second content; sanitize and truncate both; pass to promptBuilder. No implementation; only contract and flow.

### Frontend UI

- **Popup:** Add a way to input a second source: URL field, or “Paste text,” or “Compare with fact-check” button that uses a fixed service. After analysis, show comparison-specific UI: e.g. “Source A vs Source B” summary, or perspectives labeled by source.
- **New component (e.g. SourceComparison.tsx):** Display side-by-side or comparison summary. May replace or sit beside PerspectiveMatrix depending on whether we show “perspectives” and “comparison” together.

### Data schema

- **Request:** Add optional `secondSource: { url?, title?, text }` to analysisSchema request. Backend and extension must agree on this shape.
- **Response:** Add optional `comparison: { summary?, points?: [] }` or similar so the UI can render comparison without parsing perspectives. Keep `perspectives` for backward compatibility; experiments can use one or both.

## Modularity

This experiment extends the **contract** (request/response) and adds **one new flow** (second source input and comparison output). Extract/content stays “one page” in MVP; a branch can add second-source extraction (e.g. same extractContent for a second URL) and comparison-specific prompt and UI. Enables “multi-source reading” as a judge-facing direction.
