const SOUND_KEY = 'happy-birthday:sound';

export function loadSoundPreference(): boolean {
  try {
    return window.localStorage.getItem(SOUND_KEY) !== 'off';
  } catch {
    return true;
  }
}

export function saveSoundPreference(enabled: boolean): void {
  try {
    window.localStorage.setItem(SOUND_KEY, enabled ? 'on' : 'off');
  } catch {
    // Ignore: the toggle still works for this session.
  }
}
