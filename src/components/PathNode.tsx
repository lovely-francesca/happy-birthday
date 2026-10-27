import type { Ref } from 'react';
import type { Step } from '../types';
import { t } from '../lib/text';
import { Icon } from './Icon';

export type NodeState = 'completed' | 'current' | 'locked';

interface PathNodeProps {
  step: Step;
  state: NodeState;
  x: number;
  y: number;
  stars: number;
  nodeRef?: Ref<HTMLButtonElement>;
  onClick: () => void;
}

export function PathNode({ step, state, x, y, stars, nodeRef, onClick }: PathNodeProps) {
  const label =
    state === 'locked'
      ? `${t(step.title)} (bloccata)`
      : state === 'completed'
        ? `${t(step.title)} (completata, ${stars} stelle)`
        : `${t(step.title)} (da giocare)`;

  return (
    <button
      ref={nodeRef}
      type="button"
      className={`node node--${state}${step.kind === 'final' ? ' node--final' : ''}`}
      style={{ left: `${x}px`, top: `${y}px` }}
      onClick={onClick}
      aria-label={label}
    >
      <span className="node__circle">
        <Icon name={state === 'locked' ? 'lock' : state === 'completed' ? 'star' : step.icon} size={34} />
        {state === 'completed' && (
          <span className="node__stars" aria-hidden="true">
            {Array.from({ length: 3 }, (_, index) => (
              <span key={index} className={index < stars ? 'is-on' : ''}>
                ★
              </span>
            ))}
          </span>
        )}
      </span>
      <span className="node__label">{t(step.title)}</span>
    </button>
  );
}
