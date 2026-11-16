import { formaterDateDuJour, formaterTrancheAge } from '../formatage/date';

describe('formaterDateDuJour', () => {
  it('écrit le jour et le mois en français', () => {
    expect(formaterDateDuJour(new Date(2026, 3, 15))).toBe('Mercredi 15 avril');
    expect(formaterDateDuJour(new Date(2026, 10, 16, 23, 59))).toBe('Lundi 16 novembre');
  });

  it('écrit « 1er » pour le premier du mois', () => {
    expect(formaterDateDuJour(new Date(2026, 11, 1))).toBe('Mardi 1er décembre');
  });

  it('accentue les mois qui le demandent', () => {
    expect(formaterDateDuJour(new Date(2026, 1, 3))).toBe('Mardi 3 février');
    expect(formaterDateDuJour(new Date(2026, 7, 9))).toBe('Dimanche 9 août');
  });
});

describe('formaterTrancheAge', () => {
  const nb = '\u00a0';

  it('écrit la tranche avec un tiret demi-cadratin et des espaces insécables', () => {
    expect(formaterTrancheAge(7, 10)).toBe(`7${nb}–${nb}10${nb}ans`);
  });

  it('écrit un seul âge quand les bornes sont égales', () => {
    expect(formaterTrancheAge(6, 6)).toBe(`6${nb}ans`);
  });
});
