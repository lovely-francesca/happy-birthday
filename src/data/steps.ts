import type { Step, StepImage } from '../types';

// La foto della risposta sbagliata è condivisa da tutte le tappe.
const WRONG_FEEDBACK: StepImage = {
  src: 'images/risposta-sbagliata.jpg',
  alt: 'Risposta sbagliata: primo piano di Francesca con gli occhiali',
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
      { id: 'age-27', label: '27 anni' },
      { id: 'age-28', label: '28 anni' },
      { id: 'age-29', label: '29 anni' },
      { id: 'age-30', label: '30 anni' },
    ],
    correctId: 'age-28',
    correctExplanation: 'Esatto! Oggi {{name}} spegne 28 candeline. 🎂',
    wrongExplanation: 'Ops, riprova: il numero giusto è quello che festeggiamo oggi!',
   feedbackImages: {
      correct: {
        src: 'images/disneyland.jpg',
        alt: 'Francesca per strada con una pangocciola gigante in mano',
      },
      wrong: WRONG_FEEDBACK,
    },
  },
  {
    kind: 'choice',
    id: 'cosa-ama-francesca',
    title: "Cosa ama Francesca",
    icon: 'smile',
    question: 'Cosa ama Francesca più di Raffaele',
    helper: "Non serve l'aiuto!",
    emoji: '',
    options: [
      { id: 'cioccolata', label: 'La cioccolata' },
      { id: 'pangocciolo', label: 'Un pangocciole (Francese)' },
      { id: 'picnic', label: 'Un picnic in montagna' },
      { id: 'cinema', label: 'Una serata al cinema' },
    ],
    correctId: 'pangocciolo',
    correctExplanation: 'Purtroppo, si! Un pangocciole, è molto più morbido e gustoso di me.',
    wrongExplanation: 'Mmm, non ci siamo.',
    feedbackImages: {
      correct: {
        src: 'images/francesca-pangocciole.jpg',
        alt: 'Francesca per strada con una pangocciola gigante in mano',
      },
      wrong: WRONG_FEEDBACK,
    },
  },
  {
    kind: 'choice',
    id: 'starter-pack-inverno',
    title: 'Starter pack invernale',
    icon: 'smile',
    question: 'Inverno: cosa non può mancare nello starter pack di Francesca?',
    helper: 'Indizio: se lo spegni a metà serata, ti accorgi subito che non è più la stessa persona. 🥶',
    emoji: '❄️',
    options: [
      { id: 'ventilatore', label: 'Un ventilatore' },
      { id: 'scaldaletto', label: 'Lo scaldaletto' },
      { id: 'costume', label: 'Un costume da bagno' },
      { id: 'ghiaccio', label: 'Una borraccia di ghiaccio' },
    ],
    correctId: 'scaldaletto',
    correctExplanation:
      'Esatto! Da novembre a marzo il letto va preriscaldato, altrimenti non si entra. 🔥',
    wrongExplanation:
      'Brr, gelida come le tue risposte! Pensa a cosa serve per sopravvivere alle notti d’inverno.',
    feedbackImages: {
      correct: {
        src: 'images/scaldaletto.jpg',
        alt: 'Francesca per strada con una pangocciola gigante in mano',
      },
      wrong: WRONG_FEEDBACK,
    },
  },
  {
    kind: 'choice',
    id: 'sbrillozzo',
    title: 'Il sogno nel cassetto',
    icon: 'gift',
    question: 'Cosa sogna Francesca di avere al dito?',
    helper: 'Brilla, luccica, e lei lo ha puntato da un po’. ✨',
    emoji: '💍',
    options: [
      { id: 'guanto', label: 'Un guanto da forno' },
      { id: 'cerotto', label: 'Un cerotto con i unicorni' },
      { id: 'sbrillozzo', label: 'Uno sbrillozzo (anello)' },
      { id: 'elastico', label: 'Un elastico per capelli' },
    ],
    correctId: 'sbrillozzo',
    correctExplanation:
      'Esatto! Lo sbrillozzo: piccolo, luccicante e irresistibile. Chissà, magari prima o poi... 💍✨',
    wrongExplanation:
      'Fuochino, ma niente che brilli abbastanza! Pensa a qualcosa che luccica e sta al dito. ✨',
    feedbackImages: {
      correct: {
        src: 'images/sbrillozzo.jpg',
        alt: 'Francesca per strada con una mano e uno spritz',
      },
      wrong: WRONG_FEEDBACK,
    },
  },
  {
    kind: 'choice',
    id: 'diva',
    title: 'La diva del...',
    icon: 'music',
    question: 'Quando Francesca canta a squarciagola, a chi somiglia davvero?',
    helper: 'Rispondi con il cuore. E con le orecchie tappate. 🎤',
    emoji: '🎤',
    options: [
      { id: 'oca', label: "Un'oca col raffreddore" },
      { id: 'whitney', label: 'Whitney Houston (almeno nella sua testa)' },
      { id: 'sirena', label: 'La sirena dei pompieri' },
      { id: 'gabbiano', label: 'Un gabbiano che ha perso la cena' },
    ],
    correctId: 'whitney',
    correctExplanation:
      'Esatto! Nella sua testa riempie gli stadi. Nella realtà, i vicini chiedono la pace. 🎶',
    wrongExplanation:
      'Eh no, un po’ di rispetto per la diva! Nella sua testa è Whitney in persona. 🎤',
    feedbackImages: {
      correct: {
        src: 'images/diva-cantante.jpg',
        alt: 'Francesca che canta con un microfono in mano',
      },
      wrong: WRONG_FEEDBACK,
    },
  },
  {
    kind: 'choice',
    id: 'massaggio',
    title: 'Il massaggio',
    icon: 'heart',
    question: 'Mani, testa e... cosa chiede in continuo di farsi massaggiare?',
    helper: 'Ultimamente le ho dato un tempo di ammortamento. 😅',
    emoji: '💆‍♀️',
    options: [
      { id: 'gomiti', label: 'I gomiti' },
      { id: 'piedi', label: 'I piedi' },
      { id: 'orecchie', label: 'Le orecchie' },
      { id: 'ginocchia', label: 'Le ginocchia' },
    ],
    correctId: 'piedi',
    correctExplanation:
      'Esatto! I piedi, sempre i piedi. Il massaggiatore ufficiale non va mai in ferie. 🦶',
    wrongExplanation:
      'Eh no, quella parte la lascia stare! Pensa a quella che chiede di continuo. 🦶',
    feedbackImages: {
      correct: {
        src: 'images/piedini.jpg',
        alt: 'Francesca che si fa massaggiare i piedi',
      },
      wrong: WRONG_FEEDBACK,
    },
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
