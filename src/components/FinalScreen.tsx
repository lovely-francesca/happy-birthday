import { useEffect, useRef, useState } from 'react';
import { birthday } from '../data/birthday';
import { Icon } from './Icon';
import { Mascot } from './Mascot';
import { StepFigure } from './StepFigure';
import { Confetti } from './Confetti';
import { Fireworks } from './Fireworks';

interface FinalScreenProps {
  completed: number;
  totalSteps: number;
  totalStars: number;
  onReplay: () => void;
  onBackToPath: () => void;
}

export function FinalScreen({
  completed,
  totalSteps,
  totalStars,
  onReplay,
  onBackToPath,
}: FinalScreenProps) {
  const [burst, setBurst] = useState(0);
  const [giftPhase, setGiftPhase] = useState<'idle' | 'countdown' | 'revealed'>('idle');
  const [countdown, setCountdown] = useState(3);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const figureRef = useRef<HTMLDivElement | null>(null);
  const maxStars = totalSteps * 3;

  const startGiftPress = () => {
    if (giftPhase === 'revealed' || pressTimer.current) return;
    figureRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    pressTimer.current = setTimeout(() => {
      pressTimer.current = null;
      setCountdown(3);
      setGiftPhase('countdown');
    }, 600);
  };

  const cancelGiftPress = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  useEffect(() => {
    if (giftPhase !== 'countdown') return;
    const interval = setInterval(() => {
      setCountdown((value) => {
        if (value <= 1) {
          setGiftPhase('revealed');
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [giftPhase]);

  useEffect(() => cancelGiftPress, []);

  return (
    <main className="final-screen">
      <Fireworks key={`fireworks-${burst}`} />
      <Confetti key={`confetti-${burst}`} />

      <div className="final__content">
        <button type="button" className="final__back" onClick={onBackToPath}>
          <Icon name="arrow" size={16} className="final__back-icon" />
          Rivedi il percorso
        </button>

        <p className="final__eyebrow">
          <span aria-hidden="true">✦</span> È il tuo giorno <span aria-hidden="true">✦</span>
        </p>
        <h1 className="final__title">
          Buon compleanno,
          <span>{birthday.name}!</span>
        </h1>

        <div className="final__figure" ref={figureRef}>
          {giftPhase === 'revealed' ? (
            <div className="final__gift-stage" aria-live="polite">
              <img
                src="images/non-te-lo-dico.png"
                alt="Sorpresa rimandata"
                className="final__gift-stage-img"
              />
              <p className="final__gift-reveal-text">NON TE LO DICO</p>
            </div>
          ) : giftPhase === 'countdown' ? (
            <div className="final__gift-stage" aria-live="polite">
              <span className="final__gift-count" aria-hidden="true">
                {countdown}
              </span>
            </div>
          ) : (
            <StepFigure image={birthday.finalImage} />
          )}
        </div>

        <Mascot size={158} className="final__mascot" />

        <div className="final__card">
          <p>{birthday.message}</p>
          <span className="final__signature">{birthday.signature}</span>
        </div>

        <div
          className={`final__gift${giftPhase === 'countdown' ? ' final__gift--counting' : ''}`}
          role="button"
          tabIndex={0}
          aria-label="Tieni premuto per la sorpresa"
          onPointerDown={startGiftPress}
          onPointerUp={cancelGiftPress}
          onPointerLeave={cancelGiftPress}
          onPointerCancel={cancelGiftPress}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') startGiftPress();
          }}
          onKeyUp={cancelGiftPress}
          onContextMenu={(event) => event.preventDefault()}
        >
          <span className="final__gift-emoji" aria-hidden="true">
            🎁
          </span>
          <div>
            <span className="final__gift-kicker">La tua sorpresa</span>
            <p>{birthday.giftHint}</p>
          </div>
        </div>

        <div className="final__stats">
          <div>
            <Icon name="trophy" size={22} />
            <strong>
              {completed}/{totalSteps}
            </strong>
            <span>tappe</span>
          </div>
          <div>
            <Icon name="star" size={22} />
            <strong>
              {totalStars}/{maxStars}
            </strong>
            <span>stelle</span>
          </div>
        </div>

        <div className="final__actions">
          <button type="button" className="btn btn--ghost btn--wide" onClick={onReplay}>
            <Icon name="reset" size={20} />
            RIGIOCA IL PERCORSO
          </button>
        </div>

        <button type="button" className="final__again" onClick={() => setBurst((value) => value + 1)}>
          <Icon name="sparkles" size={16} /> Rivedi i fuochi
        </button>

        <p className="final__footer">Fatto con amore, per te. 🎂</p>
      </div>
    </main>
  );
}
