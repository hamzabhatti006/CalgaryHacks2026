/**
 * Popup entry point. Wires extraction, analyzeClient, and analysisStore.
 * UX lead owns Popup.tsx composition; this provides a minimal working shell.
 */

import React from 'react';
import logoUrl from '../assets/logo.png';
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
      setSuccess(result, { url: res.data.url, title: res.data.title, text: res.data.text });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    }
  };

  const Header = () => (
    <header className="prism-header">
      <img src={logoUrl} alt="Prism" className="prism-logo" />
      <div className="prism-brand">
        <h1 className="prism-brand__title">Prism</h1>
        <p className="prism-brand__tagline">Expand perspectives on the current page.</p>
      </div>
    </header>
  );

  if (state.status === 'loading') {
    return (
      <div className="prism-popup prism-pad">
        <Header />
        <div className="prism-loading">
          <div className="prism-loading__spinner" />
          <p className="prism-loading__message prism-text-muted">Analyzing…</p>
        </div>
      </div>
    );
  }

  if (state.status === 'error') {
    return (
      <div className="prism-popup prism-pad">
        <Header />
        <p className="prism-error">{state.error}</p>
        <button className="prism-btn" onClick={handleAnalyze}>Retry</button>
      </div>
    );
  }

  const PERSPECTIVE_COLORS = ['#E4313B', '#4285F4', '#34A853', '#FBBC05', '#8A7EF0', '#00ACC1'];

  if (state.status === 'success' && state.result) {
    const { perspectives, bias, reflection } = state.result;
    const pageText = state.requestMeta?.text;
    return (
      <div className="prism-popup prism-pad">
        <Header />
        {state.requestMeta && (
          <>
            <h2 className="prism-heading">{state.requestMeta.title}</h2>
            {pageText && (
              <section className="prism-section">
                <h3 className="prism-heading prism-heading--sm" style={{ marginBottom: 'var(--prism-space-sm)' }}>Page content</h3>
                <div className="prism-page-content">
                  <p className="prism-page-content__text">{pageText.length > 1200 ? pageText.slice(0, 1200) + '…' : pageText}</p>
                </div>
              </section>
            )}
          </>
        )}
        <section className="prism-section">
          <h3 className="prism-heading prism-heading--sm" style={{ marginBottom: 'var(--prism-space-md)' }}>Perspectives</h3>
          {perspectives.map((p, i) => (
            <div key={i} className="prism-perspective">
              <div className="prism-perspective__bar" style={{ background: PERSPECTIVE_COLORS[i % PERSPECTIVE_COLORS.length] }} />
              <div className="prism-perspective__content">
                <h4 className="prism-perspective__label">{p.label}</h4>
                <p className="prism-perspective__body">{p.body}</p>
              </div>
            </div>
          ))}
        </section>
        {bias && Object.keys(bias).length > 0 && (
          <section className="prism-section">
            <h3 className="prism-heading prism-heading--sm">Bias indicators</h3>
            <pre className="prism-card">{JSON.stringify(bias, null, 2)}</pre>
          </section>
        )}
        {reflection && (
          <section className="prism-section">
            <h3 className="prism-heading prism-heading--sm">Reflect</h3>
            <p className="prism-reflection__prompt">{reflection}</p>
          </section>
        )}
        <button className="prism-btn prism-btn--secondary" onClick={handleAnalyze}>Analyze again</button>
      </div>
    );
  }

  return (
    <div className="prism-popup prism-pad">
      <Header />
      <p className="prism-text-muted" style={{ marginBottom: 'var(--prism-space-lg)' }}>
        Click below to analyze the current page and see multiple perspectives.
      </p>
      <button className="prism-btn" onClick={handleAnalyze}>Analyze page</button>
    </div>
  );
}

const root = document.getElementById('root');
if (root) createRoot(root).render(<PopupApp />);
