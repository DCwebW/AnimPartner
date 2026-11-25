// Données et calculs purs du bandeau du Jour de l'an, repris de
// design/propositions/02-jour-de-l-an/bandeau.html. Sans React, testés à part.
//
// La planche déclare ses animations sous les classes `jb-*` mais place `ja-*` sur les
// éléments (seule `jb-confetti` correspond). On suit l'intention des notes de la proposition :
// 3 feux, 5 scintillements, 4 ballons, 1 horloge, 1 couche de confettis. Les variantes
// `ja-f1`/`ja-s1`… prennent les durées et délais des règles `.jb-f1`/`.jb-s1`… de la planche.

export type Feu = {
  /** Centre de l'éclat (unités du viewBox 390 × 200), origine de l'échelle. */
  x: number;
  y: number;
  duree: number;
  delai: number;
  /** Rayons : tracé de la traînée, puis centre de l'étincelle au bout. */
  rayons: readonly (readonly [string, number, number])[];
  couleurTrait: string;
  couleurEtincelle: string;
};

export type Etoile = { x: number; y: number; duree: number; delai: number };
export type Ballon = { x: number; y: number; couleur: string; duree: number; delai: number };
export type Confetti = { x: number; y: number; couleur: string; degres: number };

/** `jb-feu` : 5 s, ease-out, en boucle simple ; `jb-f1` −1,7 s, `jb-f2` −3,3 s. */
export const FEU_DUREE = 5;
export const FEU_ETAPES = [
  { t: 0, opacite: 0, echelle: 0.3 },
  { t: 0.25, opacite: 1, echelle: 1 },
  { t: 0.6, opacite: 0.8, echelle: 1.12 },
  { t: 1, opacite: 0, echelle: 1.25 },
] as const;

export const FEUX: readonly Feu[] = [
  {
    x: 70,
    y: 52,
    duree: FEU_DUREE,
    delai: 0,
    couleurTrait: '#E8548C',
    couleurEtincelle: '#F2C14E',
    rayons: [
      ['M80.5 52.0L100.0 52.0', 102.0, 62.2],
      ['M78.5 58.2L94.3 69.6', 89.9, 79.1],
      ['M73.2 62.0L79.3 80.5', 70.1, 85.6],
      ['M66.8 62.0L60.7 80.5', 50.4, 79.3],
      ['M61.5 58.2L45.7 69.6', 38.1, 62.5],
      ['M59.5 52.0L40.0 52.0', 38.0, 41.8],
      ['M61.5 45.8L45.7 34.4', 50.1, 24.9],
      ['M66.8 42.0L60.7 23.5', 69.9, 18.4],
      ['M73.2 42.0L79.3 23.5', 89.6, 24.7],
      ['M78.5 45.8L94.3 34.4', 101.9, 41.5],
    ],
  },
  {
    x: 300,
    y: 60,
    duree: FEU_DUREE,
    delai: -1.7,
    couleurTrait: '#F2C14E',
    couleurEtincelle: '#6FD3E8',
    rayons: [
      ['M311.9 60.0L334.0 60.0', 336.3, 71.6],
      ['M309.6 67.0L327.5 80.0', 322.5, 90.7],
      ['M303.7 71.3L310.5 92.3', 300.2, 98.1],
      ['M296.3 71.3L289.5 92.3', 277.7, 90.9],
      ['M290.4 67.0L272.5 80.0', 263.8, 71.9],
      ['M288.1 60.0L266.0 60.0', 263.7, 48.4],
      ['M290.4 53.0L272.5 40.0', 277.5, 29.3],
      ['M296.3 48.7L289.5 27.7', 299.8, 21.9],
      ['M303.7 48.7L310.5 27.7', 322.3, 29.1],
      ['M309.6 53.0L327.5 40.0', 336.2, 48.1],
    ],
  },
  {
    x: 185,
    y: 38,
    duree: FEU_DUREE,
    delai: -3.3,
    couleurTrait: '#6FD3E8',
    couleurEtincelle: '#E8548C',
    rayons: [
      ['M194.1 38.0L211.0 38.0', 212.7, 46.9],
      ['M192.4 43.3L206.0 53.3', 202.2, 61.5],
      ['M187.8 46.7L193.0 62.7', 185.1, 67.1],
      ['M182.2 46.7L177.0 62.7', 168.0, 61.6],
      ['M177.6 43.3L164.0 53.3', 157.3, 47.1],
      ['M175.9 38.0L159.0 38.0', 157.3, 29.1],
      ['M177.6 32.7L164.0 22.7', 167.8, 14.5],
      ['M182.2 29.3L177.0 13.3', 184.9, 8.9],
      ['M187.8 29.3L193.0 13.3', 202.0, 14.4],
      ['M192.4 32.7L206.0 22.7', 212.7, 28.9],
    ],
  },
];

