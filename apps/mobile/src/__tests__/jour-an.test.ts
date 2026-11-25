import { aller } from '@/bandeaux/noel';
import {
  BALLONS,
  CONFETTIS,
  CONFETTIS_COUCHE,
  ETOILES,
  FEUX,
  HORLOGE,
  interpoler,
  FEU_ETAPES,
} from '@/bandeaux/jourAn';

describe('tables du bandeau du Jour de l’an (planche 02-jour-de-l-an)', () => {
  it('reprend les 3 feux d’artifice : 5 s, délais 0 / −1,7 / −3,3 s', () => {
    expect(FEUX).toHaveLength(3);
    expect(FEUX.map((f) => [f.duree, f.delai])).toEqual([
      [5, 0],
      [5, -1.7],
      [5, -3.3],
    ]);
    expect(FEUX.map((f) => [f.x, f.y])).toEqual([
      [70, 52],
      [300, 60],
      [185, 38],
    ]);
  });

  it('reprend les étapes de l’éclat : 0, 25, 60 et 100 %', () => {
    expect(FEU_ETAPES).toEqual([
      { t: 0, opacite: 0, echelle: 0.3 },
      { t: 0.25, opacite: 1, echelle: 1 },
      { t: 0.6, opacite: 0.8, echelle: 1.12 },
      { t: 1, opacite: 0, echelle: 1.25 },
    ]);
  });

  it('reprend les 5 étoiles : 2,4 s par défaut, 3,1 s (−1 s) et 2 s (−1,5 s)', () => {
    expect(ETOILES).toHaveLength(5);
    expect(ETOILES.map((e) => [e.duree, e.delai])).toEqual([
      [2.4, 0],
      [3.1, -1],
      [2, -1.5],
      [2.4, 0],
      [3.1, -1],
    ]);
  });

  it('reprend les 4 ballons : ±6°, 4 s / 5 s (−1,3 s) / 3,5 s (−2,4 s)', () => {
    expect(BALLONS).toHaveLength(4);
    expect(BALLONS.map((b) => [b.duree, b.delai])).toEqual([
      [4, 0],
      [5, -1.3],
      [4, 0],
      [3.5, -2.4],
    ]);
  });

  it('reprend l’horloge et les confettis', () => {
    expect(HORLOGE).toMatchObject({ x: 195, y: 100, duree: 3, echelleFin: 1.06 });
    expect(CONFETTIS).toEqual({ distance: 200, duree: 16 });
    expect(CONFETTIS_COUCHE).toHaveLength(12);
  });
});

describe('interpoler', () => {
  const lineaire = (u: number) => u;
  it('donne les valeurs des étapes et interpole entre elles', () => {
    expect(interpoler(FEU_ETAPES, 0, lineaire)).toEqual({ opacite: 0, echelle: 0.3 });
    expect(interpoler(FEU_ETAPES, 0.25, lineaire)).toEqual({ opacite: 1, echelle: 1 });
    const mi = interpoler(FEU_ETAPES, 0.125, lineaire);
    expect(mi.opacite).toBeCloseTo(0.5);
    expect(mi.echelle).toBeCloseTo(0.65);
    expect(interpoler(FEU_ETAPES, 1, lineaire)).toEqual({ opacite: 0, echelle: 1.25 });
  });

  it('applique la courbe à chaque intervalle', () => {
    const carre = (u: number) => u * u;
    expect(interpoler(FEU_ETAPES, 0.125, carre).opacite).toBeCloseTo(0.25);
  });

  it('aller reste celui de Noël', () => {
    expect(aller(0.5)).toBe(1);
  });
});
