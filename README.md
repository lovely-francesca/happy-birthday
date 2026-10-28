# 🎂 Francesca's Birthday — percorso in stile Duolingo

Web app per un compleanno: **landing «gratta e vinci»** con le nuvole, **7 tappe** con mini-quiz in
italiano, percorso a serpentina, stelle, salvataggio dei progressi e gran finale con
**coriandoli e fuochi d’artificio**. Si apre con un **QR code** e vive su **GitHub Pages**
(gratis, HTTPS, nessun backend).

**Anteprima online:** <https://kimikone21-rgb.github.io/happy-birthday/>
(nome già impostato su Francesca; età e data sono ancora segnaposto)

![stack](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![stack](https://img.shields.io/badge/React-19-087EA4?logo=react&logoColor=white)
![stack](https://img.shields.io/badge/TypeScript-7-3178C6?logo=typescript&logoColor=white)

---

## Avvio rapido

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # build statica in dist/
npm run preview  # anteprima della build
```

Requisiti: Node 22+ (testato con Node 25).

## Personalizzazione (5 minuti)

Tutto il contenuto è in due file:

| File | Cosa cambiare |
| --- | --- |
| `src/data/birthday.ts` | Nome, età, data, messaggio finale, firma, nascondiglio del regalo |
| `src/data/steps.ts` | Le 7 domande, opzioni, risposta corretta, spiegazioni e immagini |

I punti pensati per essere sostituiti sono marcati con `TODO`. Nei testi puoi usare
`{{name}}`, `{{age}}` e `{{date}}` come segnaposto.

> ⚠️ In `src/data/birthday.ts` l’età (`30`) e la data (`12 novembre`) sono ancora segnaposto:
> aggiornale con i dati veri prima di stampare il QR.

Dopo la modifica:

```bash
npm run build
```

e push su `main`: il deploy parte da solo.

## Immagini nelle tappe

Le immagini sono **file statici**: GitHub Pages le serve senza bisogno di servizi esterni.

1. Metti la foto in `public/images/` (es. `public/images/ricordo.jpg`).
2. Aggiungi il campo `image` allo step in `src/data/steps.ts`:

```ts
image: {
  src: 'images/ricordo.jpg',        // relativo a public/, senza `/` iniziale
  alt: 'Noi due al mare, estate 2019', // obbligatorio
  caption: 'Il nostro primo viaggio 💛', // opzionale
  // fit: 'contain',                // usa contain se non vuoi tagliare la foto
},
```

Il campo funziona sia negli step con le opzioni sia nella tappa finale ed è **opzionale**.
Se il file manca, la figura sparisce e lo step resta giocabile.

Regole pratiche per GitHub Pages:

- **Mai** percorsi tipo `/images/foto.jpg`: il sito vive su `/<repo>/`, quindi il percorso
  deve essere relativo (`images/foto.jpg`).
- Nomi **minuscoli** e senza spazi (Pages gira su Linux: `Foto.JPG` ≠ `foto.jpg`).
- Comprimi prima di committare: JPG o WebP, ~200 KB, larghezza ~1100 px. Pages non
  ridimensiona le immagini e non le ottimizza.
- Limiti indicativi di Pages: ~1 GB per sito e 100 MB per singolo file (soft).
- La cache è di ~10 minuti e i nomi non sono hashati: per sostituire una foto, **rinominala**
  (es. `ricordo-2.jpg`) e aggiorna `src`.
- Se il repository è pubblico, anche le immagini sono pubbliche.

> Alternativa più rigorosa: mettere le foto in `src/assets/` e importarle in `steps.ts`.
> Vite le hasha e la build fallisce se il file manca, ma ogni immagine richiede una riga di
> import. Per contenuti modificati a mano, `public/images/` resta la scelta più semplice.

## Salvataggio dei progressi

- **Automatico** in `localStorage` a ogni tappa completata. Chiudendo il browser si riprende
  esattamente da dove si era rimasti.
- **Link di ripristino** dal menu in alto a destra → *Copia link per riprendere*.
  Il link contiene i progressi in un hash (`#p=...`) e funziona su un altro telefono.
  Al caricamento vince il progresso più avanzato (a parità, il più recente).
- Nessun dato lascia il dispositivo. Per una sincronizzazione reale multi-dispositivo si può
  aggiungere Supabase in futuro senza toccare l’interfaccia: l’unico punto da sostituire è
  `src/lib/progress.ts`.

## Pubblicazione su GitHub Pages

Il workflow `.github/workflows/deploy.yml` pubblica automaticamente a ogni push su `main`.

### Prima volta, da terminale

```bash
git init
git add .
git commit -m "Birthday app"
gh repo create happy-birthday --public --source=. --remote=origin --push
```

Il primo run del workflow pubblica su Pages. Se Pages non è ancora attivo, abilitalo una
volta da **Settings → Pages → Source: GitHub Actions** (oppure con
`gh api --method POST repos/<utente>/<repo>/pages -f build_type=workflow`).

Se il repository esiste già:

```bash
git remote add origin https://github.com/<utente>/happy-birthday.git
git push -u origin main
```

Controlla l’esito in **Actions → Deploy to GitHub Pages**. L’URL sarà:

```
https://<utente>.github.io/<repo>/
```

> Il progetto usa `base: './'`, quindi funziona con qualsiasi nome di repository
> senza modifiche.

## QR code

Quando l’app è online:

```bash
npm run qr -- https://<utente>.github.io/<repo>/ "Francesca"
```

Genera:

- `public/qr.svg` → QR da inserire dove vuoi;
- `public/qr-card.html` → card pronta da stampare (apri nel browser → Stampa).

Anche la card può finire nel deploy (committa `public/qr-card.html` e ripubblica): sarà
raggiungibile su `https://<utente>.github.io/<repo>/qr-card.html`.
Il QR si rigenera solo se cambia l’URL.

## Come funziona

```
Landing (cielo + nuvole animate) coperta da un biglietto da grattare
   └── gratta con il dito (o «Rivela subito»)
         └── si svela «Francesca's Birthday» e parte il percorso
               └── Percorso (7 nodi)
                     └── tocca la tappa attiva
                           └── mini-quiz (scelta multipla / vero-falso / indovinello / emoji / foto)
                                 ├── risposta giusta → feedback verde → stelle (3/2/1) → tappa successiva
                                 └── risposta sbagliata → feedback rosso → riprova
                     └── ultima tappa → schermata finale + coriandoli + fuochi d’artificio
```

- **Landing**: nuvole CSS animate, titolo che sbuca dalle nuvole e pellicola da grattare a
  pagina intera. Al ~45% di superficie grattata si passa al percorso; chi non può o non vuole
  grattare usa «Rivela subito». Compare solo se non ci sono ancora progressi salvati.
- **Immagini**: ogni tappa può avere una foto in `public/images/`, con `alt` obbligatorio e
  didascalia opzionale. Se il file manca, la tappa funziona comunque.
- **Palette**: cielo, rosa, giallo e viola; il verde resta solo per le risposte corrette.
- **Stelle**: 3 senza errori, 2 con un errore, 1 con due o più (massimo 21).
- **Finale**: messaggio personale, età, sorpresa, statistiche, condivisione, rigioca,
  “Rivedi i fuochi” per rilanciare l’effetto.
- **Audio**: effetti sintetizzati con Web Audio, nessun file da caricare; toggle in alto.
- **Accessibilità**: focus visibile, ruoli ARIA, navigazione da tastiera (Esc chiude),
  fallback «Rivela subito» per la landing, rispetto di `prefers-reduced-motion`
  (in quel caso niente grattatura: CTA classica).
- **Mobile-first**: layout a colonna, CTA sticky, safe-area iPhone, vibrazione leggera.

## Struttura

```
public/images/     foto delle tappe (file statici, serviti da GitHub Pages)
src/
  data/            contenuti personalizzabili (testi + immagini degli step)
  lib/             progressi, link di ripristino, audio, condivisione, motion
  components/      landing con scratch, percorso, nodi, modal quiz, finale, coriandoli, fuochi
  App.tsx          stato globale e viste
  index.css        design system e animazioni
scripts/qr.mjs     generatore QR + card stampabile
.github/workflows  deploy automatico su GitHub Pages
```

Piano completo e roadmap: [PLAN.md](./PLAN.md).

## Comandi

| Comando | Descrizione |
| --- | --- |
| `npm run dev` | Server di sviluppo |
| `npm run build` | Typecheck + build di produzione |
| `npm run preview` | Anteprima locale della build |
| `npm run typecheck` | Solo controllo TypeScript |
| `npm run qr -- <url> "Nome"` | Genera QR e card stampabile |
