import { PALETTES } from '../themes/palettes';
import { ModeThemeSchema, THEMES_AU_CHOIX, themeAffiche, themeDuJour } from '../themes/modeTheme';
import { salutationDuMoment, themeDuMoment } from '../themes/themeDuMoment';

const d = (mois: number, jour: number, h = 12) => new Date(2026, mois - 1, jour, h, 0);

describe('ModeThemeSchema', () => {
  it('accepte les trois formes', () => {
    expect(ModeThemeSchema.safeParse({ mode: 'automatique' }).success).toBe(true);
    expect(ModeThemeSchema.safeParse({ mode: 'aleatoire' }).success).toBe(true);
    expect(ModeThemeSchema.safeParse({ mode: 'fixe', theme: 'noel' }).success).toBe(true);
  });

  it('refuse le reste', () => {
    for (const v of [
      { mode: 'fixe' },
      { mode: 'fixe', theme: 'plage' },
      { mode: 'hasard' },
      null,
      'automatique',
    ]) {
      expect(ModeThemeSchema.safeParse(v).success).toBe(false);
    }
  });
});

describe('THEMES_AU_CHOIX', () => {
  it('liste les thèmes sans nuit ni fêtes', () => {
    expect([...THEMES_AU_CHOIX]).toEqual(['beauTemps', 'hiver', 'automne']);
    for (const t of THEMES_AU_CHOIX) expect(Object.keys(PALETTES)).toContain(t);
  });
});

describe('themeDuJour', () => {
  it('donne le même thème toute la journée', () => {
    expect(themeDuJour(d(5, 10, 8))).toBe(themeDuJour(d(5, 10, 19)));
    expect(themeDuJour(d(5, 10, 0))).toBe(themeDuJour(d(5, 10, 23)));
  });

  it('ne répète jamais la veille, reste dans la liste et fait tourner tous les thèmes', () => {
    const n = THEMES_AU_CHOIX.length;
    const jours = Array.from({ length: 365 }, (_, i) => themeDuJour(new Date(2026, 0, 1 + i, 12)));
    jours.forEach((t, i) => {
      expect(THEMES_AU_CHOIX).toContain(t);
      if (i > 0) expect(t).not.toBe(jours[i - 1]);
    });
    for (let i = 0; i + 2 * n - 1 <= jours.length; i++) {
      expect(new Set(jours.slice(i, i + 2 * n - 1)).size).toBe(n);
    }
  });
});

describe('themeAffiche', () => {
  it('suit themeDuMoment en automatique', () => {
    for (const date of [d(12, 20), d(12, 27), d(7, 10), d(7, 10, 22)]) {
      expect(themeAffiche({ mode: 'automatique' }, date)).toBe(themeDuMoment(date));
    }
  });

  it('donne la nuit le soir en aléatoire, sans fête', () => {
    expect(themeAffiche({ mode: 'aleatoire' }, d(7, 10, 22))).toBe('nuit');
    expect(themeAffiche({ mode: 'aleatoire' }, d(7, 10, 6))).toBe('nuit');
    expect(themeAffiche({ mode: 'aleatoire' }, d(12, 20))).toBe(themeDuJour(d(12, 20)));
    expect(themeAffiche({ mode: 'aleatoire' }, d(12, 28))).not.toBe('jourAn');
  });

  it('affiche le thème fixe à toute heure', () => {
    expect(themeAffiche({ mode: 'fixe', theme: 'noel' }, d(7, 10))).toBe('noel');
    expect(themeAffiche({ mode: 'fixe', theme: 'noel' }, d(7, 10, 23))).toBe('noel');
    expect(themeAffiche({ mode: 'fixe', theme: 'beauTemps' }, d(7, 10, 23))).toBe('beauTemps');
  });

  it('laisse la salutation suivre l’heure', () => {
    expect(salutationDuMoment(d(7, 10, 22))).toBe('Bonsoir');
    expect(salutationDuMoment(d(7, 10, 12))).toBe('Bonjour');
  });
});
