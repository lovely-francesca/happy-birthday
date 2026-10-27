# Piano — «Buon compleanno» (web app in stile Duolingo)

> Percorso a tappe per la festeggiata: 7 step con mini-quiz, salvataggio dei progressi,
> QR code per aprire l'app e gran finale con coriandoli e fuochi d'artificio.

---

## 1. Esperienza

1. La festeggiata inquadra un **QR code** (stampato o condiviso) e apre l'app sul telefono.
2. La **landing page** mostra un cielo animato con nuvole in movimento: il titolo
   **«Francesca's Birthday»** emerge dalle nuvole e, dopo 3 secondi, appare il pulsante
   **«Iniziamo il viaggio»**.
3. Al tocco del pulsante si apre il **percorso verticale** in stile Duolingo: tappe sbloccate
   in sequenza, tappe completate con stelline, tappe future bloccate.
4. Tocca la tappa attiva → si apre un **mini-quiz** (risposta multipla, vero/falso, indovinello, rebus di emoji).
5. Ogni risposta corretta fa avanzare; una risposta sbagliata invita a riprovare (e riduce le stelle).
6. Alla fine del settimo step: **schermata finale** con messaggio, sorpresa, coriandoli e fuochi d'artificio.
7. Se chiude il browser, al rientro riprende esattamente da dove era. Su un altro telefono può
   riprendere tramite **link di ripristino**.

### Dettagli che vendono l'effetto «Duolingo»

- Palette cielo/rosa/giallo/viola (il verde resta solo per le risposte corrette), fonti
  arrotondate, bottoni con ombra 3D e feedback alla pressione.
- Landing con nuvole CSS animate, titolo che sbuca dalle nuvole e CTA ritardata di 3 secondi.
- Percorso a serpentina con linea tratteggiata che si colora man mano.
- Nodi con icona, lucchetto, pulsazione sulla tappa corrente, stelline guadagnate.
- Mascotte personalizzata (cupcake) con fumetto che cambia in base al progresso.
- Suoni brevi (Web Audio, nessun file audio), vibrazione su mobile, toggle audio.
- Barra di avanzamento, contatore stelle, feedback verde/rosso con spiegazione.
- Animazioni rispettose di `prefers-reduced-motion`.

---

## 2. Stack scelto

| Ambito | Scelta | Perché |
| --- | --- | --- |
| Build | **Vite 8 + React 19 + TypeScript** | Velocissimo da sviluppare e deployare, zero backend |
| Stile | **CSS custom** (design system Duolingo-like) | Controllo totale su forme, ombre 3D e animazioni; nessuna dipendenza extra |
| Stato | **localStorage + link di ripristino** | Funziona offline, zero costi, nessun account |
| Hosting | **GitHub Pages** via GitHub Actions | Gratis, HTTPS, URL stabile per il QR |
| QR | script Node (`qrcode`) che genera SVG + card stampabile | Si rigenera in 2 secondi quando cambia l'URL |
| Backend futuro | **Supabase** (opzionale) | Solo se servirà sincronizzazione reale multi-dispositivo |

Nessun router: è una single page con tre viste (`landing`, `percorso`, `finale`) e un modal per gli step.
`base: './'` in Vite rende i path relativi, così l'app funziona su qualunque repo GitHub Pages
senza configurare il nome del repository.

---

## 3. Architettura

```
src/
  data/
    birthday.ts        # nome, età, data, messaggio finale, nascondiglio regalo
    steps.ts           # i 7 step (testi, opzioni, risposta corretta, spiegazione)
  lib/
    progress.ts        # load/save localStorage, encode/decode link di ripristino, reset
    sound.ts           # feedback audio sintetico (Web Audio)
    text.ts            # interpolazione {{name}} / {{age}} / {{date}}
    share.ts           # copia link, Web Share API con fallback
  components/
    LandingScreen.tsx  # cielo animato, nuvole, titolo e CTA dopo 3 secondi
    Header.tsx         # brand, stelle, audio, menu, barra progresso
    PathScreen.tsx     # percorso SVG + nodi + mascotte + CTA
    PathNode.tsx       # stato completed / current / locked
    StepModal.tsx      # quiz, feedback, retry, schermata stelle
    CompletionStars.tsx
    FinalScreen.tsx    # messaggio, regalo, statistiche, azioni
    Confetti.tsx       # coriandoli CSS
    Fireworks.tsx      # fuochi d'artificio su <canvas>
    Mascot.tsx         # cupcake SVG animato
    Icon.tsx           # set icone SVG
    Toast.tsx
    ConfirmDialog.tsx
  App.tsx              # stato globale, routing tra viste, persistenza
  index.css            # design system + animazioni
  main.tsx
```

