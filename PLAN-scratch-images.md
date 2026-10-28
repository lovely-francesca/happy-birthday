# Piano — Landing «gratta e vinci» + immagini negli step

Due feature indipendenti, eseguibili in due fasi separate (prima le immagini, poi lo scratch:
meno rischio). Nessun backend, nessun servizio esterno, compatibile GitHub Pages.

---

## Risposta rapida: immagini su GitHub Pages

**Sì, sono supportate.** Tutto ciò che finisce in `public/` viene copiato in `dist/` e servito
come file statico da Pages. Basta mettere i file in `public/images/` e referenziarli con un
percorso **relativo** (`images/ricordo.jpg`). Limiti e accortezze:

| Tema | Nota |
| --- | --- |
| Percorso | **Mai** `/images/...`: il sito vive su `/<repo>/`, un path assoluto darebbe 404. |
| Case | Pages è Linux: `Ricordo.JPG` ≠ `ricordo.jpg`. Sempre minuscolo. |
| Peso | ~200 KB per foto, larghezza ~1100 px, JPG o WebP. Pages **non** ridimensiona né ottimizza. |
| Limiti | ~1 GB per sito, 100 MB per file (limiti soft), 10 build/ora. |
| Cache | ~10 min, filename non hashato: per sostituire una foto, **rinominale** il file. |
| Privacy | Tutto è pubblico se il repo è pubblico: niente foto che non vuoi online. |

Alternativa più «robusta» ma meno comoda per contenuti: `src/assets/` + `import foto from ...`
(validazione a build + hash del filename), ma obbliga a modificare gli import in `steps.ts`.
Per questo progetto conviene `public/images/`.

---

## Feature 1 — Landing «gratta e vinci» a pagina intera

### Comportamento

1. La landing attuale (cielo, nuvole, titolo, sottotitolo) resta **sotto** un canvas che copre
   tutta la pagina (dentro `.app-shell`, 100dvh).
2. Il canvas è una «pellicola» colorata con la scritta *«Gratta per scoprire»*.
3. Dito/mouse grattano via la pellicola (`destination-out`) rivelando il contenuto sottostante.
4. Quando è grattato **~45%** della superficie: la pellicola sfuma (≈450 ms) e dopo ≈900 ms
   l'app passa automaticamente al percorso (`onStart`). Avviene **una sola volta**.
5. Fallback accessibile: pulsante reale **«Rivela subito»** sempre visibile sopra il canvas
   (44 px, safe-area) che svela e avvia subito. Unico elemento raggiungibile da tastiera.
6. Con `prefers-reduced-motion: reduce`: **niente canvas**, si mostra direttamente la CTA
   esistente «Iniziamo il viaggio» (nessun auto-advance). Se l'utente cambia l'impostazione a
   runtime, il canvas smonta e compare la CTA.
7. Suoni: `tap` leggero al primo grattare, `complete` alla soglia; vibrazione alla soglia.
   `soundOn` va passato da `App` a `LandingScreen` (oggi è usato solo dal modal).

> Nota: la landing compare solo con progressi a zero, quindi non c'è conflitto con il
> ripristino (`#p=...`) né con il reset (che porta al percorso, non alla landing).

### Nuovi file

- `src/lib/motion.ts` — `usePrefersReducedMotion()`: `matchMedia('(prefers-reduced-motion: reduce)')`
  con listener `change`, valore iniziale letto in lazy init.
- `src/components/ScratchCover.tsx` — solo il canvas + logica di grattatura.

```tsx
interface ScratchCoverProps {
  revealed: boolean;                 // avvia la dissolvenza
  onComplete: () => void;            // soglia raggiunta (idempotente lato LandingScreen)
  onFirstScratch?: () => void;       // suono/haptic leggero
}
```

### `LandingScreen.tsx` (modifica)

- Rimuove `showCta` + timer di 3 s.
- Stato: `revealed`, `startedRef`, `timerRef`; `finish()` con guardia `startedRef`,
  `setRevealed(true)` → `playSound('complete')` → `setTimeout(onStart, 900)`.
