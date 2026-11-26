import AsyncStorage from '@react-native-async-storage/async-storage';
import { MODE_AUTOMATIQUE, ModeThemeSchema, type ModeTheme } from '@animpartner/shared';

export const CLE_MODE_THEME = 'animpartner:mode-theme';

/** Lit le mode mémorisé ; toute valeur absente ou invalide donne l'automatique. */
export async function lireModeTheme(): Promise<ModeTheme> {
  try {
    const brut = await AsyncStorage.getItem(CLE_MODE_THEME);
    if (brut === null) return MODE_AUTOMATIQUE;
    const lu = ModeThemeSchema.safeParse(JSON.parse(brut));
    return lu.success ? lu.data : MODE_AUTOMATIQUE;
  } catch {
    return MODE_AUTOMATIQUE;
  }
}

export async function ecrireModeTheme(mode: ModeTheme): Promise<void> {
  await AsyncStorage.setItem(CLE_MODE_THEME, JSON.stringify(mode));
}
