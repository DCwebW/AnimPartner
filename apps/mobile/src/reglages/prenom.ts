import AsyncStorage from '@react-native-async-storage/async-storage';
import { PrenomSchema, nettoyerPrenom } from '@animpartner/shared';

export const CLE_PRENOM = 'animpartner:prenom';

/**
 * Ce qui est mémorisé : `null` si rien n'a jamais été enregistré (première ouverture),
 * sinon le prénom donné. Toute valeur illisible compte comme « rien enregistré ».
 */
export async function lirePrenom(): Promise<string | null> {
  try {
    const brut = await AsyncStorage.getItem(CLE_PRENOM);
    if (brut === null) return null;
    const lu = PrenomSchema.safeParse(JSON.parse(brut));
    return lu.success ? lu.data : null;
  } catch {
    return null;
  }
}

/** Enregistre le prénom nettoyé ; un prénom vide est refusé et ne change rien. */
export async function ecrirePrenom(saisi: string): Promise<string | null> {
  const prenom = nettoyerPrenom(saisi);
  if (prenom === '') return null;
  await AsyncStorage.setItem(CLE_PRENOM, JSON.stringify(prenom));
  return prenom;
}
