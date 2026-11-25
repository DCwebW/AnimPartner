import { PALETTES } from '../themes/palettes';

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
}

function rapport(a: string, b: string): number {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m);
  return (x! + 0.05) / (y! + 0.05);
}

describe.each([
  ['Noël', PALETTES.noel],
  ['Jour de l’an', PALETTES.jourAn],
])('contrastes du thème %s (4,5:1 au moins)', (_theme, p) => {
  it.each([
    ['encre / recto', p.encre, p.recto],
    ['recto_accent / recto', p.recto_accent, p.recto],
    ['puce_texte / puce_fond', p.puce_texte, p.puce_fond],
    ['verso_texte / verso', p.verso_texte, p.verso],
    ['verso_kicker / verso', p.verso_kicker, p.verso],
    ['verso_expl / verso', p.verso_expl, p.verso],
    ['bouton_texte / bouton', p.bouton_texte, p.bouton],
    ['lien / feuille', p.lien, p.feuille],
    ['encre / feuille', p.encre, p.feuille],
    ['encre2 / feuille', p.encre2, p.feuille],
  ])('%s', (_nom, a, b) => {
    expect(rapport(a, b)).toBeGreaterThanOrEqual(4.5);
  });
});
