import { ScrollView, StyleSheet, Text, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BandeauAutomne } from '@/bandeaux/BandeauAutomne';
import { BandeauHiver } from '@/bandeaux/BandeauHiver';
import { BandeauNuit } from '@/bandeaux/BandeauNuit';
import { BandeauVent } from '@/bandeaux/BandeauVent';
import { POLICES } from '@/theme/polices';

// Route de développement : les quatre bandeaux l'un sous l'autre, pour la recette.
export default function DevBandeaux() {
  const { width } = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();

  return (
    <ScrollView contentContainerStyle={[styles.page, { paddingTop: top, paddingBottom: bottom }]}>
      <Text style={styles.titre}>Beau temps</Text>
      <BandeauVent largeur={width} />
      <Text style={styles.titre}>Nuit</Text>
      <BandeauNuit largeur={width} />
      <Text style={styles.titre}>Hiver</Text>
      <BandeauHiver largeur={width} />
      <Text style={styles.titre}>Automne</Text>
      <BandeauAutomne largeur={width} />
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
