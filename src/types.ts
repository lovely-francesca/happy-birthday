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

interface StepBase {
  id: string;
  title: string;
  icon: IconName;
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
