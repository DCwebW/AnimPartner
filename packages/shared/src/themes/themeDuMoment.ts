import type { CleTheme } from './palettes';

const HEURE_DEBUT_NUIT = 20;
const HEURE_FIN_NUIT = 7;

/** Thème à afficher pour une date locale : la nuit prime, puis la saison. */
export function themeDuMoment(date: Date): CleTheme {
  const heure = date.getHours();
  if (heure >= HEURE_DEBUT_NUIT || heure < HEURE_FIN_NUIT) return 'nuit';
  const mois = date.getMonth() + 1;
  if (mois === 12 || mois <= 2) return 'hiver';
  if (mois >= 9) return 'automne';
  return 'beauTemps';
}

/** « Bonsoir » avec le thème nuit, « Bonjour » sinon. */
export function salutationDuMoment(date: Date): 'Bonjour' | 'Bonsoir' {
  return themeDuMoment(date) === 'nuit' ? 'Bonsoir' : 'Bonjour';
}
