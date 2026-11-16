/** Générateur aléatoire : un nombre dans [0, 1), comme `Math.random`. */
export type Aleatoire = () => number;

/** Mélange de Fisher–Yates. Renvoie une copie : le tableau de départ n'est pas touché. */
export function melanger<T>(elements: readonly T[], aleatoire: Aleatoire = Math.random): T[] {
  const copie = [...elements];
  for (let i = copie.length - 1; i > 0; i--) {
    const j = Math.floor(aleatoire() * (i + 1));
    [copie[i], copie[j]] = [copie[j] as T, copie[i] as T];
  }
  return copie;
}

/**
 * Crée un tirage « en sac » : chaque élément sort une fois avant que le sac ne soit
 * remélangé. Au passage d'un sac au suivant, le premier élément tiré n'est jamais le
 * dernier vu (sauf s'il n'y en a qu'un). Les éléments sont comparés par identité.
 */
export function creerTirage<T>(
  elements: readonly T[],
  aleatoire: Aleatoire = Math.random,
): () => T {
  if (elements.length === 0) {
    throw new Error('Le catalogue est vide : il n’y a rien à tirer.');
  }

  // Le prochain élément tiré est le dernier du sac.
  let sac: T[] = [];
  let dernier: T | undefined;

  return () => {
    if (sac.length === 0) {
      sac = melanger(elements, aleatoire);
      if (sac.length > 1 && sac[sac.length - 1] === dernier) {
        [sac[0], sac[sac.length - 1]] = [sac[sac.length - 1] as T, sac[0] as T];
      }
    }
    dernier = sac.pop() as T;
    return dernier;
  };
}
