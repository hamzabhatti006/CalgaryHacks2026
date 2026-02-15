/**
 * Popup entry point. Wires extraction, analyzeClient, and analysisStore.
 * UX lead owns Popup.tsx composition; this provides a minimal working shell.
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  getState,
  subscribe,
  setLoading,
  setSuccess,
  setError,
} from '../state/analysisStore';
import { analyze } from '../api/analyzeClient';

function PopupApp() {
  const [state, setState] = React.useState(getState);

  React.useEffect(() => subscribe(setState), []);

  const handleAnalyze = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      setError('No active tab');
      return;
    }

    setLoading();
    try {
      const res = await new Promise<{ ok: boolean; data?: { url: string; title: string; text: string }; error?: string }>(
        (resolve) => {
          chrome.tabs.sendMessage(tab.id!, { type: 'EXTRACT' }, (r) => {
            if (chrome.runtime.lastError) {
              resolve({ ok: false, error: chrome.runtime.lastError.message });
            } else {
              resolve(r ?? { ok: false, error: 'No response' });
            }
          });
        }
      );

      if (!res.ok || !res.data) {
        setError(res.error ?? 'Extraction failed');
        return;
      }

      const result = await analyze(res.data);
      setSuccess(result, { url: res.data.url, title: res.data.title });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    }
  };

  if (state.status === 'loading') {
    return (
      <div className="prism-popup">
        <p>Analyzing…</p>
      </div>
    );
  }

  if (state.status === 'error') {
    return (
      <div className="prism-popup">
        <p className="prism-error">{state.error}</p>
        <button onClick={handleAnalyze}>Retry</button>
      </div>
    );
  }

  if (state.status === 'success' && state.result) {
    const { perspectives, bias, reflection } = state.result;
    return (
      <div className="prism-popup">
        {state.requestMeta && <h2>{state.requestMeta.title}</h2>}
        <section>
          {perspectives.map((p, i) => (
            <div key={i} className="prism-perspective">
              <strong>{p.label}</strong>
              <p>{p.body}</p>
            </div>
          ))}
        </section>
        {bias && Object.keys(bias).length > 0 && (
          <section>
            <h3>Bias indicators</h3>
            <pre>{JSON.stringify(bias, null, 2)}</pre>
          </section>
        )}
        {reflection && (
          <section>
            <h3>Reflect</h3>
            <p>{reflection}</p>
          </section>
        )}
        <button onClick={handleAnalyze}>Analyze again</button>
      </div>
    );
  }

  return (
    <div className="prism-popup">
      <h1>Prism</h1>
      <p>Expand perspectives on the current page.</p>
      <button onClick={handleAnalyze}>Analyze page</button>
    </div>
  );
}

const root = document.getElementById('root');
if (root) createRoot(root).render(<PopupApp />);