- Cleanup del timer allo smontaggio (evita `setView` su componente smontato).
- Render: `{!reduced && <ScratchCover ... />}`, pulsante skip sopra il canvas (z-index),
  CTA originale solo nel ramo `reduced`, testo istruzioni `sr-only`.
- Il canvas ha `aria-hidden="true"`; l'istruzione per screen reader sta nel testo sr-only e
  nel `aria-label` del pulsante.

### `App.tsx` (modifica)

- `<LandingScreen soundOn={soundOn} onStart={startJourney} />`.
- `startJourney` resta com'è (tap + `setView('path')`); il suono di completamento è separato.

### Logica canvas (`ScratchCover.tsx`)

Punti chiave:

- **Setup una volta** in `useLayoutEffect` (prima del paint, niente flash del contenuto):
  `canvas.width/height = rect * dpr` con `dpr = min(devicePixelRatio, 2)`.
  `ctx.getContext('2d')`; nessuna transform, si disegna in pixel device.
- **Pellicola**: gradiente verticale cielo→rosa + cerchi nuvola + scintille + testo centrale
  (`800 28px 'Baloo 2', Nunito`). Ripaint una volta a `document.fonts.ready` **solo se non è
  ancora stato grattato**, per evitare testo con font di fallback.
- **Resize**: se non si ha ancora grattato, ridisegna la pellicola alla nuova dimensione;
  se si è già grattato, lascia il bitmap e lascialo scalare via CSS (evita reset quando la
  barra URL mobile collassa). Le coordinate puntatore si mappano sempre con
  `canvas.width / rect.width`, quindi il disegno resta corretto anche dopo un resize.
- **Grattatura**: `pointerdown` → `setPointerCapture`, un solo `pointerId` attivo (ignora il
  secondo dito); `pointermove` → linea `lineWidth = 26 * 2 * scale`, `lineCap/lineJoin: round`,
  `globalCompositeOperation = 'destination-out'`; tap singolo → `arc + fill`.
  `pointerup`/`pointercancel`/`lostpointercapture` chiudono il tratto.
- **Soglia**: canvas offscreen 64×64, ogni ~220 ms (e su `pointerup`) → `drawImage(canvas, 0,0,64,64)`,
  `getImageData`, conta alpha < 40. `ratio >= 0.45` → `onComplete()` una sola volta
  (`doneRef`), stop interval.
- **Cleanup**: `clearInterval`, `ResizeObserver.disconnect`, rimozione listener, flag.
- Callback tenute in ref aggiornate a ogni render per non ri-eseguire l'effetto di setup.
- `getContext` sul canvas di campionamento con `{ willReadFrequently: true }`.

### CSS da aggiungere (`src/index.css`, blocco landing)

```css
.landing__scratch { position:absolute; inset:0; z-index:6; width:100%; height:100%;
  touch-action:none; cursor:crosshair; opacity:1; transition:opacity .45s ease; }
.landing__scratch.is-revealed { opacity:0; pointer-events:none; }
.scratch-skip { position:absolute; z-index:7; left:50%; transform:translateX(-50%);
  bottom:calc(18px + env(safe-area-inset-bottom)); min-height:44px; padding:10px 18px; }
.sr-only { position:absolute; width:1px; height:1px; overflow:hidden; clip-path:inset(50%); }
```

Plus: `.landing { overscroll-behavior: none; }`, `.landing__cta-wrap` visibile nel ramo
reduced-motion, piccolo `@keyframes` di pulsazione per il pulsante skip. Il canvas deve stare
sopra `.landing__cloudbank` (z 3) e sotto il pulsante skip (z 7).

### Mobile / a11y / performance

- `touch-action: none` sul canvas evita scroll, pull-to-refresh e selezione; il landing è già
  alto 100dvh.
- `pointercancel` gestito (gesture di sistema dal bordo).
- DPR capped a 2 → memoria contenuta; niente `requestAnimationFrame` continuo, solo eventi.
- `prefers-reduced-motion`: nessun canvas, CTA subito visibile, nessun auto-advance.
- Tastiera: Tab → «Rivela subito», Enter → reveal + start.
- `aria-hidden` sul canvas; hint testuale nel canvas non è letto (bene), istruzioni in sr-only.
- Auto-advance a 900 ms: abbastanza per leggere il titolo, non troppo per sembrare bloccato.

