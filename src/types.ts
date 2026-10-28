export type IconName =
  | 'star'
  | 'heart'
  | 'smile'
  | 'sparkles'
  | 'bulb'
  | 'music'
  | 'gift'
  | 'cake'
  | 'lock'
  | 'check'
  | 'x'
  | 'sound'
  | 'mute'
  | 'menu'
  | 'copy'
  | 'reset'
  | 'arrow'
  | 'share'
  | 'trophy';

export interface StepOption {
  id: string;
  label: string;
}

export interface StepImage {
  /** Percorso relativo alla cartella `public/`, es. `images/ricordo.jpg`. Mai con `/` iniziale. */
  src: string;
  /** Testo alternativo obbligatorio, per screen reader e immagini non caricate. */
  alt: string;
  /** Didascalia opzionale mostrata sotto la foto. */
  caption?: string;
  /** `cover` (default) riempie lo spazio; `contain` mostra tutta la foto. */
  fit?: 'cover' | 'contain';
}

interface StepBase {
  id: string;
  title: string;
  icon: IconName;
  /** Immagine opzionale della tappa (foto-ricordo, indizio, ecc.). */
  image?: StepImage;
}

export interface ChoiceStep extends StepBase {
  kind: 'choice';
  question: string;
  helper?: string;
  emoji?: string;
  options: StepOption[];
  correctId: string;
  correctExplanation: string;
  wrongExplanation?: string;
}

export interface FinalStep extends StepBase {
  kind: 'final';
  question: string;
  helper?: string;
  cta: string;
}

export type Step = ChoiceStep | FinalStep;
