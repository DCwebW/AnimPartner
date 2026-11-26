import { z } from 'zod';

import { PALETTES, type CleTheme } from './palettes';
import { estNuit, themeDuMoment } from './themeDuMoment';

/**
 * Thèmes que le tirage du jour peut donner : ni la nuit ni les fêtes.
 * Seul endroit à modifier quand un paysage ou un pays arrive.
 */
export const THEMES_AU_CHOIX: readonly CleTheme[] = ['beauTemps', 'hiver', 'automne'];

export const ModeThemeSchema = z.discriminatedUnion('mode', [
  z.object({ mode: z.literal('automatique') }),
  z.object({ mode: z.literal('aleatoire') }),
  z.object({
    mode: z.literal('fixe'),
    theme: z.enum(Object.keys(PALETTES) as [CleTheme, ...CleTheme[]]),
  }),
]);
export type ModeTheme = z.infer<typeof ModeThemeSchema>;

export const MODE_AUTOMATIQUE: ModeTheme = { mode: 'automatique' };

const MS_PAR_JOUR = 86_400_000;

/** Générateur pseudo-aléatoire déterministe (mulberry32). */
function graine(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function echanger(liste: CleTheme[], i: number, j: number): void {
  const a = liste[i];
  const b = liste[j];
  if (a === undefined || b === undefined) return;
  liste[i] = b;
  liste[j] = a;
}

/** Permutation de la liste, tirée d'une graine (le numéro du cycle). */
function permutation(cycle: number): CleTheme[] {
  const hasard = graine(Math.imul(cycle, 2654435761) + 12345);
  const liste = [...THEMES_AU_CHOIX];
  for (let i = liste.length - 1; i > 0; i--) {
    const j = Math.floor(hasard() * (i + 1));
    echanger(liste, i, j);
  }
  return liste;
}

/**
 * Thème du jour local de `date`, sans état : les jours sont regroupés en cycles de N jours,
 * chaque cycle étant une permutation de la liste tirée du numéro du cycle. Si le premier du
 * cycle égale le dernier du précédent, on échange les deux premiers : jamais le même thème
 * deux jours de suite, et chaque cycle de N jours les contient tous.
 */
export function themeDuJour(date: Date): CleTheme {
  const n = THEMES_AU_CHOIX.length;
  const jour = Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / MS_PAR_JOUR,
  );
  if (n === 1) return THEMES_AU_CHOIX[0] ?? 'beauTemps';
  if (n === 2) return THEMES_AU_CHOIX[((jour % 2) + 2) % 2] ?? 'beauTemps';
  const cycle = Math.floor(jour / n);
  const liste = permutation(cycle);
  // L'échange touche les rangs 0 et 1 : le dernier du cycle précédent (rang n - 1 >= 2) est brut.
  if (liste[0] === permutation(cycle - 1)[n - 1]) echanger(liste, 0, 1);
  return liste[jour - cycle * n] ?? 'beauTemps';
}

/** Thème à afficher selon le mode : la nuit reprend le soir sauf en fixe ; une fête ne passe pas devant le tirage. */
export function themeAffiche(mode: ModeTheme, date: Date): CleTheme {
  switch (mode.mode) {
    case 'fixe':
      return mode.theme;
    case 'aleatoire':
      return estNuit(date) ? 'nuit' : themeDuJour(date);
    default:
      return themeDuMoment(date);
  }
}
