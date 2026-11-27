import { z } from 'zod';

/** Longueur maximale du prénom, en caractères. */
export const PRENOM_MAX = 30;

/** Prénom gardé sur le téléphone : `null` quand l'animateur n'en a pas donné. */
export const PrenomSchema = z.string().trim().min(1).max(PRENOM_MAX).nullable();

/** Retire les espaces autour du prénom et le tronque à `PRENOM_MAX` caractères. */
export function nettoyerPrenom(saisi: string): string {
  return Array.from(saisi.trim()).slice(0, PRENOM_MAX).join('').trim();
}

/** « Bonjour, Camille » ; sans prénom, la salutation seule. */
export function salutationAvecPrenom(salut: string, prenom: string | null | undefined): string {
  return prenom ? `${salut}, ${prenom}` : salut;
}
