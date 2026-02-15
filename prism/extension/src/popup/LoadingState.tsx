/**
 * Loading state for the popup while analysis is in progress.
 * Owner: UX/Interaction Lead.
 */

import React from 'react';

const MESSAGES = [
  'Analyzing…',
  'Building perspectives…',
  'Identifying lenses…',
];

export function LoadingState({ message }: { message?: string }) {
  const displayMessage = message ?? MESSAGES[0];
  return (
    <div
      className="prism-loading prism-pad"
      role="status"
      aria-live="polite"
      aria-label="Analysis in progress"
    >
      <div className="prism-loading__spinner" aria-hidden="true" />
      <p className="prism-loading__message prism-text-muted">{displayMessage}</p>
    </div>
  );
}
