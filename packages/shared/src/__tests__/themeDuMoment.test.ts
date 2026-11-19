import { salutationDuMoment, themeDuMoment } from '../themes/themeDuMoment';

const d = (mois: number, jour: number, h = 12, min = 0) => new Date(2026, mois - 1, jour, h, min);

describe('themeDuMoment', () => {
  it('bascule à 20 h 00 et à 7 h 00', () => {
    expect(themeDuMoment(d(5, 10, 19, 59))).toBe('beauTemps');
    expect(themeDuMoment(d(5, 10, 20, 0))).toBe('nuit');
    expect(themeDuMoment(d(5, 10, 6, 59))).toBe('nuit');
    expect(themeDuMoment(d(5, 10, 7, 0))).toBe('beauTemps');
  });

  it('passe de l’automne à l’hiver le 1er décembre', () => {
    expect(themeDuMoment(d(11, 30))).toBe('automne');
    expect(themeDuMoment(d(12, 1))).toBe('hiver');
  });

  it('passe de l’hiver au beau temps le 1er mars', () => {
    expect(themeDuMoment(d(2, 28))).toBe('hiver');
    expect(themeDuMoment(d(3, 1))).toBe('beauTemps');
  });

  it('couvre les saisons', () => {
    expect(themeDuMoment(d(1, 15))).toBe('hiver');
    expect(themeDuMoment(d(8, 15))).toBe('beauTemps');
    expect(themeDuMoment(d(9, 1))).toBe('automne');
  });

  it('donne la nuit en été, prioritaire sur la saison', () => {
    expect(themeDuMoment(d(7, 14, 23, 0))).toBe('nuit');
    expect(themeDuMoment(d(12, 15, 22, 0))).toBe('nuit');
  });
});

describe('salutationDuMoment', () => {
  it('dit « Bonsoir » avec le thème nuit, « Bonjour » sinon', () => {
    expect(salutationDuMoment(d(7, 14, 23))).toBe('Bonsoir');
    expect(salutationDuMoment(d(7, 14, 12))).toBe('Bonjour');
    expect(salutationDuMoment(d(12, 15, 6, 30))).toBe('Bonsoir');
  });
});
