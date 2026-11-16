import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { CATALOGUE, enigmesAffichables } from '../enigmes/catalogue';
import {
  CatalogueSchema,
  EXPLICATION_MAX,
  EnigmeSchema,
  QUESTION_MAX,
  REPONSE_MAX,
  type Enigme,
} from '../enigmes/schema';

// Le fichier est relu tel quel, sans passer par l'import : c'est ce que liront la CI et
// l'agent des énigmes.
const brut: unknown = JSON.parse(
  readFileSync(resolve(__dirname, '../enigmes/catalogue.json'), 'utf8'),
);

const exemple: Enigme = {
  id: 'exemple',
  question: 'Qui suis-je\u00a0?',
  reponse: 'Un exemple',
  explication: "C'est un exemple.",
  ageMin: 6,
  ageMax: 9,
  statut: 'validee',
  source: 'manuelle',
  creeePar: 'porteur',
  valideePar: 'porteur',
};

describe('schéma Enigme', () => {
  it('accepte une énigme complète', () => {
    expect(EnigmeSchema.safeParse(exemple).success).toBe(true);
  });

  it('accepte une question de 140 caractères', () => {
    const question = 'a'.repeat(QUESTION_MAX);
    expect(EnigmeSchema.safeParse({ ...exemple, question }).success).toBe(true);
  });

  it('refuse une question de 141 caractères', () => {
    const question = 'a'.repeat(QUESTION_MAX + 1);
    expect(EnigmeSchema.safeParse({ ...exemple, question }).success).toBe(false);
  });

  it('compte les espaces finales dans la longueur de la question', () => {
    const question = 'a'.repeat(QUESTION_MAX) + ' ';
    expect(EnigmeSchema.safeParse({ ...exemple, question }).success).toBe(false);
  });

  it('plafonne la réponse et l’explication pour qu’elles tiennent au verso', () => {
    const reponse = 'a'.repeat(REPONSE_MAX + 1);
    const explication = 'a'.repeat(EXPLICATION_MAX + 1);
    expect(EnigmeSchema.safeParse({ ...exemple, reponse }).success).toBe(false);
    expect(EnigmeSchema.safeParse({ ...exemple, explication }).success).toBe(false);
  });

  it('rend valideePar facultatif', () => {
    const { valideePar: _ignore, ...sansValidation } = exemple;
    expect(EnigmeSchema.safeParse({ ...sansValidation, statut: 'draft' }).success).toBe(true);
  });

  it('refuse un statut, une source ou une tranche d’âge incohérents', () => {
    expect(EnigmeSchema.safeParse({ ...exemple, statut: 'publiee' }).success).toBe(false);
    expect(EnigmeSchema.safeParse({ ...exemple, source: 'inconnue' }).success).toBe(false);
    expect(EnigmeSchema.safeParse({ ...exemple, ageMin: 10, ageMax: 7 }).success).toBe(false);
  });

  it('refuse un champ inconnu ou un id mal formé', () => {
    expect(EnigmeSchema.safeParse({ ...exemple, indice: 'x' }).success).toBe(false);
    expect(EnigmeSchema.safeParse({ ...exemple, id: 'Une Énigme' }).success).toBe(false);
  });
});

describe('enigmesAffichables', () => {
  it("n'affiche jamais une énigme draft", () => {
    const draft: Enigme = { ...exemple, id: 'brouillon', statut: 'draft' };
    expect(enigmesAffichables([exemple, draft])).toEqual([exemple]);
  });
});

describe('catalogue.json', () => {
  it('passe entièrement le schéma', () => {
    const resultat = CatalogueSchema.safeParse(brut);
    expect(resultat.error?.issues ?? []).toEqual([]);
  });

  it('compte une vingtaine d’énigmes validées', () => {
    expect(enigmesAffichables(CATALOGUE).length).toBeGreaterThanOrEqual(20);
  });

  it('a des id uniques', () => {
    const ids = CATALOGUE.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('a des réponses toutes différentes', () => {
    const reponses = CATALOGUE.map((e) => e.reponse.toLocaleLowerCase('fr'));
    expect(new Set(reponses).size).toBe(reponses.length);
  });

  it('respecte la typographie française : espace insécable avant ? ! : ; et dans « »', () => {
    for (const { id, question, reponse, explication } of CATALOGUE) {
      for (const texte of [question, reponse, explication]) {
        expect({
          id,
          texte,
          fautif: /«[^\u00a0\u202f]|[^\u00a0\u202f]»|[^\u00a0\u202f][?!:;]| [?!:;]|« | »/.test(
            texte,
          ),
        }).toEqual({
          id,
          texte,
          fautif: false,
        });
      }
    }
  });

  it('garde les quatre énigmes des maquettes, saisies par le porteur', () => {
    const reponses = CATALOGUE.map((e) => e.reponse);
    expect(reponses).toEqual(
      expect.arrayContaining(['La rivière', 'Le noir', 'Le flocon de neige', "La feuille d'arbre"]),
    );
    const initiales = CATALOGUE.filter((e) => e.source === 'manuelle');
    for (const e of initiales) {
      expect(e.creeePar).toBe('porteur');
      expect(e.valideePar).toBe('porteur');
    }
  });
});
