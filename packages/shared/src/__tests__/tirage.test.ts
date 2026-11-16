import { creerTirage, melanger, type Aleatoire } from '../enigmes/tirage';

/** Générateur pseudo-aléatoire à graine (LCG), pour des tirages reproductibles. */
function graine(depart: number): Aleatoire {
  let etat = depart >>> 0;
  return () => {
    etat = (Math.imul(etat, 1664525) + 1013904223) >>> 0;
    return etat / 2 ** 32;
  };
}

const lettres = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

describe('melanger', () => {
  it('garde tous les éléments, sans toucher au tableau de départ', () => {
    const copie = [...lettres];
    const melange = melanger(lettres, graine(1));
    expect([...melange].sort()).toEqual([...lettres].sort());
    expect(lettres).toEqual(copie);
  });

  it('est déterministe pour un même générateur', () => {
    expect(melanger(lettres, graine(42))).toEqual(melanger(lettres, graine(42)));
  });
});

describe('creerTirage', () => {
  it('tire N éléments tous différents sur N tirages', () => {
    const tirer = creerTirage(lettres, graine(7));
    const tires = lettres.map(() => tirer());
    expect(new Set(tires).size).toBe(lettres.length);
  });

  it('ne remontre aucun élément avant que tous les autres soient passés, sac après sac', () => {
    const tirer = creerTirage(lettres, graine(3));
    for (let sac = 0; sac < 50; sac++) {
      const tires = lettres.map(() => tirer());
      expect(new Set(tires).size).toBe(lettres.length);
    }
  });

  it("n'enchaîne jamais deux fois le même élément au passage d'un sac au suivant", () => {
    for (let essai = 0; essai < 200; essai++) {
      const tirer = creerTirage(['a', 'b', 'c'], graine(essai));
      let precedent = tirer();
      for (let i = 0; i < 30; i++) {
        const suivant = tirer();
        expect(suivant).not.toBe(precedent);
        precedent = suivant;
      }
    }
  });

  it('fonctionne avec deux éléments : ils alternent', () => {
    const tirer = creerTirage(['a', 'b'], graine(11));
    const tires = Array.from({ length: 10 }, () => tirer());
    for (let i = 1; i < tires.length; i++) expect(tires[i]).not.toBe(tires[i - 1]);
  });

  it('renvoie toujours le seul élément d’un catalogue d’une énigme, sans erreur', () => {
    const tirer = creerTirage(['seule'], graine(5));
    expect([tirer(), tirer(), tirer()]).toEqual(['seule', 'seule', 'seule']);
  });

  it('refuse explicitement un catalogue vide', () => {
    expect(() => creerTirage([], graine(1))).toThrow('catalogue est vide');
  });

  it('utilise Math.random par défaut', () => {
    const tirer = creerTirage(lettres);
    expect(lettres).toContain(tirer());
  });
});
