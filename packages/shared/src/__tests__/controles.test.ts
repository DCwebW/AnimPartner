import {
  agesSousCouverts,
  cleReponse,
  couvertureParAge,
  doublonsDeReponse,
} from '../enigmes/controles';
import type { Enigme } from '../enigmes/schema';

function enigme(id: string, reponse: string, ageMin = 6, ageMax = 9): Enigme {
  return {
    id,
    question: 'Qui suis-je ?',
    reponse,
    explication: "C'est un exemple.",
    ageMin,
    ageMax,
    statut: 'validee',
    source: 'manuelle',
    creeePar: 'porteur',
    valideePar: 'porteur',
  };
}

describe('cleReponse', () => {
  it('ignore la casse, les accents et les ligatures', () => {
    expect(cleReponse("L'Écho")).toBe(cleReponse('echo'));
    expect(cleReponse("L'œuf")).toBe(cleReponse('oeuf'));
  });

  it('retire le déterminant de tête, avec ou sans apostrophe typographique', () => {
    for (const forme of ['Le soleil', 'Soleil', 'Un soleil', 'Ton soleil', 'du soleil']) {
      expect(cleReponse(forme)).toBe('soleil');
    }
    expect(cleReponse('L’ombre')).toBe(cleReponse('Ton ombre'));
    expect(cleReponse("De l'eau")).toBe('eau');
    expect(cleReponse('De la neige')).toBe('neige');
  });

  it('confond le singulier et le pluriel', () => {
    expect(cleReponse('Les chaussettes')).toBe(cleReponse('La chaussette'));
    expect(cleReponse('Les feux')).toBe(cleReponse('Le feu'));
  });

  it('garde ce qui distingue vraiment deux réponses', () => {
    expect(cleReponse('La lettre N')).not.toBe(cleReponse('La lettre M'));
    expect(cleReponse('La feuille d’arbre')).not.toBe(cleReponse('La feuille de papier'));
  });

  it('ne retire pas un mot qui ressemble à un déterminant au milieu', () => {
    expect(cleReponse('La lettre L')).toBe('lettre l');
  });
});

describe('doublonsDeReponse', () => {
  it('ne signale rien quand les réponses diffèrent', () => {
    expect(doublonsDeReponse([enigme('a', 'Le soleil'), enigme('b', 'La lune')])).toEqual([]);
  });

  it('regroupe les énigmes dont la réponse est la même une fois normalisée', () => {
    const catalogue = [
      enigme('ombre', "L'ombre"),
      enigme('lune', 'La lune'),
      enigme('ton-ombre', 'Ton ombre'),
      enigme('ombres', 'Les ombres'),
    ];
    expect(doublonsDeReponse(catalogue)).toEqual([
      { cle: 'ombre', ids: ['ombre', 'ton-ombre', 'ombres'] },
    ]);
  });
});

describe('couvertureParAge', () => {
  it('compte, pour chaque âge, les énigmes dont la tranche le contient', () => {
    const catalogue = [enigme('a', 'A', 3, 5), enigme('b', 'B', 5, 7)];
    expect(couvertureParAge(catalogue, 3, 7)).toEqual([
      { age: 3, nombre: 1 },
      { age: 4, nombre: 1 },
      { age: 5, nombre: 2 },
      { age: 6, nombre: 1 },
      { age: 7, nombre: 1 },
    ]);
  });
});

describe('agesSousCouverts', () => {
  it('liste les âges couverts par moins que la part demandée du catalogue', () => {
    // 10 énigmes, part de 20 % : il en faut 2 par âge.
    const catalogue = [
      ...Array.from({ length: 9 }, (_, i) => enigme(`m${i}`, `M${i}`, 5, 6)),
      enigme('p', 'P', 4, 5),
    ];
    expect(agesSousCouverts(catalogue, 0.2, 4, 6)).toEqual([{ age: 4, nombre: 1, minimum: 2 }]);
  });

  it('arrondit le minimum au-dessus', () => {
    // 7 énigmes à 15 % : 1,05, donc 2.
    const catalogue = [
      ...Array.from({ length: 6 }, (_, i) => enigme(`m${i}`, `M${i}`, 6, 6)),
      enigme('g', 'G', 6, 7),
    ];
    expect(agesSousCouverts(catalogue, 0.15, 6, 7)).toEqual([{ age: 7, nombre: 1, minimum: 2 }]);
  });
});