### Modello dati progressi

```ts
interface Progress {
  v: 1;
  completed: string[];             // id degli step completati, in ordine
  stars: Record<string, number>;   // 1..3 stelle per step
  updatedAt: number;               // per risolvere i conflitti tra dispositivi
}
```

- Lo step corrente è semplicemente `completed.length`.
- Salvataggio automatico a ogni modifica (`localStorage`, chiave versionata).
- **Link di ripristino**: `#p=<base64url>` con progressi + timestamp. Al caricamento vince il
  progresso più avanzato (a parità di tappe, quello con `updatedAt` più recente); l'hash viene
  poi rimosso per non “riavvolgere” la storia.
- Stelle: 3 senza errori, 2 con un errore, 1 con due o più. Massimo 21.

### Stati del quiz

`question` → scelta → `feedback` (giusto: verde; sbagliato: rosso + riprova) → `stars` → chiusura.
Lo step finale è speciale: pulsante «Apri il regalo» → schermata finale.

---

## 4. Schermata finale

- Coriandoli CSS a caduta + **fuochi d'artificio su canvas** (razzi, esplosioni, gravità, scie).
- Mascotte grande, «Buon compleanno, {nome}!», età, messaggio personale e firma.
- Card «La tua sorpresa» con il nascondiglio del regalo.
- Statistiche: 7/7 tappe, stelle totali.
- Azioni: condividi, rigioca (con conferma), rivedi il percorso.
- Performance: canvas con `devicePixelRatio`, cleanup di `requestAnimationFrame` allo smontaggio,
  animazioni disattivate con `prefers-reduced-motion`.

---

## 5. Deploy e QR

1. `npm run build` → cartella `dist/` statica.
2. Workflow `.github/workflows/deploy.yml` pubblica su GitHub Pages a ogni push su `main`.
3. `npm run qr -- https://<utente>.github.io/<repo>/` genera `public/qr.svg` + `public/qr-card.html`
   pronti da stampare (la card è raggiungibile anche online).
4. Si stampa la card o si condivide il QR; l'app non richiede installazione.

Anteprima live: <https://kimikone21-rgb.github.io/happy-birthday/> · card QR:
<https://kimikone21-rgb.github.io/happy-birthday/qr-card.html>

---

## 6. Personalizzazione (5 minuti)

Tutto il contenuto sta in due file:

- `src/data/birthday.ts` → nome, età, data, messaggio, firma, nascondiglio del regalo.
- `src/data/steps.ts` → domande, opzioni, risposte corrette e spiegazioni (i punti da cambiare
  sono marcati con `TODO`).

Dopo la modifica: commit → deploy automatico → rigenerare il QR solo se cambia l'URL.

---

## 7. Roadmap

| Fase | Contenuto | Stato |
| --- | --- | --- |
| 1 | Piano, scaffold Vite/React/TS, deploy workflow | ✅ |
| 2 | Percorso, nodi, quiz, salvataggio, ripristino | ✅ |
| 3 | Schermata finale, coriandoli + fuochi d'artificio | ✅ |
| 4 | Personalizzazione testi (placeholder → reali) | da fare con i dati veri |
| 5 | Deploy GitHub Pages + QR + prova su telefono | ✅ anteprima online + QR pronti |
| 6 | Palette colorata + landing animata con nuvole | ✅ |

### Criteri di accettazione

- [x] 7 step in italiano, sbloccati in sequenza, con feedback e retry.
- [x] Landing con nuvole animate, titolo «Francesca's Birthday» e CTA dopo 3 secondi.
- [x] Palette colorata (cielo, rosa, giallo, viola) con verde semantico per le risposte corrette.
- [x] Progressi e stelle persistono dopo refresh e chiusura del browser.
- [x] Link di ripristino funzionante su un altro dispositivo.
- [x] Finale con coriandoli e fuochi d'artificio, accessibile e performante.
- [x] Layout mobile-first, usabile con una mano, installabile come sito.
- [x] Deploy automatico su GitHub Pages, asset relativi.
- [ ] Contenuti reali e QR stampato.
