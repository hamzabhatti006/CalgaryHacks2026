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
  initFromStorage,
} from '../state/analysisStore';
import { analyze } from '../api/analyzeClient';

function PopupApp() {
  const [state, setState] = React.useState(getState);

  React.useEffect(() => {
    initFromStorage();
  }, []);
  React.useEffect(() => subscribe(setState), []);

  const handleAnalyze = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      setError('No active tab');
      return;
    }

    const tabUrl = tab.url ?? '';
    if (!tabUrl.startsWith('http://') && !tabUrl.startsWith('https://')) {
      setError('Can\'t analyze this page. Open a normal website (not New Tab / chrome://).');
      return;
    }

    setLoading();
    try {
      const res = await new Promise<{
      ok: boolean;
      data?: { url: string; title: string; text: string };
      error?: string;
    }>((resolve) => {
      chrome.tabs.sendMessage(tab.id!, { type: 'EXTRACT' }, (r) => {
        const lastErr = chrome.runtime.lastError?.message;

        if (lastErr) {
          if (lastErr.includes('Receiving end does not exist')) {
            resolve({
              ok: false,
              error: 'Can’t analyze this page. Open a normal website (not New Tab / chrome://).',
            });
          } else {
            resolve({ ok: false, error: lastErr });
          }
          return;
        }

        resolve(r ?? { ok: false, error: 'No response from content script' });
      });
    });

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
