// Retournement de l'étiquette (issue #10), sans React. Les fonctions marquées
// « worklet » tournent aussi sur le thread de l'interface, dans les styles animés.

import type { Face } from './Etiquette';

/** Durée du retournement, autour de l'axe vertical. */
export const DUREE_RETOURNEMENT_MS = 500;
/** Durée du fondu qui remplace la rotation quand le système réduit les animations. */
export const DUREE_FONDU_REDUIT_MS = 200;
/** Inclinaison de l'étiquette au repos, en degrés : le recto penche à gauche… */
export const INCLINAISON_RECTO = -2;
/** … et le verso à droite. */
export const INCLINAISON_VERSO = 2;
/** Distance de la perspective, en points : assez loin pour une rotation douce. */
export const PERSPECTIVE = 1000;

/** Progression du retournement quand la face est à plat : 0 au recto, 1 au verso. */
export function progressionDe(face: Face): number {
  'worklet';
  return face === 'recto' ? 0 : 1;
}

export type StyleFace = {
  /** 1 quand la face se voit, 0 sinon. Entre les deux pendant le fondu réduit. */
  opacite: number;
  /** Rotation autour de l'axe vertical, en degrés. */
  rotationY: number;
  /** Inclinaison dans le plan de l'écran, en degrés. */
  inclinaison: number;
};

/**
 * Position d'une face pour une progression de 0 (recto à plat) à 1 (verso à plat).
 * Les deux faces tournent ensemble de 180° ; chacune ne se montre que tant qu'elle
 * regarde l'écran (rotation de 90° au plus), si bien qu'aucune n'apparaît en miroir.
 * Animations réduites : pas de rotation, un fondu enchaîné entre les deux faces.
 */
export function styleFace(face: Face, progression: number, reduit: boolean): StyleFace {
  'worklet';
  const recto = face === 'recto';
  if (reduit) {
    return {
      opacite: recto ? 1 - progression : progression,
      rotationY: 0,
      inclinaison: recto ? INCLINAISON_RECTO : INCLINAISON_VERSO,
    };
  }
  const inclinaison = INCLINAISON_RECTO + (INCLINAISON_VERSO - INCLINAISON_RECTO) * progression;
  const rotationY = recto ? 180 * progression : 180 * progression - 180;
  const visible = recto ? progression < 0.5 : progression >= 0.5;
  return { opacite: visible ? 1 : 0, rotationY, inclinaison };
}
