import { useState } from 'react';
import type { StepImage } from '../types';
import { t } from '../lib/text';

interface StepFigureProps {
  image: StepImage;
}

/**
 * Foto opzionale di una tappa.
 * Se il file manca non viene mostrato nulla (niente icona “immagine rotta”):
 * lo step resta giocabile.
 */
export function StepFigure({ image }: StepFigureProps) {
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  return (
    <figure className={`step-figure${image.fit === 'contain' ? ' step-figure--contain' : ''}`}>
      <div className="step-figure__media">
        <img
          src={image.src}
          alt={t(image.alt)}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      </div>
      {image.caption && <figcaption className="step-figure__caption">{t(image.caption)}</figcaption>}
    </figure>
  );
}
