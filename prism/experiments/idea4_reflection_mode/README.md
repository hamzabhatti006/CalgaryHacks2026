# Experiment: Idea 4 — Reflection Mode

## Experimental Concept

Emphasize “reflection” as a first-class mode: after showing perspectives and bias, the tool prompts the user with a reflection question or short exercise (e.g. “What would you tell someone who disagrees?”, “What assumption did you bring to this?”). Goal: move from “see other angles” to “pause and reflect.”

## How It Differs From Main MVP

- **MVP:** Reflection is an optional string in the response; ReflectionPrompt.tsx shows it if present.
- **This idea:** Reflection is central. Backend always generates a strong, specific reflection prompt. UI gives it prominent space and optionally a “Done / Next” or “Save” action to create a small habit loop.

## What Would Need to Change

### Backend prompt logic

- **promptBuilder:** Add or expand instructions so the LLM always returns a `reflection` field: a single, concrete question or one-sentence prompt tailored to the content and perspectives. Optionally support reflection “types” (e.g. assumption-check, steelman, source credibility) so we can vary the prompt style.
- **responseValidator:** Require `reflection` in the response for this experiment, or validate it as non-empty when present.

### Frontend UI

- **ReflectionPrompt.tsx:** Becomes a primary block. Larger typography, dedicated card, optional text area for user to type a short response (stored locally only, or not stored). Consider “Copy question” or “New reflection” if we add multiple prompts.
- **Popup:** Order could be: Perspectives → Bias → Reflection (with reflection last as “what to do next”). Or reflection at top as “Before you go…” to create a clear CTA.

### Data schema

- **analysisSchema:** In MVP, `reflection` is optional. For this experiment, document that when “reflection mode” is on, backend guarantees a non-empty `reflection` and frontend may treat it as required. No structural change needed; only contract and UI behavior.

## Modularity

Reflection is already a field and a component; this experiment **elevates** it in prompt and layout. No new services; only prompt wording, validation strictness, and UI hierarchy. Easiest to toggle via a “reflection mode” flag in request or config. Enables “reflective reading” as a distinct narrative for judges.
