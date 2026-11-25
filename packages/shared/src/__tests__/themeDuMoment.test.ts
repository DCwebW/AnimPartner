import { salutationDuMoment, themeDuMoment } from '../themes/themeDuMoment';

const d = (mois: number, jour: number, h = 12, min = 0) => new Date(2026, mois - 1, jour, h, min);

describe('themeDuMoment', () => {
  it('bascule à 20 h 00 et à 7 h 00', () => {
    expect(themeDuMoment(d(5, 10, 19, 59))).toBe('beauTemps');
    expect(themeDuMoment(d(5, 10, 20, 0))).toBe('nuit');
    expect(themeDuMoment(d(5, 10, 6, 59))).toBe('nuit');
    expect(themeDuMoment(d(5, 10, 7, 0))).toBe('beauTemps');
  });

  it('passe de l’automne à Noël le 1er décembre, puis au Jour de l’an le 27', () => {
    expect(themeDuMoment(d(11, 30))).toBe('automne');
    expect(themeDuMoment(d(12, 1))).toBe('noel');
    expect(themeDuMoment(d(12, 27))).toBe('jourAn');
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

describe('Noël', () => {
  it('s’affiche du 1er au 26 décembre en journée', () => {
    expect(themeDuMoment(d(11, 30))).toBe('automne');
    expect(themeDuMoment(d(12, 1))).toBe('noel');
    expect(themeDuMoment(d(12, 26))).toBe('noel');
    expect(themeDuMoment(d(12, 27))).toBe('jourAn');
  });

  it('cède à la nuit : la nuit du 15 décembre garde son bandeau', () => {
    expect(themeDuMoment(d(12, 15, 22, 0))).toBe('nuit');
    expect(themeDuMoment(d(12, 15, 6, 59))).toBe('nuit');
    expect(themeDuMoment(d(12, 15, 7, 0))).toBe('noel');
  });

  it('ne change pas la salutation : « Bonjour » le jour, « Bonsoir » la nuit', () => {
    expect(salutationDuMoment(d(12, 15, 12))).toBe('Bonjour');
    expect(salutationDuMoment(d(12, 15, 22))).toBe('Bonsoir');
  });
});

describe('Jour de l’an', () => {
  it('s’affiche du 27 décembre au 3 janvier en journée', () => {
    expect(themeDuMoment(d(12, 26))).toBe('noel');
    expect(themeDuMoment(d(12, 27))).toBe('jourAn');
    expect(themeDuMoment(d(12, 31))).toBe('jourAn');
    expect(themeDuMoment(d(1, 1))).toBe('jourAn');
    expect(themeDuMoment(d(1, 3))).toBe('jourAn');
    expect(themeDuMoment(d(1, 3, 19, 59))).toBe('jourAn');
    expect(themeDuMoment(d(1, 4))).toBe('hiver');
  });

  it('cède à la nuit : la nuit du 31 décembre garde son bandeau', () => {
    expect(themeDuMoment(d(12, 31, 22, 0))).toBe('nuit');
    expect(themeDuMoment(d(1, 1, 6, 59))).toBe('nuit');
    expect(themeDuMoment(d(1, 1, 7, 0))).toBe('jourAn');
    expect(themeDuMoment(d(1, 3, 20, 0))).toBe('nuit');
  });

  it('ne change pas la salutation', () => {
    expect(salutationDuMoment(d(12, 31, 12))).toBe('Bonjour');
    expect(salutationDuMoment(d(12, 31, 22))).toBe('Bonsoir');
  });
});

describe('salutationDuMoment', () => {
  it('dit « Bonsoir » avec le thème nuit, « Bonjour » sinon', () => {
    expect(salutationDuMoment(d(7, 14, 23))).toBe('Bonsoir');
    expect(salutationDuMoment(d(7, 14, 12))).toBe('Bonjour');
    expect(salutationDuMoment(d(12, 15, 6, 30))).toBe('Bonsoir');
  });
});
