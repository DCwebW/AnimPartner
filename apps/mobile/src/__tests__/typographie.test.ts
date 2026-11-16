import { lierQuestion, taillesExplication, taillesQuestion } from '@/enigmes/typographie';

describe('taille de la question', () => {
  it('garde la taille de la maquette pour une question courte', () => {
    expect(taillesQuestion('a'.repeat(90))).toEqual({ fontSize: 23, lineHeight: 31 });
  });

  it('resserre le texte pour une question de 140 caractères', () => {
    const tailles = taillesQuestion('a'.repeat(140));
    expect(tailles.fontSize).toBeLessThan(23);
    expect(tailles.lineHeight).toBeLessThan(31);
  });
});

describe('taille de texte agrandie dans le système', () => {
  it('laisse grandir une question courte', () => {
    const { fontSize } = taillesQuestion('a'.repeat(40), 1.3);
    expect(fontSize).toBe(23);
  });

  it('garde une question de 140 caractères dans le budget de la maquette', () => {
    for (const echelle of [1, 1.15, 1.3, 2]) {
      const { fontSize } = taillesQuestion('a'.repeat(140), echelle);
      expect(fontSize * echelle).toBeLessThanOrEqual(19);
    }
  });

  it('garde une explication de 140 caractères dans le budget de la maquette', () => {
    expect(taillesExplication('a'.repeat(90))).toEqual({ fontSize: 15, lineHeight: 22 });
    for (const echelle of [1, 1.3, 2]) {
      const { fontSize } = taillesExplication('a'.repeat(140), echelle);
      expect(fontSize * echelle).toBeLessThanOrEqual(15);
    }
  });
});

describe('lierQuestion', () => {
  it('garde « Qui suis-je ? » sur une seule ligne', () => {
    expect(lierQuestion('Je cours. Qui suis-je\u00a0?')).toBe(
      'Je cours. Qui\u00a0suis-\u2060je\u00a0?',
    );
  });

  it('ne sépare pas un pronom inversé de son verbe', () => {
    expect(lierQuestion('Que vois-tu, et que fait-il\u00a0?')).toBe(
      'Que vois-\u2060tu, et que fait-\u2060il\u00a0?',
    );
  });

  it('laisse les autres traits d’union tranquilles', () => {
    expect(lierQuestion('Un arc-en-ciel')).toBe('Un arc-en-ciel');
  });
});
