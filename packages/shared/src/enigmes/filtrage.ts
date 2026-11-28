import { z } from 'zod';

import { AGE_COUVERT_MAX, AGE_COUVERT_MIN } from './controles';
import type { Enigme } from './schema';

/** Âge du plus jeune du groupe : un entier couvert par le catalogue, ou `null` (tous âges). */
export const AgeGroupeSchema = z
  .number()
  .int()
  .min(AGE_COUVERT_MIN)
  .max(AGE_COUVERT_MAX)
  .nullable();

export type AgeGroupe = z.infer<typeof AgeGroupeSchema>;

/** Les énigmes dont la tranche contient l'âge (bornes incluses), dans l'ordre d'origine. */
export function enigmesPourAge(enigmes: readonly Enigme[], age: number | null): Enigme[] {
  if (age === null) return [...enigmes];
  return enigmes.filter((e) => e.ageMin <= age && age <= e.ageMax);
}
