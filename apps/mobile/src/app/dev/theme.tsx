import type { CleTheme } from '@animpartner/shared';
import { useLocalSearchParams } from 'expo-router';

import { EcranDuMoment } from '@/enigmes/EcranDuMoment';

const CLES: readonly string[] = ['beauTemps', 'nuit', 'hiver', 'automne'] satisfies CleTheme[];

// Route de développement : /dev/theme?theme=nuit (beauTemps, nuit, hiver ou automne)
// force le thème pour la recette ; sans valeur reconnue, c'est le thème du moment.
export default function DevTheme() {
  const { theme } = useLocalSearchParams<{ theme?: string }>();
  const force = CLES.includes(theme ?? '') ? (theme as CleTheme) : undefined;
  return <EcranDuMoment force={force} />;
}
