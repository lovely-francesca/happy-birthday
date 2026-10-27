export type SoundName = 'tap' | 'correct' | 'wrong' | 'complete';

let audioContext: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioContextClass =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return null;
  audioContext ??= new AudioContextClass();
  if (audioContext.state === 'suspended') void audioContext.resume();
  return audioContext;
}

function note(
  context: AudioContext,
  frequency: number,
  at: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume = 0.05,
): void {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, at);
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(volume, at + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start(at);
  oscillator.stop(at + duration + 0.03);
}

/** Piccoli effetti sintetici: nessun file audio da scaricare. */
export function playSound(name: SoundName, enabled: boolean): void {
  if (!enabled) return;
  const context = getContext();
  if (!context) return;
  const now = context.currentTime + 0.01;

  switch (name) {
    case 'tap':
      note(context, 520, now, 0.07, 'sine', 0.025);
      break;
    case 'correct':
      note(context, 660, now, 0.14, 'sine', 0.05);
      note(context, 990, now + 0.09, 0.2, 'sine', 0.04);
      break;
    case 'wrong':
      note(context, 220, now, 0.16, 'sawtooth', 0.035);
      note(context, 165, now + 0.11, 0.22, 'sawtooth', 0.03);
      break;
    case 'complete':
      [523.25, 659.25, 783.99, 1046.5].forEach((frequency, index) => {
        note(context, frequency, now + index * 0.11, 0.24, 'triangle', 0.045);
      });
      note(context, 1318.51, now + 0.48, 0.35, 'triangle', 0.035);
      break;
  }
}

export function vibrate(pattern: number | number[]): void {
  try {
    navigator.vibrate?.(pattern);
  } catch {
    // Vibration is a nice-to-have.
  }
}
