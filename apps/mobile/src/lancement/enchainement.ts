// Enchaînement de l'écran de chargement (issue #19), sans React.
// Les durées sont regroupées ici pour être ajustées après la recette.

/** Apparition du logotype, en fondu. */
export const FONDU_ENTREE_MS = 250;
/** Temps minimal pendant lequel le logotype reste affiché, une fois apparu. */
export const DUREE_MINIMALE_MS = 800;
/** Disparition de l'écran de chargement, en fondu, sur l'écran d'accueil. */
export const FONDU_SORTIE_MS = 300;
/** Fondu unique quand le système demande de réduire les animations. */
export const FONDU_REDUIT_MS = 150;

export type EtatChargement = {
  /** Tout ce que l'écran d'accueil attend est chargé. */
  pret: boolean;
  /** Temps écoulé depuis l'affichage de l'écran de chargement. */
  ecouleMs: number;
  /** Le système demande de réduire les animations. */
  animationsReduites: boolean;
};

/**
 * Délai avant de lancer la disparition de l'écran de chargement, ou `null` tant que
 * l'application n'est pas prête. Zéro : il faut le masquer tout de suite.
 */
export function delaiAvantMasquage({
  pret,
  ecouleMs,
  animationsReduites,
}: EtatChargement): number | null {
  if (!pret) return null;
  if (animationsReduites) return 0;
  return Math.max(0, FONDU_ENTREE_MS + DUREE_MINIMALE_MS - ecouleMs);
}

/** Durée du fondu de sortie. */
export function dureeSortie(animationsReduites: boolean): number {
  return animationsReduites ? FONDU_REDUIT_MS : FONDU_SORTIE_MS;
}
