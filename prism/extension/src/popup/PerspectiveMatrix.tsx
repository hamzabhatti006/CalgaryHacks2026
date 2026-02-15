/**
 * Perspective matrix: structured lenses/viewpoints from analysis.
 * Owner: UX/Interaction Lead.
 */

import React from 'react';
import type { Perspective } from '../types/analysis';

interface PerspectiveMatrixProps {
  perspectives: Perspective[];
}

function hasMatrixColumns(p: Perspective): boolean {
  return Boolean(p.coreFraming ?? p.stakeholderImpact ?? p.assumption);
}

export function PerspectiveMatrix({ perspectives }: PerspectiveMatrixProps) {
  if (!perspectives.length) return null;

  const useMatrixLayout = perspectives.some(hasMatrixColumns);

  return (
    <section className="prism-section" aria-labelledby="prism-perspectives-heading">
      <h2 id="prism-perspectives-heading" className="prism-heading prism-heading--sm">
        Perspectives
      </h2>
      {useMatrixLayout ? (
        <div className="prism-matrix">
          {perspectives.map((p, i) => (
            <div key={i} className="prism-card prism-matrix__card">
              <div className="prism-matrix__label">{p.label}</div>
              {p.coreFraming && (
                <div className="prism-matrix__row">
                  <span className="prism-text-muted">Framing:</span> {p.coreFraming}
                </div>
              )}
              {p.stakeholderImpact && (
                <div className="prism-matrix__row">
                  <span className="prism-text-muted">Stakeholders:</span> {p.stakeholderImpact}
                </div>
              )}
              {p.assumption && (
                <div className="prism-matrix__row">
                  <span className="prism-text-muted">Assumption:</span> {p.assumption}
                </div>
              )}
              <p className="prism-matrix__body">{p.body}</p>
            </div>
          ))}
        </div>
      ) : (
        <ul className="prism-list">
          {perspectives.map((p, i) => (
            <li key={i} className="prism-card">
              <div className="prism-matrix__label">{p.label}</div>
              <p className="prism-matrix__body">{p.body}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
