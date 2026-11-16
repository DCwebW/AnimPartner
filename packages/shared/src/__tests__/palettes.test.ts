import { CLES_PALETTE, PALETTES, type CleTheme } from '../themes/palettes';

const THEMES: CleTheme[] = ['beauTemps', 'nuit', 'hiver', 'automne'];
const COULEUR = /^(#[0-9A-F]{6}|rgba\(\d{1,3}, \d{1,3}, \d{1,3}, (0|1|0?\.\d+)\))$/;

describe('palettes', () => {
  it('couvre les quatre thèmes du MVP', () => {
    expect(Object.keys(PALETTES).sort()).toEqual([...THEMES].sort());
  });

  it.each(THEMES)('%s a toutes ses clés, et rien de plus', (cle) => {
    expect(Object.keys(PALETTES[cle])).toEqual([...CLES_PALETTE]);
  });

  it.each(THEMES)('%s ne contient que des couleurs et des opacités valides', (cle) => {
    for (const [nom, valeur] of Object.entries(PALETTES[cle])) {
      if (typeof valeur === 'number') {
        expect({ nom, valide: valeur >= 0 && valeur <= 1 }).toEqual({ nom, valide: true });
      } else if (!['key', 'salut', 'icone'].includes(nom)) {
        expect({ nom, valeur, valide: COULEUR.test(valeur) }).toEqual({
          nom,
          valeur,
          valide: true,
        });
      }
    }
  });

  it('reprend les valeurs clés du thème beau temps', () => {
    expect(PALETTES.beauTemps).toMatchObject({
      fond_scene: '#CFE9F4',
      feuille: '#FEF3D4',
      recto: '#FFFFFF',
      verso: '#FBD23E',
      bouton: '#0E6E99',
      lien: '#0E5A7D',
      salut: 'Bonjour',
    });
    expect(PALETTES.nuit.salut).toBe('Bonsoir');
  });
});