/** `jb-scint` : 2,4 s alterné ; opacité 1 → 0,25, échelle 1 → 0,6 ; `jb-s1` 3,1 s −1 s, `jb-s2` 2 s −1,5 s. */
export const SCINTILLEMENT = { opaciteFin: 0.25, echelleFin: 0.6 };
export const ETOILES: readonly Etoile[] = [
  { x: 40, y: 60, duree: 2.4, delai: 0 },
  { x: 150, y: 30, duree: 3.1, delai: -1 },
  { x: 215, y: 90, duree: 2, delai: -1.5 },
  { x: 330, y: 50, duree: 2.4, delai: 0 },
  { x: 370, y: 100, duree: 3.1, delai: -1 },
];

/** `jb-ballon` : balancement de −6° à +6°, 4 s alterné ; `jb-b1` 5 s −1,3 s, `jb-b2` 3,5 s −2,4 s. */
export const BALANCE_DEGRES = 6;
/** (x, y) : point d'attache de la ficelle, origine de la rotation. */
export const BALLONS: readonly Ballon[] = [
  { x: 100, y: 168, couleur: '#E8548C', duree: 4, delai: 0 },
  { x: 125, y: 174, couleur: '#F2C14E', duree: 5, delai: -1.3 },
  { x: 268, y: 170, couleur: '#6FD3E8', duree: 4, delai: 0 },
  { x: 292, y: 166, couleur: '#E8548C', duree: 3.5, delai: -2.4 },
];

/** `jb-horloge` : échelle 1 → 1,06, 3 s alterné, autour du centre du cadran. */
export const HORLOGE = { x: 195, y: 100, duree: 3, delai: 0, echelleFin: 1.06 };

/** `jb-chute` : 200 px en 16 s, linéaire, en boucle. */
export const CONFETTIS = { distance: 200, duree: 16 };

const R = '#E8548C';
const J = '#F2C14E';
const C = '#6FD3E8';
/** Une couche de confettis ; la planche la répète à y − 200 pour que la chute boucle sans saut. */
export const CONFETTIS_COUCHE: readonly Confetti[] = [
  { x: 14, y: 30, couleur: R, degres: 8 },
  { x: 60, y: 90, couleur: J, degres: -30 },
  { x: 104, y: 10, couleur: C, degres: -22 },
  { x: 150, y: 150, couleur: J, degres: 0 },
  { x: 196, y: 60, couleur: R, degres: 22 },
  { x: 240, y: 120, couleur: C, degres: -30 },
  { x: 284, y: 20, couleur: J, degres: -22 },
  { x: 330, y: 80, couleur: R, degres: 0 },
  { x: 372, y: 140, couleur: C, degres: -6 },
  { x: 120, y: 180, couleur: J, degres: -30 },
  { x: 30, y: 160, couleur: R, degres: 0 },
  { x: 310, y: 184, couleur: J, degres: -20 },
];

type Etape = { t: number; opacite: number; echelle: number };

/**
 * Valeur à l'avancement `u` (0 à 1) d'une suite d'étapes. Comme en CSS, la courbe
 * (`courbe`, de 0 à 1) s'applique à chaque intervalle entre deux étapes.
 */
export function interpoler(
  etapes: readonly Etape[],
  u: number,
  courbe: (v: number) => number,
): { opacite: number; echelle: number } {
  'worklet';
  for (let i = 1; i < etapes.length; i++) {
    const a = etapes[i - 1]!;
    const b = etapes[i]!;
    if (u <= b.t) {
      const v = courbe((u - a.t) / (b.t - a.t));
      return {
        opacite: a.opacite + (b.opacite - a.opacite) * v,
        echelle: a.echelle + (b.echelle - a.echelle) * v,
      };
    }
  }
  const fin = etapes[etapes.length - 1]!;
  return { opacite: fin.opacite, echelle: fin.echelle };
}
