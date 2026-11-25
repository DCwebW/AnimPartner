import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { CLES_PALETTE, PALETTES, type CleTheme } from '../themes/palettes';

const THEMES: CleTheme[] = ['beauTemps', 'nuit', 'hiver', 'automne', 'noel', 'jourAn'];
const COULEUR = /^(#[0-9A-F]{6}|rgba\(\d{1,3}, \d{1,3}, \d{1,3}, (0|1|0?\.\d+)\))$/;

describe('palettes', () => {
  it('couvre les quatre thèmes du MVP et les fêtes', () => {
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

  it('reprend palette.json de la proposition 01-noel', () => {
    const json = JSON.parse(
      readFileSync(join(__dirname, '../../../../design/propositions/01-noel/palette.json'), 'utf8'),
    );
    for (const cle of CLES_PALETTE)
      expect({ cle, v: PALETTES.noel[cle] }).toEqual({ cle, v: json[cle] });
  });

  it('reprend palette.json de la proposition 02-jour-de-l-an', () => {
    const json = JSON.parse(
      readFileSync(
        join(__dirname, '../../../../design/propositions/02-jour-de-l-an/palette.json'),
        'utf8',
      ),
    );
    for (const cle of CLES_PALETTE)
      expect({ cle, v: PALETTES.jourAn[cle] }).toEqual({ cle, v: json[cle] });
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
