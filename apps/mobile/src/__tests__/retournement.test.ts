import {
  DUREE_FONDU_REDUIT_MS,
  DUREE_RETOURNEMENT_MS,
  INCLINAISON_RECTO,
  INCLINAISON_VERSO,
  progressionDe,
  styleFace,
} from '@/enigmes/retournement';

const etapes = Array.from({ length: 101 }, (_, i) => i / 100);

describe("retournement de l'étiquette", () => {
  it('garde les valeurs de la spec', () => {
    expect(DUREE_RETOURNEMENT_MS).toBe(500);
    expect(DUREE_FONDU_REDUIT_MS).toBeLessThan(DUREE_RETOURNEMENT_MS);
    expect(INCLINAISON_RECTO).toBe(-2);
    expect(INCLINAISON_VERSO).toBe(2);
  });

  it('associe le recto à 0 et le verso à 1', () => {
    expect(progressionDe('recto')).toBe(0);
    expect(progressionDe('verso')).toBe(1);
  });

  it('montre le recto à plat, incliné de −2°, au départ', () => {
    expect(styleFace('recto', 0, false)).toEqual({ opacite: 1, rotationY: 0, inclinaison: -2 });
    expect(styleFace('verso', 0, false).opacite).toBe(0);
  });

  it('montre le verso à plat, incliné de +2°, à l’arrivée', () => {
    expect(styleFace('verso', 1, false)).toEqual({ opacite: 1, rotationY: 0, inclinaison: 2 });
    expect(styleFace('recto', 1, false).opacite).toBe(0);
  });

  it('fait passer l’inclinaison de −2° à +2° pendant le retournement', () => {
    expect(styleFace('recto', 0.25, false).inclinaison).toBeCloseTo(-1);
    expect(styleFace('verso', 0.75, false).inclinaison).toBeCloseTo(1);
  });

  it('tourne de 180° en tout autour de l’axe vertical', () => {
    expect(styleFace('recto', 0.5, false).rotationY).toBe(90);
    expect(styleFace('verso', 0.5, false).rotationY).toBe(-90);
  });

  it('ne montre jamais une face en miroir', () => {
    for (const p of etapes) {
      for (const face of ['recto', 'verso'] as const) {
        const s = styleFace(face, p, false);
        if (s.opacite > 0) expect(Math.abs(s.rotationY)).toBeLessThanOrEqual(90);
      }
    }
  });

  it('montre toujours exactement une face', () => {
    for (const p of etapes) {
      const visibles = (['recto', 'verso'] as const).filter(
        (face) => styleFace(face, p, false).opacite > 0,
      );
      expect(visibles).toHaveLength(1);
    }
  });

  it('remplace la rotation par un fondu quand les animations sont réduites', () => {
    for (const p of etapes) {
      const recto = styleFace('recto', p, true);
      const verso = styleFace('verso', p, true);
      expect(recto.rotationY).toBe(0);
      expect(verso.rotationY).toBe(0);
      expect(recto.opacite + verso.opacite).toBeCloseTo(1);
      expect(recto.inclinaison).toBe(-2);
      expect(verso.inclinaison).toBe(2);
    }
    expect(styleFace('recto', 0, true).opacite).toBe(1);
    expect(styleFace('verso', 1, true).opacite).toBe(1);
  });
});
