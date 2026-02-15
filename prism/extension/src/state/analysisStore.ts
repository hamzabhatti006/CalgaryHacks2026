/**
 * =============================================================================
 * FILE PURPOSE
 * =============================================================================
 *
 * This file defines the client-side state for the current analysis: loading
 * flag, result (perspectives, bias indicators, reflection), error state, and
 * optionally the last analyzed content/source. It is the single source of
 * truth for the popup UI.
 *
 * =============================================================================
 * OWNER ROLE
 * =============================================================================
 *
 * Extension Lead
 *
 * =============================================================================
 * RESPONSIBILITIES
 *
 * - Hold: status (idle | loading | success | error), result (schema-shaped),
 *   error message, and optionally request metadata (URL, title).
 * - Provide a minimal store interface: get/set or subscribe so Popup and
 *   children can read and react to state changes.
 * - Persist to extension storage only if we want "last analysis" to survive
 *   popup close (optional; document in integration notes).
 * - No API calls or DOM access; pure state.
 *
 * =============================================================================
 * INTEGRATION NOTES
 *
 * - Popup.tsx and popup components read from this store.
 * - api/analyzeClient.ts (or Popup) updates the store after API success/failure.
 * - Result shape must match shared/schema/analysisSchema.json so UI and backend
 *   stay in sync. Experiments may extend the schema; store should hold whatever
 *   the API returns.
 *
 * =============================================================================
 */

/** Schema-aligned perspective from backend */
export interface Perspective {
  label: string;
  body: string;
}

/** Bias shape from backend: indicators array only (e.g. "Emotional framing", "Loaded language") */
export interface BiasResult {
  indicators: string[];
}

/** Response shape per shared/schema/analysisSchema.json */
export interface AnalysisResult {
  perspectives: Perspective[];
  bias?: BiasResult;
  reflection?: string;
  pageSummary?: string[];
}

export type AnalysisStatus = 'idle' | 'loading' | 'success' | 'error';

export interface AnalysisState {
  status: AnalysisStatus;
  result: AnalysisResult | null;
  error: string | null;
  requestMeta: { url: string; title: string; text?: string } | null;
}

type Listener = (state: AnalysisState) => void;

let state: AnalysisState = {
  status: 'idle',
  result: null,
  error: null,
  requestMeta: null,
};

const listeners = new Set<Listener>();
const STORAGE_KEY = 'prism_last_analysis';

function emit(): void {
  listeners.forEach((fn) => fn(state));
}

async function persist(): Promise<void> {
  if (state.status !== 'success' || !state.result) return;
  try {
    await chrome.storage.session.set({
      [STORAGE_KEY]: {
        result: state.result,
        requestMeta: state.requestMeta,
        timestamp: Date.now(),
      },
    });
  } catch {
    /* ignore */
  }
}

export async function initFromStorage(): Promise<void> {
  try {
    const stored = await chrome.storage.session.get(STORAGE_KEY);
    const raw = stored[STORAGE_KEY];
    if (raw && raw.result?.perspectives?.length) {
      state = {
        status: 'success',
        result: raw.result,
        error: null,
        requestMeta: raw.requestMeta ?? null,
      };
      emit();
    }
  } catch {
    /* ignore */
  }
}

export function getState(): AnalysisState {
  return state;
}

export function setLoading(meta?: { url: string; title: string }): void {
  state = {
    status: 'loading',
    result: null,
    error: null,
    requestMeta: meta ?? state.requestMeta,
  };
  emit();
}

export function setSuccess(result: AnalysisResult, meta?: { url: string; title: string; text?: string }): void {
  state = {
    status: 'success',
    result,
    error: null,
    requestMeta: meta ?? state.requestMeta,
  };
  emit();
  void persist();
}

export function setError(message: string): void {
  state = {
    status: 'error',
    result: null,
    error: message,
    requestMeta: state.requestMeta,
  };
  emit();
}

export function subscribe(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
