// Glissement vers l'énigme suivante (issue #11), sans React. Les fonctions marquées
// « worklet » tournent aussi sur le thread de l'interface, dans les styles animés.

/** Durée du glissement : l'étiquette sort à gauche pendant que la suivante entre. */
export const DUREE_GLISSEMENT_MS = 350;
/** Durée du fondu enchaîné qui remplace le glissement quand les animations sont réduites. */
export const DUREE_FONDU_ENCHAINE_MS = 250;

// Position d'une étiquette dans le carrousel. Une étiquette entre en passant de 0 à 1
// pendant que la précédente sort en passant de 1 à 2 : elles avancent ensemble.

/** Hors de l'écran, à droite : là où naît la nouvelle étiquette. */
export const POSITION_ENTREE = 0;
/** Au centre, à plat. */
export const POSITION_POSEE = 1;
/** Hors de l'écran, à gauche : là où l'étiquette s'en va. */
export const POSITION_SORTIE = 2;

export type StyleGlissement = {
  /** Décalage horizontal, en points : positif à droite. */
  decalage: number;
  opacite: number;
};

/**
 * Décalage et opacité d'une étiquette à une position du carrousel. `distance` est la
 * largeur à parcourir pour quitter l'écran (la largeur de la fenêtre suffit, l'étiquette
 * étant centrée et moins large qu'elle). Animations réduites : l'étiquette reste en
 * place et apparaît ou s'efface en fondu.
 */
export function styleGlissement(
  position: number,
  distance: number,
  reduit: boolean,
): StyleGlissement {
  'worklet';
  if (reduit) {
    const ecart = Math.min(1, Math.abs(position - POSITION_POSEE));
    return { decalage: 0, opacite: 1 - ecart };
  }
  return { decalage: (POSITION_POSEE - position) * distance, opacite: 1 };
}
