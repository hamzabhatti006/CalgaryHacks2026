# Experiment: Idea 2 — Cognitive Bias Scoring

## Experimental Concept

Add explicit cognitive-bias detection and scoring (e.g. confirmation bias, framing effect, availability heuristic) to the analysis. Show users not only “other perspectives” but “how this content might be biasing you” with named biases and optional scores or confidence.

## How It Differs From Main MVP

- **MVP:** Bias is optional; indicators may be simple or heuristic.
- **This idea:** Bias is first-class. Backend produces a structured list of cognitive bias labels (and optionally scores). UI dedicates space to “Detected biases” and possibly “How to counteract.”

## What Would Need to Change

### Backend prompt logic

- **promptBuilder:** Add a dedicated instruction (or second prompt) for the LLM to identify cognitive biases in the source content or in its own perspective summaries. Specify a fixed list of bias types (e.g. from a known taxonomy) so output is consistent.
- **llmService:** May need a second call or a structured output block for “bias” only. Or a single prompt with two sections (perspectives + biases).
- **logic/biasDetection:** Expand or replace with logic that maps LLM bias output into schema shape (e.g. array of { name, description, score }). May integrate keyword/heuristic fallbacks if LLM output is missing.

### Frontend UI

- **BiasIndicators:** Becomes a primary component. Show each bias with name and short description; optional progress bar or badge for score. Consider “Learn more” or “How to counteract” links (static or from a small doc).
- **Popup:** Layout could put “Biases” above or beside the perspective matrix so users see bias first, then perspectives.

### Data schema

- **analysisSchema:** Extend `bias` from a generic object to a defined shape, e.g. `biases: [{ id, name, description, score? }]`. Request can stay the same; response schema gains a formal bias array. Document in shared/schema and keep optional so MVP branch does not break.

## Modularity

Bias detection lives in **logic/biasDetection.ts** and **promptBuilder**; UI in **BiasIndicators.tsx**. Switching to this experiment means extending schema, prompt, and one UI component without rewriting the full pipeline. Enables presenting “bias-aware reading” as a distinct direction to judges.
