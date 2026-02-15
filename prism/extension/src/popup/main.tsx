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

  const [selectedPerspective, setSelectedPerspective] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (state.result && selectedPerspective !== null && selectedPerspective >= state.result.perspectives.length) {
      setSelectedPerspective(null);
    }
  }, [state.result?.perspectives?.length, selectedPerspective]);

  if (state.status === 'success' && state.result) {
    const { perspectives, bias, reflection, pageSummary } = state.result;
    const title = state.requestMeta?.title ?? 'Page';

    if (selectedPerspective !== null) {
      const p = perspectives[selectedPerspective];
      if (p) {
        return (
          <div className="prism-popup prism-pad">
            <Header />
            <h2 className="prism-heading">{title}</h2>
            <p className="prism-perspective-expanded-label">{p.label}</p>
            <section className="prism-section">
              <div className="prism-page-content prism-expanded-content">
                <p className="prism-perspective-body-expanded">{p.body}</p>
                {Array.isArray(pageSummary) && pageSummary.length >= 3 && (
                  <ul className="prism-list prism-page-content__list prism-summary-in-expanded">
                    {pageSummary.map((s, i) => (
                      <li key={i} className="prism-page-content__item">{s}</li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
            {Array.isArray(bias?.indicators) && bias.indicators.length > 0 && (
              <section className="prism-section prism-bias-section">
                <h3 className="prism-bias-heading">Detected Biases</h3>
                <div className="prism-bias-chips" role="list">
                  {bias.indicators.map((label, i) => (
                    <span key={i} className="prism-bias-chip" role="listitem">{label}</span>
                  ))}
                </div>
              </section>
            )}
            {reflection && (
              <section className="prism-section prism-reflection-expanded">
                <div className="prism-reflection-header">
                  <span className="prism-reflection-check">✓</span>
                  <span>Reflection Unlocked!</span>
                </div>
                <p className="prism-reflection__prompt">{reflection}</p>
              </section>
            )}
            <button className="prism-btn prism-btn-go-back" onClick={() => setSelectedPerspective(null)}>
              Go Back
            </button>
          </div>
        );
      }
    }

    const summaryText = Array.isArray(pageSummary) && pageSummary.length >= 3
      ? pageSummary.join(' ')
      : 'Click Analyze to see perspectives on this page.';

    return (
      <div className="prism-popup prism-pad">
        <Header />
        <h2 className="prism-heading">{title}</h2>
        <p className="prism-summary-preview prism-text-muted">{summaryText}</p>
        <section className="prism-section">
          <h3 className="prism-perspectives-heading">Perspectives</h3>
          <div className="prism-perspectives-divider" />
          <div className="prism-perspective-cards">
            {perspectives.map((p, i) => (
              <button
                key={i}
                type="button"
                className="prism-perspective-card"
                onClick={() => setSelectedPerspective(i)}
              >
                <h4 className="prism-perspective-card__title">{p.label}</h4>
                <p className="prism-perspective-card__subtitle">View insights from this angle</p>
              </button>
            ))}
          </div>
        </section>
        <p className="prism-footer-hint prism-text-muted">
          <span className="prism-footer-icon" aria-hidden>ℹ</span>
          Select a perspective for more insights
        </p>
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