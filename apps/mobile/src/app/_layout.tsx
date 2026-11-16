import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { Lancement } from '@/lancement/Lancement';
import { FICHIERS_POLICES } from '@/theme/polices';

// Le splash natif reste affiché jusqu'au chargement des polices.
SplashScreen.preventAutoHideAsync().catch(() => {
  // Déjà masqué (rechargement à chaud) : rien à faire.
});

export default function RootLayout() {
  const [policesChargees, erreurPolices] = useFonts(FICHIERS_POLICES);
  // En cas d'erreur, on continue avec les polices du système plutôt que de bloquer.
  const pret = policesChargees || erreurPolices != null;

  useEffect(() => {
    if (pret) SplashScreen.hideAsync().catch(() => {});
  }, [pret]);

  return (
    <Lancement affiche={pret} pret={pret}>
      {/* Les écrans attendent les polices : un texte rendu avant garderait celle du système.
          Le splash natif couvre ce moment. */}
      {pret && <Stack screenOptions={{ headerShown: false }} />}
      <StatusBar style="dark" />
    </Lancement>
  );
}
