import { PRENOM_MAX, PrenomSchema, nettoyerPrenom, salutationAvecPrenom } from '../prenom';

describe('nettoyerPrenom', () => {
  it('retire les espaces autour', () => {
    expect(nettoyerPrenom('  Léa \n')).toBe('Léa');
  });
  it('tronque à 30 caractères', () => {
    expect(nettoyerPrenom('a'.repeat(45))).toHaveLength(PRENOM_MAX);
  });
  it('renvoie une chaîne vide pour des espaces seuls', () => {
    expect(nettoyerPrenom('   ')).toBe('');
  });
});

describe('PrenomSchema', () => {
  it('accepte un prénom ou null, refuse le reste', () => {
    expect(PrenomSchema.safeParse('Léa').success).toBe(true);
    expect(PrenomSchema.safeParse(null).success).toBe(true);
    expect(PrenomSchema.safeParse('').success).toBe(false);
    expect(PrenomSchema.safeParse('a'.repeat(31)).success).toBe(false);
    expect(PrenomSchema.safeParse(12).success).toBe(false);
  });
});

describe('salutationAvecPrenom', () => {
  it('ajoute le prénom', () => {
    expect(salutationAvecPrenom('Bonsoir', 'Camille')).toBe('Bonsoir, Camille');
  });
  it('garde la salutation seule sans prénom', () => {
    expect(salutationAvecPrenom('Bonjour', null)).toBe('Bonjour');
    expect(salutationAvecPrenom('Bonjour', undefined)).toBe('Bonjour');
  });
});
