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
  const [giftPhase, setGiftPhase] = useState<'idle' | 'scrolling' | 'countdown' | 'revealed'>(
    'idle',
  );
  const [countdown, setCountdown] = useState(3);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const armedRef = useRef(false);
  const figureRef = useRef<HTMLDivElement | null>(null);
  const maxStars = totalSteps * 3;

  const startGiftPress = () => {
    if (giftPhase !== 'idle' || pressTimer.current) return;
    pressTimer.current = setTimeout(() => {
      pressTimer.current = null;
      armedRef.current = true;
    }, 600);
  };

  const endGiftPress = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
    if (armedRef.current && giftPhase === 'idle') {
      armedRef.current = false;
      setGiftPhase('scrolling');
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

  useEffect(() => {
    if (giftPhase !== 'scrolling') return;
    const el = figureRef.current;
    if (!el) {
      setCountdown(3);
      setGiftPhase('countdown');
      return;
    }
    const rect = el.getBoundingClientRect();
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const startY = window.scrollY;
    const endY = Math.max(
      0,
      Math.min(window.scrollY + rect.top + rect.height / 2 - window.innerHeight / 2, maxScroll),
    );
    if (Math.abs(endY - startY) < 2) {
      setCountdown(3);
      setGiftPhase('countdown');
      return;
    }
    const duration = 700;
    const startedAt = performance.now();
    const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - startedAt) / duration);
      window.scrollTo(0, startY + (endY - startY) * ease(t));
      if (t < 1) {
        raf = requestAnimationFrame(step);
      } else {
        setCountdown(3);
        setGiftPhase('countdown');
      }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [giftPhase]);

  useEffect(
    () => () => {
      if (pressTimer.current) clearTimeout(pressTimer.current);
    },
    [],
  );

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
          onPointerUp={endGiftPress}
          onPointerLeave={endGiftPress}
          onPointerCancel={endGiftPress}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') startGiftPress();
          }}
          onKeyUp={endGiftPress}
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
