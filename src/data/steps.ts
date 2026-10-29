import type { Step, StepFeedbackImages } from '../types';
import { birthday } from './birthday';

// TODO: immagini segnaposto condivise da tutte le tappe. Per personalizzarle, sostituisci
// il blocco `feedbackImages` dentro ogni step con foto specifiche (src, alt, caption).
const FEEDBACK_IMAGES: StepFeedbackImages = {
  correct: {
    src: 'images/feedback-giusto.svg',
    alt: 'Risposta esatta: cuoricini e stelline',
  },
  wrong: {
    src: 'images/feedback-sbagliato.svg',
    alt: 'Risposta sbagliata: faccina pensierosa',
  },
};

/**
 * ✏️ PERSONALIZZA QUI
 * Ogni step è una tappa del percorso. I commenti `TODO` indicano i contenuti
 * pensati per essere sostituiti con ricordi e dettagli reali.
 * Nei testi puoi usare i segnaposto {{name}}, {{age}} e {{date}}.
 */
export const STEPS: Step[] = [
  {
    kind: 'choice',
    id: 'si-comincia',
    title: 'Si comincia!',
    icon: 'sparkles',
    question: 'Quanti anni compie {{name}} oggi?',
    helper: 'Un riscaldamento facile facile. Dai, che lo sai.',
    emoji: '🎂',
    options: [
      { id: `age-${birthday.age - 1}`, label: `${birthday.age - 1} anni` },
      { id: `age-${birthday.age}`, label: `${birthday.age} anni` },
      { id: `age-${birthday.age + 1}`, label: `${birthday.age + 1} anni` },
      { id: `age-${birthday.age + 2}`, label: `${birthday.age + 2} anni` },
    ],
    correctId: `age-${birthday.age}`,
    correctExplanation: 'Esatto! Oggi {{name}} spegne {{age}} candeline. 🎂',
    wrongExplanation: 'Ops, riprova: il numero giusto è quello che festeggiamo oggi!',
    feedbackImages: FEEDBACK_IMAGES,
  },
  {
    kind: 'choice',
    id: 'indovina-emoji',
    title: 'Indovina l’emoji',
    icon: 'smile',
    question: 'Cosa stanno preparando queste tre emoji?',
    helper: 'Mettile in fila e leggi la risposta.',
    emoji: '🎂🎈🎁',
    options: [
      { id: 'festa', label: 'Una festa di compleanno' },
      { id: 'nuoto', label: 'Una gara di nuoto' },
      { id: 'picnic', label: 'Un picnic in montagna' },
      { id: 'cinema', label: 'Una serata al cinema' },
    ],
    correctId: 'festa',
    correctExplanation: 'Ovvio! Torta, palloncini e regali: il programma di oggi. 🎉',
    wrongExplanation: 'Mmm, non ci siamo. Guarda bene la torta... 🎂',
    feedbackImages: FEEDBACK_IMAGES,
  },
  {
    kind: 'choice',
    id: 'vero-falso',
    title: 'Vero o falso',
    icon: 'check',
    question:
      'Oggi {{name}} ha il permesso ufficiale di non fare assolutamente nulla. Tranne aprire i regali.',
    options: [
      { id: 'vero', label: 'Vero' },
      { id: 'falso', label: 'Falso' },
    ],
    correctId: 'vero',
    correctExplanation: 'Verissimo. Oggi si festeggia e basta. 🎉',
    wrongExplanation: 'Come falso? Oggi è il tuo giorno, hai tutti i permessi!',
    feedbackImages: FEEDBACK_IMAGES,
  },
  {
    // TODO: sostituisci questa domanda con un ricordo vero (dove vi siete conosciuti,
    // un viaggio, un aneddoto...). Cambia anche le opzioni e la risposta corretta.
    kind: 'choice',
    id: 'un-ricordo',
    title: 'Un ricordo',
    icon: 'heart',
    question: 'Dove ci siamo conosciuti?',
    helper: 'Questa la puoi sbagliare solo se ci tieni poco. 😌',
    emoji: '💛',
    // TODO: metti una vostra foto in `public/images/` e aggiorna src, alt e caption.
    // Percorso relativo, senza `/` iniziale (funziona su GitHub Pages).
    image: {
      src: 'images/ricordo-esempio.svg',
      alt: 'Foto d’esempio: sostituiscila con un vostro ricordo',
      caption: 'Un ricordo tutto nostro 💛',
    },
    options: [
      { id: 'mare', label: 'Al mare' },
      { id: 'scuola', label: 'A scuola' },
      { id: 'festa', label: 'A una festa' },
      { id: 'online', label: 'Online' },
    ],
    correctId: 'festa',
    correctExplanation: 'Esatto! E da quella festa non ci siamo più separati. 💛',
    wrongExplanation: 'Non proprio... ma ogni scusa è buona per ricordarlo insieme.',
    feedbackImages: FEEDBACK_IMAGES,
  },
  {
    kind: 'choice',
    id: 'indovinello',
    title: 'Indovinello',
    icon: 'bulb',
    question: 'Più ne togli, più grande diventa. Cos’è?',
    helper: 'Pensaci un attimo, non guardare la torta.',
    emoji: '🕳️',
    options: [
      { id: 'buco', label: 'Un buco' },
      { id: 'candela', label: 'Una candela' },
      { id: 'torta', label: 'Una torta' },
      { id: 'palloncino', label: 'Un palloncino' },
    ],
    correctId: 'buco',
    correctExplanation: 'Brava! Più terra togli, più il buco diventa grande. 🕳️',
    wrongExplanation: 'Quasi! Ma se togli una candela, la torta non diventa più grande...',
    feedbackImages: FEEDBACK_IMAGES,
  },
  {
    kind: 'choice',
    id: 'festa-perfetta',
    title: 'La festa perfetta',
    icon: 'music',
    question: 'Cosa non può assolutamente mancare in una festa riuscita?',
    helper: 'Una sola risposta è quella giusta. Le altre sono un incubo.',
    emoji: '🎵🕺🎁',
    options: [
      { id: 'torta', label: 'La torta' },
      { id: 'sveglia', label: 'La sveglia alle 6:00' },
      { id: 'compiti', label: 'I compiti delle vacanze' },
      { id: 'lunedi', label: 'Il lunedì mattina' },
    ],
    correctId: 'torta',
    correctExplanation: 'Certo: la torta! E possibilmente anche una seconda fetta. 🍰',
    wrongExplanation: 'Davvero? Nessuna festa è mai iniziata con la sveglia alle 6:00.',
    feedbackImages: FEEDBACK_IMAGES,
  },
  {
    kind: 'final',
    id: 'la-sorpresa',
    title: 'La sorpresa',
    icon: 'gift',
    question: 'Ultima tappa: il regalo ti sta aspettando.',
    helper: 'Non è qui dentro, ma quasi. Premi cinque volte sul pacco e scopri dove si nasconde.',
  },
];

export const STEP_IDS = STEPS.map((step) => step.id);
