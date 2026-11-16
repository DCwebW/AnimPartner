// Contrôles de qualité du catalogue, utilisés par ses tests et par l'agent des énigmes.
// Logique pure, sans React.

import type { Enigme } from './schema';

/** Âges que le catalogue doit couvrir. */
export const AGE_COUVERT_MIN = 3;
export const AGE_COUVERT_MAX = 12;

/** Part minimale du catalogue validé qui doit convenir à chaque âge couvert. */
export const COUVERTURE_MIN = 0.15;

// Un seul déterminant de tête est retiré. « de la » et « de l' » passent avant « de ».
const DETERMINANT_DE_TETE =
  /^(?:de la |de l'|l'|(?:le|la|les|un|une|des|du|de|mon|ma|mes|ton|ta|tes|son|sa|ses|notre|nos|votre|vos|leur|leurs) )/;

function singulier(mot: string): string {
  return mot.length > 3 ? mot.replace(/[sx]$/, '') : mot;
}

/**
 * Forme comparable d'une réponse : « Les Chaussettes » et « la chaussette » donnent la
 * même clé. Sert à repérer les doublons que la casse, les accents, le déterminant ou le
 * pluriel masqueraient.
 */
export function cleReponse(reponse: string): string {
  const texte = reponse
    .toLocaleLowerCase('fr')
    .replace(/œ/g, 'oe')
    .replace(/æ/g, 'ae')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[’`´]/g, "'")
    .replace(/[^a-z0-9']+/g, ' ')
    .trim()
    .replace(DETERMINANT_DE_TETE, '')
    .replace(/'/g, ' ')
    .trim();
  return texte.split(/\s+/).map(singulier).join(' ');
}

export type Doublon = { cle: string; ids: string[] };

/** Les groupes d'énigmes qui ont la même réponse une fois normalisée. */
export function doublonsDeReponse(enigmes: readonly Enigme[]): Doublon[] {
  const parCle = new Map<string, string[]>();
  for (const { id, reponse } of enigmes) {
    const cle = cleReponse(reponse);
    parCle.set(cle, [...(parCle.get(cle) ?? []), id]);
  }
  return [...parCle].filter(([, ids]) => ids.length > 1).map(([cle, ids]) => ({ cle, ids }));
}

export type Couverture = { age: number; nombre: number };

/** Pour chaque âge, le nombre d'énigmes dont la tranche le contient. */
export function couvertureParAge(
  enigmes: readonly Enigme[],
  ageMin = AGE_COUVERT_MIN,
  ageMax = AGE_COUVERT_MAX,
): Couverture[] {
  const couverture: Couverture[] = [];
  for (let age = ageMin; age <= ageMax; age++) {
    const nombre = enigmes.filter((e) => e.ageMin <= age && age <= e.ageMax).length;
    couverture.push({ age, nombre });
  }
  return couverture;
}

/** Les âges couverts par moins de `part` du catalogue, avec le minimum attendu. */
export function agesSousCouverts(
  enigmes: readonly Enigme[],
  part = COUVERTURE_MIN,
  ageMin = AGE_COUVERT_MIN,
  ageMax = AGE_COUVERT_MAX,
): (Couverture & { minimum: number })[] {
  // L'arrondi évite qu'une imprécision binaire (100 × 0,07 = 7,000000000000001) ne
  // relève le minimum d'une unité si la part change un jour.
  const minimum = Math.ceil(Number((enigmes.length * part).toFixed(6)));
  return couvertureParAge(enigmes, ageMin, ageMax)
    .filter(({ nombre }) => nombre < minimum)
    .map((c) => ({ ...c, minimum }));
}
