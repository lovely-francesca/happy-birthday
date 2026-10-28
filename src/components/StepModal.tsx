import { useEffect, useRef, useState } from 'react';
import type { ChoiceStep, Step } from '../types';
import { t } from '../lib/text';
import { playSound, vibrate } from '../lib/sound';
import { Icon } from './Icon';
import { CompletionStars } from './CompletionStars';
import { StepFigure } from './StepFigure';

interface StepModalProps {
  step: Step;
  index: number;
  total: number;
  soundOn: boolean;
  onClose: () => void;
  onComplete: (stars: number) => void;
}

export function StepModal({ step, index, total, soundOn, onClose, onComplete }: StepModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    modalRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="step-question"
        tabIndex={-1}
        ref={modalRef}
      >
        <div className="modal__top">
          <button type="button" className="icon-btn icon-btn--soft" onClick={onClose} aria-label="Chiudi">
            <Icon name="x" size={20} />
          </button>
          <div className="dots" aria-hidden="true">
            {Array.from({ length: total }, (_, dotIndex) => (
              <span
                key={dotIndex}
                className={dotIndex < index ? 'is-done' : dotIndex === index ? 'is-current' : ''}
              />
            ))}
          </div>
          <span className="modal__counter">
            {index + 1}/{total}
          </span>
        </div>

        {step.kind === 'final' ? (
          <FinalStepBody step={step} soundOn={soundOn} onComplete={onComplete} />
        ) : (
          <ChoiceStepBody step={step} soundOn={soundOn} onComplete={onComplete} />
        )}
      </div>
    </div>
  );
}

interface BodyProps {
  soundOn: boolean;
  onComplete: (stars: number) => void;
}

function FinalStepBody({ step, soundOn, onComplete }: BodyProps & { step: Extract<Step, { kind: 'final' }> }) {
  return (
    <div className="modal__body final-step">
      <div className="gift-stage" aria-hidden="true">
        <span className="gift-stage__spark gift-stage__spark--1">✦</span>
        <span className="gift-stage__spark gift-stage__spark--2">✦</span>
        <span className="gift-stage__spark gift-stage__spark--3">✦</span>
        <span className="gift-stage__ring" />
        <span className="gift-stage__box">🎁</span>
      </div>

      <p className="step-kicker">Ultima tappa</p>
      <h2 className="step-question" id="step-question">
        {t(step.question)}
      </h2>
      {step.helper && <p className="step-helper">{t(step.helper)}</p>}

      {step.image && <StepFigure key={step.image.src} image={step.image} />}

      <button
        type="button"
        className="btn btn--primary btn--wide btn--big final-step__cta"
        onClick={() => {
          playSound('complete', soundOn);
          vibrate([30, 60, 30]);
          onComplete(3);
        }}
      >
        {step.cta}
        <Icon name="sparkles" size={20} />
      </button>

      <p className="final-step__hint">Preparati: tra poco arrivano coriandoli e fuochi d’artificio. 🎆</p>
    </div>
  );
}

function ChoiceStepBody({ step, soundOn, onComplete }: BodyProps & { step: ChoiceStep }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [wrongCount, setWrongCount] = useState(0);
  const [stars, setStars] = useState(3);
  const [done, setDone] = useState(false);

  const isCorrect = selected === step.correctId;

  const selectOption = (optionId: string) => {
    if (answered) return;
    setSelected(optionId);

    if (optionId === step.correctId) {
      const earned = Math.max(1, 3 - wrongCount);
      setStars(earned);
      setAnswered(true);
      playSound('correct', soundOn);
      vibrate(18);
    } else {
      setWrongCount((count) => count + 1);
      setAnswered(true);
      playSound('wrong', soundOn);
      vibrate([36, 50, 36]);
    }
  };

  const retry = () => {
    setSelected(null);
    setAnswered(false);
  };

  const advance = () => {
    if (isCorrect) {
      setDone(true);
      playSound('complete', soundOn);
      vibrate([24, 40, 24]);
    } else {
      retry();
    }
  };

  if (done) {
    return (
      <div className="modal__body step-done">
        <div className="step-done__badge" aria-hidden="true">
          <Icon name="check" size={36} />
        </div>
        <h2 id="step-question">Tappa completata!</h2>
        <CompletionStars stars={stars} />
        <p className="step-done__message">
          {stars === 3
            ? 'Nessun errore: da manuale!'
            : stars === 2
              ? 'Quasi perfetto: una piccola distrazione.'
              : 'L’importante è arrivare in fondo. 💪'}
        </p>
        <button type="button" className="btn btn--primary btn--wide" onClick={() => onComplete(stars)}>
          CONTINUA
          <Icon name="arrow" size={20} />
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="modal__body">
        {step.emoji && (
          <div className="emoji-stage" aria-hidden="true">
            {step.emoji}
          </div>
        )}

        <p className="step-kicker">{t(step.title)}</p>
        <h2 className="step-question" id="step-question">
          {t(step.question)}
        </h2>
        {step.helper && <p className="step-helper">{t(step.helper)}</p>}

        {step.image && <StepFigure key={step.image.src} image={step.image} />}

        <div className="options" role="group" aria-labelledby="step-question">
          {step.options.map((option, optionIndex) => {
            let optionClass = 'option';
            if (answered) {
              if (isCorrect && option.id === step.correctId) {
                optionClass += ' option--correct';
              } else if (!isCorrect && option.id === selected) {
                optionClass += ' option--wrong';
              } else {
                optionClass += ' option--dim';
              }
            }

            return (
              <button
                key={option.id}
                type="button"
                className={optionClass}
                onClick={() => selectOption(option.id)}
                disabled={answered}
                aria-pressed={selected === option.id}
              >
                <span className="option__key" aria-hidden="true">
                  {String.fromCharCode(65 + optionIndex)}
                </span>
                <span className="option__label">{t(option.label)}</span>
                {answered && isCorrect && option.id === step.correctId && (
                  <span className="option__status option__status--ok">
                    <Icon name="check" size={18} />
                  </span>
                )}
                {answered && !isCorrect && option.id === selected && (
                  <span className="option__status option__status--ko">
                    <Icon name="x" size={18} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {answered && (
        <div className={`feedback ${isCorrect ? 'feedback--ok' : 'feedback--ko'}`}>
          <div className="feedback__head">
            <span className="feedback__icon" aria-hidden="true">
              <Icon name={isCorrect ? 'check' : 'x'} size={18} />
            </span>
            <strong>{isCorrect ? 'Esatto!' : 'Non proprio...'}</strong>
          </div>
          <p>
            {t(
              isCorrect
                ? step.correctExplanation
                : (step.wrongExplanation ?? 'Riprova, ce la puoi fare!'),
            )}
          </p>
          <button
            type="button"
            className={`btn btn--wide ${isCorrect ? 'btn--primary' : 'btn--red'}`}
            onClick={advance}
          >
            {isCorrect ? 'CONTINUA' : 'RIPROVA'}
            <Icon name={isCorrect ? 'arrow' : 'reset'} size={20} />
          </button>
        </div>
      )}
    </>
  );
}
