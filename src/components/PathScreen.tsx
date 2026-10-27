import { useEffect, useRef, useState } from 'react';
import type { Progress } from '../lib/progress';
import type { Step } from '../types';
import { birthday } from '../data/birthday';
import { t } from '../lib/text';
import { Icon } from './Icon';
import { Mascot } from './Mascot';
import { PathNode } from './PathNode';
import type { NodeState } from './PathNode';

const ROW = 132;
const NODE_SIZE = 86;
const PAD_TOP = 34;
const PAD_BOTTOM = 20;
const X_PATTERN = [50, 27, 50, 73];

interface Point {
  x: number;
  y: number;
}

function buildPath(points: Point[]): string {
  if (points.length === 0) return '';
  const [first, ...rest] = points;
  let path = `M ${first.x.toFixed(1)} ${first.y.toFixed(1)}`;
  let previous = first;

  for (const point of rest) {
    const middleY = (previous.y + point.y) / 2;
    path += ` C ${previous.x.toFixed(1)} ${middleY.toFixed(1)}, ${point.x.toFixed(1)} ${middleY.toFixed(1)}, ${point.x.toFixed(1)} ${point.y.toFixed(1)}`;
    previous = point;
  }

  return path;
}

interface PathScreenProps {
  steps: Step[];
  progress: Progress;
  onOpenStep: (id: string) => void;
  onNotice: (message: string) => void;
  onShowFinal: () => void;
}

export function PathScreen({ steps, progress, onOpenStep, onNotice, onShowFinal }: PathScreenProps) {
  const currentIndex = progress.completed.length;
  const allDone = currentIndex >= steps.length;
  const currentStep = allDone ? null : steps[currentIndex];
  const totalStars = Object.values(progress.stars).reduce((sum, value) => sum + value, 0);

  const canvasRef = useRef<HTMLDivElement>(null);
  const currentNodeRef = useRef<HTMLButtonElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const element = canvasRef.current;
    if (!element) return;
    const update = () => setWidth(element.clientWidth);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (currentIndex === 0 || allDone) return;
    const timer = window.setTimeout(() => {
      currentNodeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 400);
    return () => window.clearTimeout(timer);
  }, [currentIndex, allDone]);

  const height = PAD_TOP + Math.max(0, steps.length - 1) * ROW + NODE_SIZE + PAD_BOTTOM;
  const points = steps.map((_, index) => ({
    x: (width * X_PATTERN[index % X_PATTERN.length]) / 100,
    y: PAD_TOP + index * ROW + NODE_SIZE / 2,
  }));
  const fullPath = width > 0 ? buildPath(points) : '';
  const donePath =
    width > 0 && currentIndex > 0
      ? buildPath(points.slice(0, Math.min(currentIndex + 1, points.length)))
      : '';

  let coachMessage = 'Ciao {{name}}! Pronta? Tocca la prima tappa per iniziare.';
  if (allDone) {
    coachMessage = 'Percorso completato! La tua sorpresa ti aspetta. 🎁';
  } else if (currentIndex === steps.length - 1) {
    coachMessage = 'Ultima tappa... sento profumo di regalo. 🎁';
  } else if (currentIndex >= 4) {
    coachMessage = 'Sei quasi alla fine. Non fermarti ora!';
  } else if (currentIndex >= 1) {
    coachMessage = 'Bravissima! Continua così.';
  }

  return (
    <main className="path-screen">
      <section className="path-intro">
        <span className="path-intro__eyebrow">
          <Icon name="sparkles" size={14} /> {steps.length} tappe · 5 minuti
        </span>
        <h1>
          Il percorso di <span>{birthday.name}</span>
        </h1>
        <p>Una tappa alla volta, fino alla sorpresa finale.</p>
      </section>

      <div className="path-canvas" ref={canvasRef} style={{ height }}>
        {width > 0 && (
          <svg
            className="path-svg"
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            aria-hidden="true"
            focusable="false"
          >
            <path className="path-svg__base" d={fullPath} />
            {donePath && <path className="path-svg__done" d={donePath} />}
          </svg>
        )}

        {steps.map((step, index) => {
          const state: NodeState =
            index < currentIndex ? 'completed' : index === currentIndex ? 'current' : 'locked';

          return (
            <PathNode
              key={step.id}
              step={step}
              state={state}
              x={points[index].x}
              y={points[index].y}
              stars={progress.stars[step.id] ?? 3}
              nodeRef={index === currentIndex ? currentNodeRef : undefined}
              onClick={() => {
                if (state === 'current') {
                  onOpenStep(step.id);
                } else if (state === 'completed') {
                  const stars = progress.stars[step.id] ?? 3;
                  onNotice(`Tappa già completata · ${'⭐'.repeat(stars)}`);
                } else {
                  onNotice('Prima completa la tappa precedente 🔒');
                }
              }}
            />
          );
        })}
      </div>

      <div className={`coach${allDone ? ' coach--done' : ''}`}>
        <Mascot size={96} className="coach__mascot" />
        <div className="coach__bubble">
          <p>{t(coachMessage)}</p>
          <span className="coach__stars">
            <Icon name="star" size={13} /> {totalStars}/{steps.length * 3} stelle
          </span>
        </div>
      </div>

      <div className="cta-bar">
        <div className="cta-bar__text">
          <span>{allDone ? 'Percorso completato' : `Tappa ${currentIndex + 1} di ${steps.length}`}</span>
          <strong>{allDone ? 'La sorpresa ti aspetta' : currentStep ? t(currentStep.title) : ''}</strong>
        </div>
        <button
          type="button"
          className="btn btn--primary btn--wide"
          onClick={() => {
            if (allDone) {
              onShowFinal();
            } else if (currentStep) {
              onOpenStep(currentStep.id);
            }
          }}
        >
          {allDone ? 'RIVEDI IL FINALE' : 'CONTINUA'}
          <Icon name="arrow" size={20} />
        </button>
      </div>
    </main>
  );
}
