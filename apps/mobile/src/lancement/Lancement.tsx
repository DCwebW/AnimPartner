import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { StyleSheet, View, useColorScheme } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { FONDU_ENTREE_MS, delaiAvantMasquage, dureeSortie } from './enchainement';

// Mêmes fonds unis que le splash natif (`app.json`), pour un passage sans saut.
const FOND_CLAIR = '#FEF3D4';
const FOND_SOMBRE = '#262231';

// Logotype : 1391 × 711 px, affiché à 280 px de large.
const LARGEUR_LOGO = 280;
const HAUTEUR_LOGO = Math.round((LARGEUR_LOGO * 711) / 1391);

type Props = {
  /** Le splash natif est masqué : le logotype peut apparaître. */
  affiche: boolean;
  /** Tout ce que l'écran d'accueil attend est chargé (les polices, pour l'instant). */
  pret: boolean;
  children: ReactNode;
};

/**
 * Superpose l'écran de chargement à l'application, puis le retire en fondu. Ce n'est
 * pas une route : il ne laisse rien dans l'historique de navigation.
 */
export function Lancement({ affiche, pret, children }: Props) {
  const [termine, setTermine] = useState(false);
  const terminer = useCallback(() => setTermine(true), []);

  return (
    <View style={styles.racine}>
      {children}
      {!termine && <EcranChargement affiche={affiche} pret={pret} onTermine={terminer} />}
    </View>
  );
}

type PropsEcran = Omit<Props, 'children'> & { onTermine: () => void };

function EcranChargement({ affiche, pret, onTermine }: PropsEcran) {
  const animationsReduites = useReducedMotion();
  const sombre = useColorScheme() === 'dark';
  // Instant où le logotype apparaît : la durée minimale se compte à partir de là.
  const debut = useRef<number | null>(null);

  // Animations réduites : pas de fondu d'entrée, un seul fondu court vers l'accueil.
  const opaciteLogo = useSharedValue(animationsReduites ? 1 : 0);
  const opaciteEcran = useSharedValue(1);

  useEffect(() => {
    if (!affiche) return;
    if (debut.current === null) {
      debut.current = Date.now();
      if (!animationsReduites) {
        opaciteLogo.value = withTiming(1, {
          duration: FONDU_ENTREE_MS,
          easing: Easing.out(Easing.quad),
        });
      }
    }

    const delai = delaiAvantMasquage({
      pret,
      ecouleMs: Date.now() - debut.current,
      animationsReduites,
    });
    if (delai === null) return;

    const duree = dureeSortie(animationsReduites);
    let fin: ReturnType<typeof setTimeout> | undefined;
    const sortie = setTimeout(() => {
      opaciteEcran.value = withTiming(0, { duration: duree, easing: Easing.in(Easing.quad) });
      fin = setTimeout(onTermine, duree);
    }, delai);

    return () => {
      clearTimeout(sortie);
      if (fin) clearTimeout(fin);
    };
  }, [affiche, pret, animationsReduites, onTermine, opaciteLogo, opaciteEcran]);

  const styleEcran = useAnimatedStyle(() => ({ opacity: opaciteEcran.value }));
  const styleLogo = useAnimatedStyle(() => ({ opacity: opaciteLogo.value }));

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        styles.ecran,
        { backgroundColor: sombre ? FOND_SOMBRE : FOND_CLAIR },
        styleEcran,
      ]}
    >
      <Animated.Image
        source={require('../../assets/logo.png')}
        accessible
        accessibilityRole="image"
        accessibilityLabel="AnimPartner"
        resizeMode="contain"
        style={[styles.logo, styleLogo]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  racine: { flex: 1 },
  ecran: { alignItems: 'center', justifyContent: 'center' },
  logo: {
    width: LARGEUR_LOGO,
    height: HAUTEUR_LOGO,
    // Remonté de 24 px pour le centre optique.
    transform: [{ translateY: -24 }],
  },
});
