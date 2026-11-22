import {
  aller,
  BALANCE_DEGRES,
  BOULES,
  CONFETTIS,
  CONFETTIS_COUCHE,
  ETOILE,
  FANIONS,
  LUEUR,
  phaseDepart,
} from '@/bandeaux/noel';

describe('tables du bandeau de Noël (planche 01-noel)', () => {
  it('reprend les fanions : 6, durées 4,2 / 5,1 / 3,7 s et délais 0 / −1,3 / −2,4 s', () => {
    expect(FANIONS).toHaveLength(6);
    expect(FANIONS.map((f) => [f.duree, f.delai])).toEqual([
      [4.2, 0],
      [5.1, -1.3],
      [3.7, -2.4],
      [4.2, 0],
      [5.1, -1.3],
      [3.7, -2.4],
    ]);
    expect(BALANCE_DEGRES).toBe(5);
  });

  it('reprend les boules : 7, durées 2,6 / 3,4 / 2,1 s, lueur 1 → 0,45 et échelle 0,82', () => {
    expect(BOULES).toHaveLength(7);
    expect(new Set(BOULES.map((b) => [b.duree, b.delai].join()))).toEqual(
      new Set(['2.6,0', '3.4,-1', '2.1,-1.7']),
    );
    expect(LUEUR).toMatchObject({ opaciteFin: 0.45, echelleFin: 0.82 });
  });

  it('reprend l’étoile et les confettis', () => {
    expect(ETOILE).toMatchObject({ duree: 3.2, opaciteFin: 0.7, echelleFin: 1.18, degres: 6 });
    expect(CONFETTIS).toEqual({ distance: 200, duree: 16 });
    expect(CONFETTIS_COUCHE).toHaveLength(12);
  });
});

describe('phaseDepart', () => {
  it('un délai négatif devient une phase de départ sur le cycle complet', () => {
    expect(phaseDepart(-1.3, 10.2)).toBeCloseTo(1.3 / 10.2);
    expect(phaseDepart(-12, 10)).toBeCloseTo(0.2);
  });

  it('un délai nul ou positif démarre au début', () => {
    expect(phaseDepart(0, 10)).toBe(0);
    expect(phaseDepart(2, 10)).toBe(0);
  });
});

describe('aller', () => {
  it('monte de 0 à 1 puis redescend, pour une boucle alternée', () => {
    expect([0, 0.25, 0.5, 0.75, 1].map(aller)).toEqual([0, 0.5, 1, 0.5, 0]);
  });
});
