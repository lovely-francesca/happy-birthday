import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { Icon } from './Icon';

interface LandingScreenProps {
  onStart: () => void;
}

interface Cloud {
  top: number;
  width: number;
  duration: number;
  delay: number;
  opacity: number;
  blur: number;
}

const CLOUDS: Cloud[] = [
  { top: 7, width: 190, duration: 54, delay: -10, opacity: 0.95, blur: 0.4 },
  { top: 20, width: 120, duration: 68, delay: -44, opacity: 0.75, blur: 1.2 },
  { top: 33, width: 230, duration: 80, delay: -26, opacity: 0.6, blur: 1.8 },
  { top: 50, width: 140, duration: 62, delay: -52, opacity: 0.55, blur: 1.4 },
  { top: 64, width: 205, duration: 74, delay: -18, opacity: 0.45, blur: 2.2 },
  { top: 79, width: 160, duration: 58, delay: -36, opacity: 0.4, blur: 2.4 },
];

type CloudStyle = CSSProperties & {
  '--top': string;
  '--w': string;
  '--dur': string;
  '--delay': string;
  '--opacity': number;
  '--blur': string;
};

/** Landing page: cielo, nuvole in movimento e titolo che emerge dalle nuvole. */
export function LandingScreen({ onStart }: LandingScreenProps) {
  const [showCta, setShowCta] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowCta(true), 3000);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main className="landing">
      <div className="landing__sky" aria-hidden="true">
        {CLOUDS.map((cloud, index) => {
          const style: CloudStyle = {
            '--top': `${cloud.top}%`,
            '--w': `${cloud.width}px`,
            '--dur': `${cloud.duration}s`,
            '--delay': `${cloud.delay}s`,
            '--opacity': cloud.opacity,
            '--blur': `${cloud.blur}px`,
          };
          return <span key={index} className="landing__cloud" style={style} />;
        })}
        <span className="landing__sun" />
        <span className="landing__spark landing__spark--1">✦</span>
        <span className="landing__spark landing__spark--2">✦</span>
        <span className="landing__spark landing__spark--3">✦</span>
      </div>

      <div className="landing__stage">
        <p className="landing__eyebrow">Un invito speciale</p>

        <h1 className="landing__title">
          <span className="landing__title-top">Francesca’s</span>
          <span className="landing__title-main">Birthday</span>
        </h1>

        <p className="landing__subtitle">
          Sette tappe, qualche indizio e una sorpresa tutta per te.
        </p>

        <div className="landing__cloudbank" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>

      <div
        className={`landing__cta-wrap${showCta ? ' is-visible' : ''}`}
        aria-hidden={!showCta}
      >
        <button
          type="button"
          className="btn btn--primary btn--big btn--wide landing__cta"
          onClick={onStart}
          disabled={!showCta}
          tabIndex={showCta ? 0 : -1}
        >
          Iniziamo il viaggio
          <Icon name="arrow" size={20} />
        </button>
        <p className="landing__hint">Tocca per iniziare · 7 tappe</p>
      </div>
    </main>
  );
}
