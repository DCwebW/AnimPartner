// Polices du design system : Fraunces pour les titres et les énigmes, Nunito Sans pour le
// reste. Seules les graisses utilisées par les maquettes du MVP sont chargées.
import { Fraunces_600SemiBold } from '@expo-google-fonts/fraunces/600SemiBold';
import { Fraunces_700Bold } from '@expo-google-fonts/fraunces/700Bold';
import { NunitoSans_400Regular } from '@expo-google-fonts/nunito-sans/400Regular';
import { NunitoSans_600SemiBold } from '@expo-google-fonts/nunito-sans/600SemiBold';
import { NunitoSans_700Bold } from '@expo-google-fonts/nunito-sans/700Bold';
import { NunitoSans_800ExtraBold } from '@expo-google-fonts/nunito-sans/800ExtraBold';

/** Fichiers à passer à `useFonts`. */
export const FICHIERS_POLICES = {
  Fraunces_600SemiBold,
  Fraunces_700Bold,
  NunitoSans_400Regular,
  NunitoSans_600SemiBold,
  NunitoSans_700Bold,
  NunitoSans_800ExtraBold,
};

/** Noms de famille à utiliser dans `fontFamily`, une famille par graisse. */
export const POLICES = {
  fraunces600: 'Fraunces_600SemiBold',
  fraunces700: 'Fraunces_700Bold',
  nunito400: 'NunitoSans_400Regular',
  nunito600: 'NunitoSans_600SemiBold',
  nunito700: 'NunitoSans_700Bold',
  nunito800: 'NunitoSans_800ExtraBold',
} as const satisfies Record<string, keyof typeof FICHIERS_POLICES>;
