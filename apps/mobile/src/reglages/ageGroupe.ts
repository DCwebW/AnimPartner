import AsyncStorage from '@react-native-async-storage/async-storage';
import { AgeGroupeSchema, type AgeGroupe } from '@animpartner/shared';

export const CLE_AGE_GROUPE = 'animpartner:age-groupe';

/** Lit l'âge mémorisé ; toute valeur absente, illisible ou refusée donne `null` (tous âges). */
export async function lireAgeGroupe(): Promise<AgeGroupe> {
  try {
    const brut = await AsyncStorage.getItem(CLE_AGE_GROUPE);
    if (brut === null) return null;
    const lu = AgeGroupeSchema.safeParse(JSON.parse(brut));
    return lu.success ? lu.data : null;
  } catch {
    return null;
  }
}

export async function ecrireAgeGroupe(age: AgeGroupe): Promise<void> {
  await AsyncStorage.setItem(CLE_AGE_GROUPE, JSON.stringify(age));
}
