/** Nombre d'énigmes gardées pour revenir en arrière. */
export const HISTORIQUE_MAX = 50;

/**
 * Les énigmes vues pendant la session, en mémoire seulement, et la position courante.
 * Immuable : chaque opération renvoie un nouvel historique.
 */
export type Historique<T> = {
  readonly elements: readonly T[];
  readonly position: number;
};

export function creerHistorique<T>(premier: T): Historique<T> {
  return { elements: [premier], position: 0 };
}

export function courant<T>(h: Historique<T>): T {
  return h.elements[h.position] as T;
}

export function peutReculer<T>(h: Historique<T>): boolean {
  return h.position > 0;
}

/**
 * Énigme suivante : celle qu'on avait déjà vue après un retour en arrière, sinon une
 * nouvelle, tirée et ajoutée. Au-delà de `HISTORIQUE_MAX`, la plus ancienne est oubliée.
 */
export function avancer<T>(h: Historique<T>, tirer: () => T): Historique<T> {
  if (h.position < h.elements.length - 1) {
    return { elements: h.elements, position: h.position + 1 };
  }
  const elements = [...h.elements, tirer()].slice(-HISTORIQUE_MAX);
  return { elements, position: elements.length - 1 };
}

/** Énigme précédente ; au début de l'historique, le même historique, inchangé. */
export function reculer<T>(h: Historique<T>): Historique<T> {
  if (!peutReculer(h)) return h;
  return { elements: h.elements, position: h.position - 1 };
}
