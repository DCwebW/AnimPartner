import {
  DUREE_FONDU_ENCHAINE_MS,
  DUREE_GLISSEMENT_MS,
  POSITION_ENTREE,
  POSITION_POSEE,
  DUREE_SORTIE_MIN_MS,
  POSITION_SORTIE,
  dureeSortie,
  styleGlissement,
} from '@/enigmes/glissement';

const etapes = Array.from({ length: 101 }, (_, i) => i / 100);
const DISTANCE = 390;

describe("glissement de l'étiquette", () => {
  it('garde les valeurs de la spec', () => {
    expect(DUREE_GLISSEMENT_MS).toBe(350);
    expect(DUREE_FONDU_ENCHAINE_MS).toBeLessThan(DUREE_GLISSEMENT_MS);
    expect(POSITION_ENTREE).toBeLessThan(POSITION_POSEE);
    expect(POSITION_POSEE).toBeLessThan(POSITION_SORTIE);
  });

  it('pose l’étiquette au centre, entière', () => {
    expect(styleGlissement(POSITION_POSEE, DISTANCE, false)).toEqual({ decalage: 0, opacite: 1 });
    expect(styleGlissement(POSITION_POSEE, DISTANCE, true)).toEqual({ decalage: 0, opacite: 1 });
  });

  it('fait entrer par la droite et sortir par la gauche', () => {
    expect(styleGlissement(POSITION_ENTREE, DISTANCE, false).decalage).toBe(DISTANCE);
    expect(styleGlissement(POSITION_SORTIE, DISTANCE, false).decalage).toBe(-DISTANCE);
  });

  it('fait avancer les deux étiquettes ensemble, comme un carrousel', () => {
    for (const p of etapes) {
      const entrante = styleGlissement(POSITION_ENTREE + p, DISTANCE, false);
      const sortante = styleGlissement(POSITION_POSEE + p, DISTANCE, false);
      expect(entrante.decalage - sortante.decalage).toBeCloseTo(DISTANCE);
      expect(entrante.opacite).toBe(1);
      expect(sortante.opacite).toBe(1);
    }
  });

  it('finit la sortie à la même vitesse, depuis là où le pouce l’a laissée', () => {
    expect(dureeSortie(POSITION_POSEE, POSITION_SORTIE, false)).toBe(DUREE_GLISSEMENT_MS);
    expect(dureeSortie(POSITION_POSEE, POSITION_ENTREE, false)).toBe(DUREE_GLISSEMENT_MS);
    expect(dureeSortie(1.5, POSITION_SORTIE, false)).toBe(DUREE_GLISSEMENT_MS / 2);
    expect(dureeSortie(0.6, POSITION_ENTREE, false)).toBeCloseTo(DUREE_GLISSEMENT_MS * 0.6);
    expect(dureeSortie(1.95, POSITION_SORTIE, false)).toBe(DUREE_SORTIE_MIN_MS);
  });

  it('garde la durée du fondu quand les animations sont réduites', () => {
    expect(dureeSortie(POSITION_POSEE, POSITION_SORTIE, true)).toBe(DUREE_FONDU_ENCHAINE_MS);
  });

  it('remplace le glissement par un fondu enchaîné quand les animations sont réduites', () => {
    for (const p of etapes) {
      const entrante = styleGlissement(POSITION_ENTREE + p, DISTANCE, true);
      const sortante = styleGlissement(POSITION_POSEE + p, DISTANCE, true);
      expect(entrante.decalage).toBe(0);
      expect(sortante.decalage).toBe(0);
      expect(entrante.opacite + sortante.opacite).toBeCloseTo(1);
    }
    expect(styleGlissement(POSITION_ENTREE, DISTANCE, true).opacite).toBe(0);
    expect(styleGlissement(POSITION_SORTIE, DISTANCE, true).opacite).toBe(0);
  });
});