---

## Feature 2 — Immagini negli step

### Modello dati (`src/types.ts`)

```ts
export interface StepImage {
  src: string;                       // 'images/ricordo.jpg' (relativo a public/)
  alt: string;                       // obbligatorio
  caption?: string;                  // didascalia opzionale
  fit?: 'cover' | 'contain';         // default 'cover'; 'contain' per non tagliare i volti
}

interface StepBase {
  id: string; title: string; icon: IconName;
  image?: StepImage;                 // vale sia per ChoiceStep sia per FinalStep
}
```

- `alt` obbligatorio (TypeScript lo impone); supporta `{{name}}` ecc. via `t()`.
- Una sola immagine per step: il caso reale è la foto-ricordo. Se in futuro servirà una
  galleria, il campo diventa `images?: StepImage[]` senza rompere i dati esistenti.

### Rendering

- Nuovo `src/components/StepFigure.tsx`:

```tsx
export function StepFigure({ image }: { image: StepImage }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null; // 404/foto mancante: nessuna icona rotta, lo step resta usabile
  return (
    <figure className={`step-figure${image.fit === 'contain' ? ' step-figure--contain' : ''}`}>
      <div className="step-figure__media">
        <img src={image.src} alt={t(image.alt)} loading="lazy" decoding="async"
             onError={() => setFailed(true)} />
      </div>
      {image.caption && <figcaption className="step-figure__caption">{t(image.caption)}</figcaption>}
    </figure>
  );
}
```

- In `StepModal.tsx`: inserire `<StepFigure key={step.image.src} image={step.image} />` dopo
  `step.helper`, sia in `ChoiceStepBody` sia in `FinalStepBody`. Il `.modal__body` già scrolla.
- Il key resetta lo stato `failed` quando cambia immagine.

### CSS (`src/index.css`, dopo `.step-helper`)

```css
.step-figure { margin:0 0 14px; }
.step-figure__media { position:relative; overflow:hidden; border-radius:14px;
  background:#f3edfb; border:2px solid #eee7f7; aspect-ratio:4/3; max-height:280px; }
.step-figure__media img { position:absolute; inset:0; width:100%; height:100%;
  object-fit:cover; display:block; }
.step-figure--contain .step-figure__media img { object-fit:contain; }
.step-figure__caption { margin-top:6px; color:var(--muted); font-size:12px;
  font-weight:700; line-height:1.35; text-align:center; }
```

`aspect-ratio` + `max-height` riservano lo spazio → nessun layout shift quando l'immagine
carica. Su schermi bassi il modal scrolla (già `overflow-y:auto`).

### Asset e dati

- Creare `public/images/ricordo-esempio.svg`: segnaposto grafico (1200×900, palette del sito,
  scritta «La vostra foto qui» + istruzioni). Nessun binario nel repo.
- In `src/data/steps.ts`, step `un-ricordo`: aggiungere

```ts
image: {
  src: 'images/ricordo-esempio.svg',
  alt: 'Foto d’esempio: sostituiscila con un vostro ricordo',
  caption: 'Un ricordo tutto nostro 💛',
  // fit: 'contain',
},
```

  con commento `TODO: sostituisci il file in public/images/ e aggiorna src/alt/caption`.
- Gli altri step restano senza `image` → nessuna regressione.

### Documentazione (`README.md`)

Nuova sezione **«Immagini nelle tappe»** con:
- dove mettere i file (`public/images/`), snippet `image: { src: 'images/…', alt: '…' }`;
- regola path relativo (niente `/`), filename minuscoli, peso/larghezza consigliati;
- conferma che GitHub Pages serve le immagini statiche, senza servizi esterni;
- cache: rinominare il file per aggiornare la foto;
- nota che `alt` è obbligatorio e `caption` opzionale.

Aggiornare anche «Come funziona» (landing con scratch, niente CTA a 3 s) e la sezione
Accessibilità (fallback «Rivela subito», ramo reduced-motion). In `PLAN.md` basta aggiornare
la riga della landing in architettura + step 2 dell'esperienza.

---

## Ordine di implementazione

