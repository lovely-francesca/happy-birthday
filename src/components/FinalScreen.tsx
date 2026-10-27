import { useState } from 'react';
import { birthday } from '../data/birthday';
import { Icon } from './Icon';
import { Mascot } from './Mascot';
import { Confetti } from './Confetti';
import { Fireworks } from './Fireworks';

interface FinalScreenProps {
  completed: number;
  totalSteps: number;
  totalStars: number;
  onShare: () => Promise<void> | void;
  onReplay: () => void;
  onBackToPath: () => void;
}

export function FinalScreen({
  completed,
  totalSteps,
  totalStars,
  onShare,
  onReplay,
  onBackToPath,
}: FinalScreenProps) {
  const [burst, setBurst] = useState(0);
  const maxStars = totalSteps * 3;

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
        <p className="final__date">
          {birthday.age} anni · {birthday.dateLabel}
        </p>

        <Mascot size={158} className="final__mascot" />

        <div className="final__card">
          <p>{birthday.message}</p>
          <span className="final__signature">{birthday.signature}</span>
        </div>

        <div className="final__gift">
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
          <button type="button" className="btn btn--primary btn--wide" onClick={() => void onShare()}>
            <Icon name="share" size={20} />
            CONDIVIDI
          </button>
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
