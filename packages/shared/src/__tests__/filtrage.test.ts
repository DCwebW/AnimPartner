import { AgeGroupeSchema, enigmesPourAge } from '../enigmes/filtrage';
import type { Enigme } from '../enigmes/schema';

const base = {
  question: 'Q ?',
  reponse: 'R',
  explication: 'E.',
  statut: 'validee',
  source: 'manuelle',
  creeePar: 'porteur',
} as const;

const enigmes: Enigme[] = [
  { ...base, id: 'a', ageMin: 3, ageMax: 6 },
  { ...base, id: 'b', ageMin: 6, ageMax: 9 },
  { ...base, id: 'c', ageMin: 8, ageMax: 12 },
];

describe('enigmesPourAge', () => {
  it('renvoie tout sans âge', () => {
    expect(enigmesPourAge(enigmes, null)).toEqual(enigmes);
  });

  it('inclut les bornes et garde l’ordre', () => {
    expect(enigmesPourAge(enigmes, 6).map((e) => e.id)).toEqual(['a', 'b']);
    expect(enigmesPourAge(enigmes, 9).map((e) => e.id)).toEqual(['b', 'c']);
    expect(enigmesPourAge(enigmes, 3).map((e) => e.id)).toEqual(['a']);
    expect(enigmesPourAge(enigmes, 12).map((e) => e.id)).toEqual(['c']);
  });

  it('renvoie une liste vide hors de toute tranche', () => {
    expect(enigmesPourAge(enigmes, 15)).toEqual([]);
  });
});

describe('AgeGroupeSchema', () => {
  it('accepte 3, 12 et null', () => {
    for (const v of [3, 12, null]) expect(AgeGroupeSchema.safeParse(v).success).toBe(true);
  });

  it('refuse le reste', () => {
    for (const v of [2, 13, 7.5, '7', undefined]) {
      expect(AgeGroupeSchema.safeParse(v).success).toBe(false);
    }
  });
});
