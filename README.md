# 🎂 Buon compleanno — percorso in stile Duolingo

Web app per un compleanno: **7 tappe** con mini-quiz in italiano, percorso a serpentina,
stelle, salvataggio dei progressi e gran finale con **coriandoli e fuochi d’artificio**.
Si apre con un **QR code** e vive su **GitHub Pages** (gratis, HTTPS, nessun backend).

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

Requisiti: Node 20+ (testato con Node 25).

## Personalizzazione (5 minuti)

Tutto il contenuto è in due file:

| File | Cosa cambiare |
| --- | --- |
| `src/data/birthday.ts` | Nome, età, data, messaggio finale, firma, nascondiglio del regalo |
| `src/data/steps.ts` | Le 7 domande, opzioni, risposta corretta, spiegazioni |

I punti pensati per essere sostituiti sono marcati con `TODO`. Nei testi puoi usare
`{{name}}`, `{{age}}` e `{{date}}` come segnaposto.

Dopo la modifica:

```bash
npm run build
```

e push su `main`: il deploy parte da solo.

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

Il primo run del workflow abilita Pages da solo (`enablement: true`). Se il repository esiste
già:

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

In alternativa, dalle impostazioni del repo: **Settings → Pages → Source: GitHub Actions**.

## QR code

Quando l’app è online:

```bash
npm run qr -- https://<utente>.github.io/<repo>/ "Giulia"
```

Genera:

- `public/qr.svg` → QR da inserire dove vuoi;
- `public/qr-card.html` → card pronta da stampare (apri nel browser → Stampa).

Anche la card può finire nel deploy (committa `public/qr-card.html` e ripubblica): sarà
raggiungibile su `https://<utente>.github.io/<repo>/qr-card.html`.
Il QR si rigenera solo se cambia l’URL.

## Come funziona

```
Percorso (7 nodi)
   └── tocca la tappa attiva
         └── mini-quiz (scelta multipla / vero-falso / indovinello / emoji)
               ├── risposta giusta → feedback verde → stelle (3/2/1) → tappa successiva
               └── risposta sbagliata → feedback rosso → riprova
   └── ultima tappa → schermata finale + coriandoli + fuochi d’artificio
```

- **Stelle**: 3 senza errori, 2 con un errore, 1 con due o più (massimo 21).
- **Finale**: messaggio personale, età, sorpresa, statistiche, condivisione, rigioca,
  “Rivedi i fuochi” per rilanciare l’effetto.
- **Audio**: effetti sintetizzati con Web Audio, nessun file da caricare; toggle in alto.
- **Accessibilità**: focus visibile, ruoli ARIA, navigazione da tastiera (Esc chiude),
  rispetto di `prefers-reduced-motion`.
- **Mobile-first**: layout a colonna, CTA sticky, safe-area iPhone, vibrazione leggera.

## Struttura

```
src/
  data/            contenuti personalizzabili
  lib/             progressi, link di ripristino, audio, condivisione
  components/      percorso, nodi, modal quiz, finale, coriandoli, fuochi
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
