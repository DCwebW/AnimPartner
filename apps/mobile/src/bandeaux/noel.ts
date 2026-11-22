// Données et calculs purs du bandeau de Noël, repris de design/propositions/01-noel/bandeau.html
// (bloc <style> pour les animations, SVG pour les positions). Sans React, testés à part.

export type Fanion = {
  /** Sommet du fanion, point d'accroche sur la guirlande (unités du viewBox 390 × 200). */
  x: number;
  y: number;
  couleur: string;
  /** Durée d'un aller (s) et délai CSS (s, négatif = phase de départ). */
  duree: number;
  delai: number;
};

export type Boule = { x: number; y: number; couleur: string; duree: number; delai: number };

// `nb-fanion` : 4,2 s ; `nb-f1` : 5,1 s, délai −1,3 s ; `nb-f2` : 3,7 s, délai −2,4 s.
const F0 = { duree: 4.2, delai: 0 };
const F1 = { duree: 5.1, delai: -1.3 };
const F2 = { duree: 3.7, delai: -2.4 };

export const FANIONS: readonly Fanion[] = [
  { x: 28, y: 17.1, couleur: '#B8352A', ...F0 },
  { x: 76, y: 22.0, couleur: '#F2C14E', ...F1 },
  { x: 124, y: 25.8, couleur: '#1F6B45', ...F2 },
  { x: 172, y: 27.8, couleur: '#FFFFFF', ...F0 },
  { x: 220, y: 27.7, couleur: '#B8352A', ...F1 },
  { x: 356, y: 17.8, couleur: '#F2C14E', ...F2 },
];

// `nb-lueur` : 2,6 s ; `nb-l1` : 3,4 s, délai −1 s ; `nb-l2` : 2,1 s, délai −1,7 s.
const L0 = { duree: 2.6, delai: 0 };
const L1 = { duree: 3.4, delai: -1 };
const L2 = { duree: 2.1, delai: -1.7 };

export const BOULES: readonly Boule[] = [
  { x: 270, y: 81, couleur: '#B8352A', ...L0 },
  { x: 295.5, y: 76.5, couleur: '#F2C14E', ...L1 },
  { x: 261, y: 108, couleur: '#F2C14E', ...L2 },
  { x: 288, y: 99, couleur: '#B8352A', ...L0 },
  { x: 304.5, y: 111, couleur: '#FFFFFF', ...L1 },
  { x: 277.5, y: 60, couleur: '#F2C14E', ...L2 },
  { x: 282, y: 114, couleur: '#B8352A', ...L0 },
];

/** Balancement des fanions : de −5° à +5°, autour de leur sommet (`nb-balance`). */
export const BALANCE_DEGRES = 5;
/** Lueur des boules : opacité de 1 à 0,45, échelle de 1 à 0,82, autour du centre (`nb-lueur`). */
export const LUEUR = { opaciteFin: 0.45, echelleFin: 0.82, rayon: 3.6 };
/** Pulsation de l'étoile : opacité 1 → 0,7, échelle 1 → 1,18, rotation −6° → +6° (`nb-etoile`). */
export const ETOILE = {
  x: 282,
  y: 30,
  duree: 3.2,
  delai: 0,
  opaciteFin: 0.7,
  echelleFin: 1.18,
  degres: 6,
};
/** Chute des confettis : 200 px en 16 s, linéaire, en boucle (`nb-chute`). */
export const CONFETTIS = { distance: 200, duree: 16 };

export type Confetti = { x: number; y: number; couleur: string; degres: number };

const R = '#B8352A';
const J = '#F2C14E';
const V = '#1F6B45';
/** Une couche de confettis ; la planche la répète à y − 200 pour que la chute boucle sans saut. */
export const CONFETTIS_COUCHE: readonly Confetti[] = [
  { x: 14, y: 30, couleur: R, degres: 8 },
  { x: 60, y: 90, couleur: J, degres: -30 },
  { x: 104, y: 10, couleur: V, degres: -22 },
  { x: 150, y: 150, couleur: R, degres: 0 },
  { x: 196, y: 60, couleur: J, degres: 22 },
  { x: 240, y: 120, couleur: V, degres: -30 },
  { x: 284, y: 20, couleur: R, degres: -22 },
  { x: 330, y: 80, couleur: J, degres: 0 },
  { x: 372, y: 140, couleur: V, degres: -6 },
  { x: 120, y: 180, couleur: J, degres: -30 },
  { x: 30, y: 160, couleur: V, degres: 0 },
  { x: 310, y: 184, couleur: R, degres: -20 },
];

/**
 * Phase de départ (0 à 1) d'une boucle CSS : un délai négatif de d secondes fait démarrer
 * l'animation d secondes après son début ; un délai positif la retarde (phase 0).
 * `periode` : durée d'un cycle complet (2 × la durée d'un aller pour une boucle alternée).
 */
export function phaseDepart(delai: number, periode: number): number {
  if (delai >= 0) return 0;
  return (-delai % periode) / periode;
}

/** Aller-retour d'une boucle alternée : de 0 à 1 puis de 1 à 0, pour une phase de 0 à 1. */
export function aller(phase: number): number {
  'worklet';
  return phase < 0.5 ? phase * 2 : 2 - phase * 2;
}

/** Valeur d'une propriété à l'avancement `u` (0 à 1) entre `debut` et `fin`. */
export function entre(debut: number, fin: number, u: number): number {
  'worklet';
  return debut + (fin - debut) * u;
}
