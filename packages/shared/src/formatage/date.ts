// Formatage des dates pour l'interface, sans dépendre d'Intl (absent ou partiel selon
// les moteurs JavaScript). Le fuseau est celui du téléphone.

const JOURS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const MOIS = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre',
];

/** « Mercredi 15 avril », « Mardi 1er décembre ». */
export function formaterDateDuJour(date: Date): string {
  const jour = date.getDate();
  return `${JOURS[date.getDay()]} ${jour === 1 ? '1er' : jour} ${MOIS[date.getMonth()]}`;
}

/** « 7 – 10 ans », avec des espaces insécables pour ne jamais couper la tranche. */
export function formaterTrancheAge(ageMin: number, ageMax: number): string {
  const nb = '\u00a0';
  return ageMin === ageMax ? `${ageMin}${nb}ans` : `${ageMin}${nb}–${nb}${ageMax}${nb}ans`;
}
