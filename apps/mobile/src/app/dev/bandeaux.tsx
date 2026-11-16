import { ScrollView, StyleSheet, Text, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BandeauVent } from '@/bandeaux/BandeauVent';
import { POLICES } from '@/theme/polices';

// Route de développement : les bandeaux l'un sous l'autre, pour la recette.
// Seul le bandeau beau temps est porté pour l'instant ; nuit, hiver et automne
// viendront s'ajouter ici.
export default function DevBandeaux() {
  const { width } = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();

  return (
    <ScrollView contentContainerStyle={[styles.page, { paddingTop: top, paddingBottom: bottom }]}>
      <Text style={styles.titre}>Beau temps</Text>
      <BandeauVent largeur={width} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { backgroundColor: '#FFF9F2', gap: 8 },
  titre: {
    fontFamily: POLICES.nunito700,
    fontSize: 15,
    color: '#23201E',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});
