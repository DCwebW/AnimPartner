// Mise en forme du texte de l'étiquette, sans React.

export type TaillesTexte = { fontSize: number; lineHeight: number };

// L'étiquette a une hauteur fixe. Un texte y tient tant que « longueur × taille² » reste
// sous un budget, mesuré sur les cas limites : une question de 140 caractères en 19 px,
// une explication de 140 caractères en 15 px (la maquette : 23 px pour ~90 caractères).
const QUESTION = { max: 23, interligne: 31 / 23, budget: 140 * 19 * 19 };
const EXPLICATION = { max: 15, interligne: 22 / 15, budget: 140 * 15 * 15 };

function tailles(
  texte: string,
  echelleTexte: number,
  { max, interligne, budget }: { max: number; interligne: number; budget: number },
): TaillesTexte {
  // Taille rendue = fontSize × échelle du texte du système : on la garde sous le budget.
  const tailleRendueMax = Math.sqrt(budget / Math.max(texte.length, 1));
  const fontSize = Math.min(max, tailleRendueMax / Math.max(echelleTexte, 1));
  const arrondie = Math.floor(fontSize * 2) / 2;
  return { fontSize: arrondie, lineHeight: Math.round(arrondie * interligne) };
}

/**
 * Taille de la question selon sa longueur et la taille de texte choisie dans le système
 * (`fontScale`), pour qu'une énigme de 140 caractères tienne sans être coupée.
 */
export function taillesQuestion(question: string, echelleTexte = 1): TaillesTexte {
  return tailles(question, echelleTexte, QUESTION);
}

/** Taille de l'explication, au verso, selon les mêmes règles. */
export function taillesExplication(explication: string, echelleTexte = 1): TaillesTexte {
  return tailles(explication, echelleTexte, EXPLICATION);
}

const INSECABLE = '\u00a0';
/** Gluon de mots : invisible, il interdit la coupure de ligne à cet endroit. */
const GLUON = '\u2060';

/**
 * Empêche les coupures malvenues, comme les maquettes : « Qui suis-je ? » reste sur une
 * ligne, et un pronom inversé ne se sépare jamais de son verbe (« suis-/je »).
 */
export function lierQuestion(question: string): string {
  return question
    .replace(/Qui suis-je/g, `Qui${INSECABLE}suis-je`)
    .replace(/-(je|tu|il|elle|on|nous|vous|ils|elles|ce|t-il|t-elle)\b/g, `-${GLUON}$1`);
}
