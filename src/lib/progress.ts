export interface Progress {
  v: 1;
  /** Step completati, in ordine. Lo step corrente è `completed.length`. */
  completed: string[];
  /** Stelle guadagnate per ogni step (1–3). */
  stars: Record<string, number>;
  /** Timestamp dell'ultima modifica, usato per risolvere i conflitti tra dispositivi. */
  updatedAt: number;
}

const STORAGE_KEY = 'happy-birthday:progress:v1';

export function createEmptyProgress(): Progress {
  return { v: 1, completed: [], stars: {}, updatedAt: Date.now() };
}

/** Ripulisce dati provenienti da localStorage o da un link, mantenendo solo un prefisso valido. */
export function normalizeProgress(input: Progress, validIds: string[]): Progress {
  const completed: string[] = [];
  for (const id of validIds) {
    if (!input.completed.includes(id)) break;
    completed.push(id);
  }

  const stars: Record<string, number> = {};
  for (const id of completed) {
    const raw = input.stars[id];
    stars[id] =
      typeof raw === 'number' && Number.isFinite(raw) ? Math.min(3, Math.max(1, Math.round(raw))) : 3;
  }

  return {
    v: 1,
    completed,
    stars,
    updatedAt: Number.isFinite(input.updatedAt) ? input.updatedAt : Date.now(),
  };
}

function isProgressShape(value: unknown): value is Progress {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<Progress>;
  return (
    candidate.v === 1 &&
    Array.isArray(candidate.completed) &&
    candidate.completed.every((id) => typeof id === 'string') &&
    !!candidate.stars &&
    typeof candidate.stars === 'object' &&
    typeof candidate.updatedAt === 'number'
  );
}

export function loadLocalProgress(): Progress | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isProgressShape(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveLocalProgress(progress: Progress): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Safari in private mode or storage full: the app keeps working in memory.
  }
}

/** Serializza i progressi in una stringa compatta e sicura per l'URL. */
export function encodeProgress(progress: Progress): string {
  const payload = JSON.stringify({
    c: progress.completed,
    s: progress.stars,
    t: progress.updatedAt,
  });
  const bytes = new TextEncoder().encode(payload);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return window
    .btoa(binary)
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replace(/=+$/, '');
}

export function decodeProgress(code: string): Progress | null {
  try {
    const base64 = code.replaceAll('-', '+').replaceAll('_', '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const binary = window.atob(padded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const parsed: unknown = JSON.parse(new TextDecoder().decode(bytes));

    if (!parsed || typeof parsed !== 'object') return null;
    const data = parsed as { c?: unknown; s?: unknown; t?: unknown };
    if (!Array.isArray(data.c) || typeof data.t !== 'number') return null;

    const completed = data.c.filter((id): id is string => typeof id === 'string');
    const stars: Record<string, number> = {};
    if (data.s && typeof data.s === 'object') {
      for (const [id, value] of Object.entries(data.s)) {
        if (typeof value === 'number' && Number.isFinite(value)) stars[id] = value;
      }
    }

    return { v: 1, completed, stars, updatedAt: data.t };
  } catch {
    return null;
  }
}

/** Legge i progressi dall'hash `#p=...`, se presente. */
export function readRestoreHash(): Progress | null {
  if (!window.location.hash.startsWith('#p=')) return null;
  return decodeProgress(window.location.hash.slice(3));
}

export function clearRestoreHash(): void {
  if (!window.location.hash) return;
  try {
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
  } catch {
    // Nothing to do: the hash is only a convenience.
  }
}

export function buildRestoreLink(progress: Progress): string {
  const { origin, pathname, search } = window.location;
  return `${origin}${pathname}${search}#p=${encodeProgress(progress)}`;
}
