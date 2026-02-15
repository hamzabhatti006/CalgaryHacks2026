# Prism — Demo Script

## Owner

Product/Demo Lead.

## Purpose

Suggested flow for presenting Prism to judges (2–3 minutes). Aligns with concept doc: hook → problem → demo (matrix, bias, reflection) → close. Adjust timing and emphasis by experiment (idea1–4).

---

## Timed Flow (2–3 minutes)

| Time | Segment | Action |
|------|---------|--------|
| **0:00 – 0:30** | Hook | Open a real post or article (e.g. criticism of a public figure at a major event). “Most people read this in one framing. Prism helps you see multiple perspectives and pause to reflect.” |
| **0:30 – 1:15** | Matrix | Click “Analyze with Prism.” Show loading (“Building perspectives…”), then the perspective matrix: cultural, economic, institutional, individual-impact lenses. Point out how stakeholders and assumptions differ per lens. |
| **1:15 – 1:45** | Bias | Highlight framing notes: “This framing emphasizes emotional language and individual blame.” Non-accusatory; no true/false. |
| **1:45 – 2:15** | Reflection | Read the reflection question and answer live if possible: “I hadn’t considered the economic incentives behind this framing.” |
| **2:15 – 2:45** | Close | “Prism doesn’t tell you what’s true. It equips you to reason more deliberately.” Optional: one line on tech (extension + lightweight backend, structured LLM output). |

---

## Talking Points

- **Problem:** Single-source reading reinforces one framing; fact-checkers address accuracy, not interpretive bias.
- **Solution:** Perspective expansion + framing notes + reflection prompt—all in the flow of reading.
- **Differentiation:** Not a fact-checker; no true/false. We expand interpretation and prompt reflection.
- **Technical (if asked):** Extension extracts content; backend sanitizes, prompts LLM, validates response; UI shows matrix, bias indicators, reflection. Modular so we can swap experiments (perspective-first, bias scoring, source comparison, reflection mode).

---

## Notes

- Keep the article/post visible so the demo feels like “reading with Prism,” not a separate app.
- If time is short, drop technical detail and end on the reflection prompt.
- For “what’s next,” point to `experiments/` READMEs and optional schema extensions.
