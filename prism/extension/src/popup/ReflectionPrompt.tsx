/**
 * Reflection prompt: question or CTA to encourage reflection.
 * Owner: UX/Interaction Lead. Supports idea4_reflection_mode.
 */

import React, { useState } from 'react';

interface ReflectionPromptProps {
  prompt: string;
  /** If true, show a short input and require a response before "Done" (locked exit). */
  requireResponse?: boolean;
  onDone?: (response?: string) => void;
}

export function ReflectionPrompt({
  prompt,
  requireResponse = false,
  onDone,
}: ReflectionPromptProps) {
  const [response, setResponse] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleDone = () => {
    if (requireResponse && response.trim() && !submitted) {
      setSubmitted(true);
      onDone?.(response.trim());
    } else {
      onDone?.();
    }
  };

  return (
    <section className="prism-section prism-reflection" aria-labelledby="prism-reflection-heading">
      <h2 id="prism-reflection-heading" className="prism-heading prism-heading--sm">
        Reflect
      </h2>
      <div className="prism-card">
        <p className="prism-reflection__prompt">{prompt}</p>
        {requireResponse && !submitted && (
          <div className="prism-reflection__input-wrap">
            <label htmlFor="prism-reflection-input" className="prism-text-muted">
              One sentence (optional but encouraged)
            </label>
            <textarea
              id="prism-reflection-input"
              className="prism-reflection__input"
              rows={2}
              placeholder="e.g. I hadn’t considered the economic incentives behind this framing."
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              aria-label="Your reflection"
            />
          </div>
        )}
        {onDone && (
          <button
            type="button"
            className="prism-btn prism-btn--secondary prism-reflection__btn"
            onClick={handleDone}
          >
            {submitted ? 'Done' : requireResponse && !response.trim() ? 'Skip' : 'Done'}
          </button>
        )}
      </div>
    </section>
  );
}
