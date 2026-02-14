# Prism — Demo Script

## Owner

Product/Demo Lead.

## Purpose

This document is a suggested flow for presenting Prism to judges or stakeholders during the hackathon. It is a script only; no implementation. Adjust timing and emphasis based on which experiment (idea1–4) is in focus.

---

## Suggested Flow

1. **Hook (30 sec)**  
   “We’re used to reading one article and one framing. Prism helps you see multiple perspectives and reflect on how content might be shaping your view.”

2. **Problem (30 sec)**  
   “Single-source reading reinforces bias and bubbles. We wanted a lightweight tool that doesn’t replace your reading—it sits on top of it.”

3. **Demo (3–4 min)**  
   - Open a real article (e.g. news or opinion).
   - Open the Prism popup; trigger “Analyze.”
   - Show loading state, then the result: perspective matrix (different framings), bias indicators, and reflection prompt.
   - Briefly read one perspective and the reflection question to show “other angles” and “pause to reflect.”

4. **Technical (1 min)**  
   “Browser extension extracts the content; a small backend runs an LLM to generate perspectives and optional bias signals. Everything is structured so we can swap in different experiments—for example cognitive bias scoring or source comparison—without changing the core flow.”

5. **Experiments (1 min)**  
   “We’ve outlined four directions: perspective-first matrix, cognitive bias scoring, multi-source comparison, and reflection mode. The repo is modular so we can pivot or combine them for the demo.”

6. **Close (30 sec)**  
   “Prism: structured perspective expansion and reflection, right where you read.”

---

## Notes

- Keep the tab and article visible so the demo feels like “reading with Prism,” not a separate app.
- If time is short, drop technical and experiments and end on the reflection prompt.
- If judges ask “what’s next,” point to experiments/ READMEs and optional schema extensions (e.g. second source, bias scores).
