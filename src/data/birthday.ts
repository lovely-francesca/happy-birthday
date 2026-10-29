/**
 * ✏️ PERSONALIZZA QUI
 * Questi sono i dati della festeggiata.
 * ⚠️ `age` e `dateLabel` sono ancora segnaposto: sostituiscili con età e data vere.
 */
export const birthday = {
  name: 'Francesca',
  age: 30,
  dateLabel: '12 novembre',
  // Foto mostrata nella schermata finale, sotto «Buon compleanno, Francesca!».
  // TODO: sostituisci il file in public/images/ se vuoi un'altra foto.
  finalImage: {
    src: 'images/final-francesca.jpg',
    alt: 'Francesca con un fiocco dorato tra i capelli',
  },
  message:
    'Oggi non contano gli anni, contano le persone che ti vogliono bene. E sono tante, tantissime. Grazie per ogni risata, ogni abbraccio e ogni avventura: il regalo più bello è averti nella mia vita.',
  signature: 'Con tutto il cuore, chi ti pensa sempre 💛',
  giftHint: 'Vuoi sapere il tuo regalo? 🎁',
  shareText: 'Ho completato il percorso di compleanno! 🎂🎉',
} as const;

export type Birthday = typeof birthday;
