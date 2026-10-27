import { birthday } from '../data/birthday';

/** Sostituisce i segnaposto {{name}}, {{age}} e {{date}} nei testi. */
export function t(text: string): string {
  return text
    .replaceAll('{{name}}', birthday.name)
    .replaceAll('{{age}}', String(birthday.age))
    .replaceAll('{{date}}', birthday.dateLabel);
}
