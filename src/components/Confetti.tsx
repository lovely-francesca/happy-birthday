import { useMemo } from 'react';
import type { CSSProperties } from 'react';

const COLORS = ['#ffd166', '#ff8fab', '#58cc02', '#1cb0f6', '#ff9600', '#c77dff', '#ffffff', '#ff4d6d'];
const PIECES = 64;

/** Coriandoli puramente CSS: leggeri e senza dipendenze. */
export function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: PIECES }, (_, index) => ({
        left: Math.random() * 100,
        delay: Math.random() * 2.4,
        duration: 3.8 + Math.random() * 3.2,
        size: 6 + Math.random() * 9,
        color: COLORS[index % COLORS.length],
        drift: (Math.random() - 0.5) * 220,
        spin: Math.random() * 360,
        round: Math.random() < 0.3,
      })),
    [],
  );

  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((piece, index) => {
        const style = {
          left: `${piece.left}%`,
          width: `${piece.size}px`,
          height: `${piece.round ? piece.size : piece.size * 0.5}px`,
          backgroundColor: piece.color,
          animationDelay: `${piece.delay}s`,
          animationDuration: `${piece.duration}s`,
          '--drift': `${piece.drift}px`,
          '--spin': `${piece.spin}deg`,
        } as CSSProperties;

        return (
          <span
            key={index}
            className={`confetti__piece${piece.round ? ' confetti__piece--round' : ''}`}
            style={style}
          />
        );
      })}
    </div>
  );
}
