# Prism — Architecture

## High-Level System Diagram (Conceptual)

The system has three main parts: the browser extension (client), the backend (API + LLM + logic), and the shared schema that ties them together.

- **Extension:** Runs in the user’s browser. It has a content layer (extractContent, domUtils) that gets text from the current tab, a popup UI (Popup and child components) that shows analysis, a client-side store (analysisStore), and an API client (analyzeClient) that talks to the backend.
- **Backend:** A single HTTP service. It exposes one main route (analyze). That route takes the payload from the extension, sanitizes and truncates input, builds a prompt (promptBuilder), calls the LLM (llmService), validates and normalizes the response (responseValidator), optionally runs bias detection (biasDetection), and returns JSON that matches the shared schema.
- **Shared schema:** Defines the request body (e.g. url, title, text) and the response body (e.g. perspectives, bias, reflection). Both extension and backend depend on it so that adding experiments or swapping implementations does not break the contract.

There is no diagram image; the above is the intended structure. Data flows one way: page → extract → store (loading) → API → backend pipeline → response → store (result) → popup UI.

---

## Data Flow Steps

1. **User opens popup** on a page they want to analyze. Popup may show last result or empty state.
2. **User triggers analysis.** Popup (or background) gets the active tab; content script or popup-injected logic runs extractContent, which uses domUtils to get main text, title, and URL. Result is a payload matching the schema request shape.
3. **analysisStore** is set to loading. analyzeClient sends a POST request to the backend analyze route with that payload.
4. **Backend analyze route** receives the body. It runs textSanitizer and truncation on url, title, and text. It calls promptBuilder to build the prompt(s), then llmService to get the raw LLM output. responseValidator parses and validates the output into the schema response shape. Optionally, biasDetection runs on the validated result or on the raw text and its output is merged into the response. The route returns 200 with that JSON or an error status with a message.
5. **analyzeClient** receives the response. On success, the caller (e.g. Popup) updates analysisStore with the result; on failure, it sets error state. No direct store access from analyzeClient keeps responsibilities clear.
6. **Popup re-renders.** PerspectiveMatrix shows perspectives, BiasIndicators shows bias, ReflectionPrompt shows reflection if present. LoadingState is hidden. User can read and optionally trigger analysis again (e.g. on another tab).

End-to-end: page content → extract → API request → sanitize/truncate → prompt → LLM → validate → (bias) → response → store → UI.

---

## Separation of Concerns

- **Extension content (extractContent, domUtils):** Only DOM and extraction. No API, no store, no UI.
- **Extension popup (Popup, PerspectiveMatrix, BiasIndicators, ReflectionPrompt, LoadingState):** Only UI and wiring to store and API. Popup triggers extract and analyze; components only read store and render.
- **Extension state (analysisStore):** Single source of truth for analysis status and result. No API or DOM.
- **Extension API (analyzeClient):** Only HTTP to backend. No store writes; caller updates store.
- **Backend route (analyzeRoute):** Orchestration only. Validates input, calls utils and services, returns response. No prompt text, no LLM calls, no bias logic implemented in the route.
- **Backend services (llmService, promptBuilder, responseValidator):** Each has one job: call LLM, build prompt, validate/normalize response. No orchestration.
- **Backend logic (biasDetection):** Pure function(s): input (text and/or validated response) → bias result. No HTTP, no prompts.
- **Backend utils (textSanitizer, truncation):** Pure string in/out. No I/O.

This keeps changes local: e.g. a new experiment can change promptBuilder and BiasIndicators without touching extractContent, analyzeClient, or the route contract.

---

## Why Modular Design Supports Experimentation

- **Single analyze contract:** Request and response are defined once in shared/schema. Experiments add optional fields or new components instead of changing the core contract, so the same extension can talk to different backend branches (e.g. with/without bias scoring, with/without reflection).
- **Swappable prompt and bias:** promptBuilder and biasDetection are the main “idea” surfaces. idea1 (perspective matrix), idea2 (cognitive bias scoring), idea4 (reflection mode) change prompts and optionally bias/reflection handling; the route and extension flow stay the same.
- **UI composition:** Popup composes small components. An experiment can reorder them (e.g. reflection first), replace one (e.g. SourceComparison instead of PerspectiveMatrix for idea3), or add a new one without rewriting the whole popup.
- **Clear ownership:** Extension Lead, Backend Lead, AI/Prompt Lead, UX/Interaction Lead, Product/Demo Lead own specific files. Parallel work and branching stay clear; merge conflicts are limited to the files that actually change per experiment.
- **Experiments folder:** Each idea has a README that describes concept, difference from MVP, and what would change in backend prompts, frontend UI, and schema. No implementation there—only a map for “if we pivot, change these modules.” That keeps the repo scalable for a 24-hour hackathon and judge demos.
