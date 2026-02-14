# Experiment: Idea 1 — Perspective Matrix

## Experimental Concept

Double down on the core “perspective matrix” as the main product surface: multiple structured viewpoints or framings of the same content, presented in a compact, scannable grid or list. The goal is to make “see multiple angles at once” the primary interaction.

## How It Differs From Main MVP

- **MVP:** Perspective matrix is one of several elements (matrix + bias indicators + reflection).
- **This idea:** Matrix is the hero. Bias and reflection are secondary or collapsed; the UI and copy emphasize “perspectives” and “framings” as the main value.

## What Would Need to Change

### Backend prompt logic

- **promptBuilder:** Optimize prompts to produce exactly N perspectives (e.g. 3–5) with clear, distinct labels (e.g. “Economic framing”, “Ethical framing”, “Historical context”). No implementation; prompt wording and structure would be tuned for variety and clarity.
- **responseValidator:** Same schema; possibly stricter validation that each perspective has a non-empty label and body and that labels are distinct.

### Frontend UI

- **Popup / PerspectiveMatrix:** Make the matrix the largest and first block in the popup. Consider grid layout, equal-weight cards, or tabs. BiasIndicators and ReflectionPrompt could be smaller sections or tooltips.
- **LoadingState:** Messaging could say “Building perspectives…” to reinforce the concept.

### Data schema

- No change to core analysisSchema. Optional: add a `count` or `variant` hint in the request so the backend can tailor number or type of perspectives (e.g. “economic, ethical, historical” vs “for, against, neutral”). Document in schema as optional extension.

## Modularity

This experiment is a **presentation and prompt emphasis** change. Same pipeline (extract → analyze → validate → display); only prompt focus and UI hierarchy change. Enables clean branch and easy demo to judges as “perspective-first” direction.
