import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { CATALOGUE } from '../enigmes/catalogue';
import { reponsesRefuseesReprises } from '../enigmes/controles';
import { EnigmeRefuseeSchema, RefuseesSchema, type EnigmeRefusee } from '../enigmes/schema';

// Le fichier est relu tel quel : c'est ce que lit l'agent des énigmes avant d'écrire.
const brut: unknown = JSON.parse(
  readFileSync(resolve(__dirname, '../enigmes/refusees.json'), 'utf8'),
);

const refusee: EnigmeRefusee = {
  id: 'etre-humain',
  question:
    'Qui marche à quatre pattes le matin, sur deux jambes à midi et sur trois le soir\u00a0?',
  reponse: "L'être humain",
  raison: 'Trop connue pour être crédible dans l’application.',
  refuseeLe: '2026-11-17',
};

describe('schéma EnigmeRefusee', () => {
  it('accepte une énigme refusée complète', () => {
    expect(EnigmeRefuseeSchema.safeParse(refusee).success).toBe(true);
  });

  it('exige une raison, car c’est elle qui apprend à l’agent ce qu’il ne doit plus faire', () => {
    expect(EnigmeRefuseeSchema.safeParse({ ...refusee, raison: ' ' }).success).toBe(false);
    const { raison: _raison, ...sansRaison } = refusee;
    expect(EnigmeRefuseeSchema.safeParse(sansRaison).success).toBe(false);
  });

  it('refuse une date mal formée, un id mal formé ou un champ inconnu', () => {
    expect(EnigmeRefuseeSchema.safeParse({ ...refusee, refuseeLe: '17/11/2026' }).success).toBe(
      false,
    );
    expect(EnigmeRefuseeSchema.safeParse({ ...refusee, id: 'Être Humain' }).success).toBe(false);
    expect(EnigmeRefuseeSchema.safeParse({ ...refusee, indice: 'x' }).success).toBe(false);
  });
});

describe('reponsesRefuseesReprises', () => {
  const enigme = CATALOGUE[0]!;

  it('signale une énigme du catalogue dont la réponse a déjà été refusée, aux articles et accents près', () => {
    const reprise = { ...enigme, id: 'sphinx', reponse: 'Les êtres humains' };
    expect(reponsesRefuseesReprises([reprise], [refusee])).toEqual([
      { id: 'sphinx', refusee: 'etre-humain' },
    ]);
  });

  it('ne signale rien quand aucune réponse refusée ne revient', () => {
    expect(reponsesRefuseesReprises([enigme], [refusee])).toEqual([]);
  });
});

describe('fichier des énigmes refusées', () => {
  it('passe entièrement le schéma', () => {
    expect(RefuseesSchema.safeParse(brut).success).toBe(true);
  });

  const refusees = RefuseesSchema.parse(brut);

  it('a des id uniques', () => {
    const ids = refusees.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('garde les refus de la recette : le Sphinx, l’avenir et la soustraction de 5 dans 25', () => {
    expect(refusees.map((e) => e.id)).toEqual(
      expect.arrayContaining(['etre-humain', 'avenir', 'cinq-de-vingt-cinq']),
    );
  });

  it('ne laisse revenir au catalogue aucune réponse déjà refusée', () => {
    expect(reponsesRefuseesReprises(CATALOGUE, refusees)).toEqual([]);
  });
});
