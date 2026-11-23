// Balayage de l'étiquette au pouce (issue #48), sans React. Les fonctions marquées
// « worklet » tournent sur le thread de l'interface, dans le geste.

/** Part de la largeur de l'écran à parcourir pour valider un balayage lent. */
export const SEUIL_DISTANCE = 0.3;
/** Vitesse au relâcher, en points par seconde, qui valide un balayage même court. */
export const SEUIL_VITESSE = 600;
/** Part du déplacement du pouce suivie quand l'étiquette n'a nulle part où aller. */
export const RESISTANCE = 0.25;
/** Retour de l'étiquette au centre quand le balayage n'est pas validé. */
export const DUREE_RETOUR_MS = 200;

export type Decision = 'suivante' | 'precedente' | 'retour';

type Relacher = {
  /** Déplacement horizontal du pouce depuis le début du geste ; négatif à gauche. */
  decalage: number;
  /** Vitesse horizontale au relâcher, en points par seconde ; négative à gauche. */
  vitesse: number;
  /** Largeur de l'écran. */
  largeur: number;
  /** Il existe une énigme précédente. */
  peutReculer: boolean;
};

/**
 * Ce que fait l'étiquette au relâcher. Un geste vif décide par sa direction ; sinon, il
 * faut avoir parcouru `SEUIL_DISTANCE` de la largeur. Un lancer qui contredit le
 * déplacement (le pouce revient en arrière) ramène l'étiquette au centre.
 */
export function decisionBalayage({ decalage, vitesse, largeur, peutReculer }: Relacher): Decision {
  'worklet';
  let sens: -1 | 0 | 1 = 0;
  if (Math.abs(vitesse) > SEUIL_VITESSE) {
    const sensVitesse = vitesse < 0 ? -1 : 1;
    // Lancé à contre-sens d'un déplacement déjà franc : le pouce se ravise.
    const contreSens =
      Math.abs(decalage) > SEUIL_DISTANCE * largeur && Math.sign(decalage) !== sensVitesse;
    sens = contreSens ? 0 : sensVitesse;
  } else if (Math.abs(decalage) > SEUIL_DISTANCE * largeur) {
    sens = decalage < 0 ? -1 : 1;
  }
  if (sens === -1) return 'suivante';
  if (sens === 1 && peutReculer) return 'precedente';
  return 'retour';
}

/** Déplacement de l'étiquette sous le pouce : freiné vers la droite sans précédente. */
export function decalageSuivi(decalage: number, peutReculer: boolean): number {
  'worklet';
  return decalage > 0 && !peutReculer ? decalage * RESISTANCE : decalage;
}
