/**
 * =============================================================================
 * FILE PURPOSE
 * =============================================================================
 *
 * This file is the extension's client for the Prism backend analyze API. It
 * sends extracted content (and optional options) to the backend and returns
 * the structured analysis response. All network calls to the backend go
 * through this module.
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
 * - Expose a single function (e.g. analyze(contentPayload, options)) that
 *   POSTs to the backend analyze route (see backend routes/analyzeRoute.ts).
 * - Serialize request body to match backend expectations (and analysisSchema).
 * - Parse JSON response and validate or pass through to caller.
 * - Handle network errors, timeouts, and non-2xx responses; surface clear
 *   error info so Popup/analysisStore can show error state.
 * - Backend base URL should be configurable (env or config) for dev vs prod.
 *
 * =============================================================================
 * INTEGRATION NOTES
 *
 * - Called from Popup (or background) after content is extracted via
 *   content/extractContent.ts. Request payload shape must align with
 *   backend routes/analyzeRoute.ts and shared schema.
 * - Response shape must match analysisSchema (backend responseValidator
 *   ensures this). Caller (Popup) typically writes result into analysisStore.
 *
 * =============================================================================
 */

import type { ExtractResult } from '../content/extractContent';
import type { AnalysisResult } from '../state/analysisStore';

/** Default backend base URL (dev); override via storage or env in build */
const DEFAULT_BASE_URL = 'http://localhost:3000';

/** Timeout in ms; target &lt;3s per concept doc */
const TIMEOUT_MS = 10000;

export interface AnalyzeOptions {
  baseUrl?: string;
}

/**
 * POST extracted content to the backend analyze endpoint.
 * Returns schema-shaped AnalysisResult or throws with a clear error message.
 */
export async function analyze(
  payload: ExtractResult,
  options: AnalyzeOptions = {}
): Promise<AnalysisResult> {
  const baseUrl = options.baseUrl ?? DEFAULT_BASE_URL;
  const url = `${baseUrl.replace(/\/$/, '')}/api/analyze`;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(id);

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const msg = data?.message || data?.error || `HTTP ${res.status}`;
      throw new Error(msg);
    }

    if (!Array.isArray(data?.perspectives)) {
      throw new Error('Invalid response: missing perspectives');
    }

    return {
      perspectives: data.perspectives,
      bias: data.bias,
      reflection: data.reflection,
    } as AnalysisResult;
  } catch (err) {
    clearTimeout(id);
    if (err instanceof Error) {
      if (err.name === 'AbortError') throw new Error('Request timed out');
      throw err;
    }
    throw new Error('Analysis request failed');
  }
}