| # | Passo | File |
| --- | --- | --- |
| 1 | Tipi immagine + campo in `StepBase` | `src/types.ts` |
| 2 | Componente figura + CSS + segnaposto | `src/components/StepFigure.tsx`, `src/index.css`, `public/images/ricordo-esempio.svg` |
| 3 | Uso nel modal (choice + final) e dato d'esempio | `src/components/StepModal.tsx`, `src/data/steps.ts` |
| 4 | Hook reduced motion | `src/lib/motion.ts` |
| 5 | Canvas scratch | `src/components/ScratchCover.tsx` |
| 6 | Landing rifatta + prop `soundOn` | `src/components/LandingScreen.tsx`, `src/App.tsx` |
| 7 | CSS scratch + CTA reduced-motion | `src/index.css` |
| 8 | Docs | `README.md`, `PLAN.md` |
| 9 | Screenshot/QA (opzionale, `.screens/`) | — |

Dopo ogni fase il progetto deve compilare (`npm run typecheck`).

---

## Verifica end-to-end

**Build e regressioni**
- `npm run typecheck` e `npm run build` puliti (attenzione a `noUnusedLocals`).
- `npm run preview`: app raggiungibile, asset in `dist/images/…`.
- Link `#p=...` → entra diretto nel percorso (la landing/canvas non monta).
- Reset progressi, toast, modal, `Esc`, finale/coriandoli/fuochi invariati.

**Scratch — desktop**
- La pellicola copre tutto (titolo compreso); nessun flash del contenuto al primo paint.
- Drag veloce senza buchi; il tratto continua se il cursore esce e rientra (pointer capture).
- ~45% → dissolvenza + passaggio al percorso **una sola volta**; nessun doppio suono.
- «Rivela subito» funziona prima/durante/dopo; doppio click non avvia due volte.
- Resize prima di grattare → pellicola ridisegnata; resize dopo → tratti conservati.
- DevTools paint flashing: nessun repaint continuo da fermo.

**Scratch — mobile**
- Test su iOS Safari/Android reali: non scrolla, non fa pull-to-refresh, non seleziona testo.
- Rotazione e collasso barra URL non resettano i progressi di grattatura.
- Secondo dito ignorato; `pointercancel` non lascia il tratto appeso.

**Scratch — accessibilità**
- Tab raggiunge solo «Rivela subito»; Enter svela e avvia.
- VoiceOver/TalkBack legge istruzione + pulsante, non il canvas.
- Emulazione `prefers-reduced-motion: reduce` → CTA subito, nessun canvas/auto-advance.
- Toggle a runtime → ramo corretto, nessun canvas «bloccato».

**Immagini**
- Lo step «Un ricordo» mostra segnaposto, caption e alt corretto.
- Rinominando/rimuovendo il file → figura sparisce, nessuna icona rotta, step ancora risolvibile.
- Viewport 375×667 e landscape: immagine + 4 opzioni + feedback scrollano nel modal, barra
  feedback resta in basso.
- Build su path di repo (deploy Pages o `base: '/happy-birthday/'` temporaneo): `images/...`
  relativo funziona; un path con `/` iniziale no (test di regressione).
- Slow 3G: spazio riservato, nessun salto di layout.

---

## Rischi e mitigazioni

| Rischio | Mitigazione |
| --- | --- |
| Canvas non inizializzato prima del paint → flash del titolo | `useLayoutEffect` + pellicola disegnata subito; CTA nascosta via CSS |
| Font Baloo non pronto sul canvas | Ripaint a `document.fonts.ready` se non ancora grattato |
| Resize mobile azzera la grattatura | Ripaint solo se pristine; altrimenti bitmap scalato via CSS |
| Soglia raggiunta col dito ancora giù | Guardia `doneRef`/`startedRef`, stop interval, fade e cleanup |
| Doppio avvio (skip + canvas) | `startedRef` condiviso in `LandingScreen` |
| Immagini pesanti/lente | `lazy` + `decoding=async`, spazio riservato con `aspect-ratio`, linee guida peso |
| 404 immagine | `onError` → `null`, nessuna icona rotta |
| Cache Pages sulla foto sostituita | Rinominare il file e aggiornare `src` |
