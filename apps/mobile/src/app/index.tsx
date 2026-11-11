import { StyleSheet, Text, View } from 'react-native';

// Écran d'accueil provisoire : l'écran d'énigmes le remplacera (issue #9).
// Couleurs « Crème » et « Encre » du design system, en attendant les palettes (issue #8).
export default function Accueil() {
  return (
    <View style={styles.ecran}>
      <Text accessibilityRole="header" style={styles.titre}>
        AnimPartner
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  ecran: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF9F2',
  },
  titre: {
    fontSize: 28,
    fontWeight: '700',
    color: '#23201E',
  },
});
