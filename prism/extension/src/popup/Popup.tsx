/**
 * Root popup component: composes analysis UI, state, and analyze trigger.
 * Owner: UX/Interaction Lead.
 *
 * Integration: When Extension Lead implements analysisStore and analyzeClient,
 * replace local useState with store subscription and trigger analyze via
 * extractContent (current tab) + analyzeClient( payload ).
 */

import React, { useState, useCallback } from 'react';
import type { AnalysisState, AnalysisResult } from '../types/analysis';
import { LoadingState } from './LoadingState';
import { PerspectiveMatrix } from './PerspectiveMatrix';
import { BiasIndicators } from './BiasIndicators';
import { ReflectionPrompt } from './ReflectionPrompt';
import '../styles/layout.css';

const INITIAL_STATE: AnalysisState = {
  status: 'idle',
  result: null,
  error: null,
};

/** Mock result for demo when backend is not connected. Replace with analyzeClient call. */
function getMockResult(): AnalysisResult {
  return {
    perspectives: [
      {
        label: 'Cultural / unity',
        body: 'This framing emphasizes shared identity and symbolic representation at major events. It invites readers to see the moment as part of a broader narrative about inclusion or tradition.',
        coreFraming: 'Symbolic representation and shared identity.',
        stakeholderImpact: 'Community and cultural groups centered; institutions as facilitators.',
        assumption: 'That the event is primarily meaningful as a cultural signal.',
      },
      {
        label: 'Economic',
        body: 'An economic lens focuses on incentives, contracts, and opportunity cost. Who benefits financially? What trade-offs were made?',
        coreFraming: 'Incentives and resource allocation.',
        stakeholderImpact: 'Sponsors, performers, and local economy; taxpayers or funders may be disadvantaged.',
        assumption: 'That the decision can be evaluated by monetary impact.',
      },
      {
        label: 'Institutional / policy',
        body: 'Institutional perspective asks how rules, norms, and authority shaped the outcome. What processes or policies applied?',
        coreFraming: 'Rules, process, and institutional accountability.',
        stakeholderImpact: 'Organizers and governing bodies; public as stakeholders in process.',
        assumption: 'That formal process and accountability matter for legitimacy.',
      },
    ],
    bias: {
      indicators: ['Emotional language', 'Individual blame emphasis', 'Single-stakeholder focus'],
    },
    reflection: 'Which lens did you not initially consider? What assumption does the original framing rely on?',
  };
}

export function Popup() {
  const [state, setState] = useState<AnalysisState>(INITIAL_STATE);

  const runAnalysis = useCallback(() => {
    setState({ status: 'loading', result: null, error: null });
    // TODO (Extension Lead): Get active tab, run extractContent, then analyzeClient(payload).
    // On success: setState({ status: 'success', result, error: null }).
    // On failure: setState({ status: 'error', result: null, error: message }).
    setTimeout(() => {
      setState({
        status: 'success',
        result: getMockResult(),
        error: null,
      });
    }, 1800);
  }, []);

  return (
    <div className="prism-popup prism-pad" role="main" aria-label="Prism perspective analysis">
      <h1 className="prism-heading" id="prism-title">
        Prism
      </h1>

      {state.status === 'loading' && (
        <LoadingState message="Building perspectives…" />
      )}

      {state.status === 'error' && (
        <div className="prism-section">
          <p className="prism-error" role="alert">
            {state.error ?? 'Analysis failed.'}
          </p>
          <button type="button" className="prism-btn" onClick={runAnalysis}>
            Try again
          </button>
        </div>
      )}

      {state.status === 'idle' && !state.result && (
        <div className="prism-section">
          <p className="prism-text-muted">
            Analyze this page to see multiple perspectives and framing notes.
          </p>
          <button
            type="button"
            className="prism-btn"
            onClick={runAnalysis}
            aria-describedby="prism-title"
          >
            Analyze with Prism
          </button>
        </div>
      )}

      {state.status === 'success' && state.result && (
        <>
          <PerspectiveMatrix perspectives={state.result.perspectives} />
          <BiasIndicators bias={state.result.bias} />
          {state.result.reflection && (
            <ReflectionPrompt
              prompt={state.result.reflection}
              requireResponse={false}
            />
          )}
          <div className="prism-section">
            <button type="button" className="prism-btn prism-btn--secondary" onClick={runAnalysis}>
              Analyze again
            </button>
          </div>
        </>
      )}
    </div>
  );
}
