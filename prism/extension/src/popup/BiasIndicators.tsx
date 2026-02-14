/**
 * Bias indicators: framing / cognitive bias signals from analysis.
 * Owner: UX/Interaction Lead.
 */

import React from 'react';
import type { AnalysisResult } from '../types/analysis';

interface BiasIndicatorsProps {
  bias: AnalysisResult['bias'];
}

function getIndicators(bias: AnalysisResult['bias']): string[] {
  if (!bias) return [];
  if (Array.isArray((bias as { indicators?: string[] }).indicators)) {
    return (bias as { indicators: string[] }).indicators;
  }
  if (typeof bias === 'object' && bias !== null) {
    const arr = (bias as Record<string, unknown>)['indicators'];
    if (Array.isArray(arr)) return arr as string[];
  }
  return [];
}

export function BiasIndicators({ bias }: BiasIndicatorsProps) {
  const indicators = getIndicators(bias);
  if (indicators.length === 0) return null;

  return (
    <section className="prism-section" aria-labelledby="prism-bias-heading">
      <h2 id="prism-bias-heading" className="prism-heading prism-heading--sm">
        Framing notes
      </h2>
      <div className="prism-badges">
        {indicators.map((label, i) => (
          <span key={i} className="prism-badge">
            {label}
          </span>
        ))}
      </div>
    </section>
  );
}
