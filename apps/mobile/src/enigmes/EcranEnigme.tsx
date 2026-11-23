import {
  CATALOGUE,
  creerTirage,
  enigmesAffichables,
  formaterDateDuJour,
  type Aleatoire,
  type Enigme,
  type Palette,
} from '@animpartner/shared';
import { useRef, useState, type ReactNode } from 'react';
import {
  AccessibilityInfo,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type LayoutChangeEvent,
  type PressableProps,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, Path, Pattern, Rect } from 'react-native-svg';

import { useIdSvg } from '@/svg/useIdSvg';
import { POLICES } from '@/theme/polices';

import { CarteEnigme } from './CarteEnigme';
import { HAUTEUR_ETIQUETTE, LARGEUR_ETIQUETTE, type Face } from './Etiquette';
import { IconeDe, IconeRetourner } from './icones';

/** Part de la hauteur occupée par la feuille relevée, sous le bandeau. */
const PART_FEUILLE = 0.85;
/** Agrandissement de l'étiquette dans la maquette, réduit si la place manque. */
const ECHELLE_ETIQUETTE = 1.1;

/** Une étiquette du carrousel : la courante, ou celle qui sort pendant un glissement. */
type Carte = {
  cle: number;
  enigme: Enigme;
  /** Face voulue : quand elle change, l'étiquette se retourne. */
  face: Face;
  /** Née hors de l'écran, à droite, pour entrer en glissant. */
  entree: boolean;
  /** En train de sortir par la gauche. */
  sortie: boolean;
};

type Props = {
  palette: Palette;
  /** La scène du bandeau, à la largeur de l'écran. */
  bandeau: ReactNode;
  /** Énigmes à tirer ; par défaut, les énigmes validées du catalogue. */
  enigmes?: readonly Enigme[];
  /** Générateur aléatoire, injectable pour les tests. */
  aleatoire?: Aleatoire;
  /** Date affichée ; par défaut, celle du téléphone à l'ouverture. */
  maintenant?: Date;
};

export function EcranEnigme({
  palette: p,
  bandeau,
  enigmes = enigmesAffichables(CATALOGUE),
  aleatoire,
  maintenant,
}: Props) {
  const insets = useSafeAreaInsets();
  // Le tirage et la première énigme naissent ensemble : si React appelle l'initialiseur
  // deux fois (mode strict), il garde un couple cohérent et n'en saute aucune.
  const [{ tirer, premiere }] = useState(() => {
    const tirage = creerTirage(enigmes, aleatoire);
    return { tirer: tirage, premiere: tirage() };
  });
  const [cartes, setCartes] = useState<Carte[]>(() => [
    { cle: 0, enigme: premiere, face: 'recto', entree: false, sortie: false },
  ]);
  // La face dont les boutons s'affichent : elle change à la fin de chaque animation.
  const [face, setFace] = useState<Face>('recto');
  // Verrou commun au retournement et au glissement : un appui pendant une animation est
  // ignoré. Une ref, pour que deux appuis dans la même image ne passent pas tous les deux.
  const occupe = useRef(false);
  const prochaineCle = useRef(1);
  const { width: largeurFenetre } = useWindowDimensions();
  // Recalculée à chaque rendu : EcranDuMoment la rafraîchit au retour au premier plan.
  const date = formaterDateDuJour(maintenant ?? new Date());
  const [zone, setZone] = useState({ largeur: 0, hauteur: 0 });

  const retourner = (vers: Face) => {
    if (occupe.current) return;
    occupe.current = true;
    setCartes((cs) => cs.map((c) => (c.sortie ? c : { ...c, face: vers })));
  };

  const surRetournee = (carte: Carte, arrivee: Face) => {
    occupe.current = false;
    setFace(arrivee);
    if (arrivee === 'verso') {
      AccessibilityInfo.announceForAccessibility(
        `Réponse\u00a0: ${carte.enigme.reponse}. ${carte.enigme.explication}`,
      );
    }
  };

  // L'étiquette courante sort telle quelle (au verso si la réponse est affichée) pendant
  // que la suivante entre au recto.
  const autreEnigme = () => {
    if (occupe.current) return;
    occupe.current = true;
    const nouvelle: Carte = {
      cle: prochaineCle.current++,
      enigme: tirer(),
      face: 'recto',
      entree: true,
      sortie: false,
    };
    setCartes((cs) => [...cs.map((c) => ({ ...c, sortie: true })), nouvelle]);
  };

  const surEntree = () => {
    occupe.current = false;
    setFace('recto');
  };

  const surSortie = (cle: number) => setCartes((cs) => cs.filter((c) => c.cle !== cle));

  const surMesure = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setZone({ largeur: width, hauteur: height });
  };
  // L'étiquette garde l'échelle de la maquette tant qu'elle tient dans sa zone.
  const echelle =
    zone.hauteur > 0
      ? Math.min(
          ECHELLE_ETIQUETTE,
          zone.hauteur / HAUTEUR_ETIQUETTE,
          zone.largeur / LARGEUR_ETIQUETTE,
        )
      : ECHELLE_ETIQUETTE;
  // Assez pour quitter l'écran : l'étiquette est centrée et moins large que la fenêtre.
  // Divisée par l'échelle, car le décalage s'applique dans le repère de l'étiquette.
  const distance = largeurFenetre / echelle;

  return (
    <View style={[styles.ecran, { backgroundColor: p.fond_scene, paddingTop: insets.top }]}>
      <View style={styles.scene}>
        <View style={styles.bandeau}>{bandeau}</View>

        <View
          style={[
            styles.feuille,
            { backgroundColor: p.feuille, boxShadow: `0px -10px 30px ${p.ombre}` },
          ]}
        >
          <Papier palette={p} />

          <View style={[styles.contenu, { paddingBottom: 26 + insets.bottom }]}>
            <View style={styles.entete}>
              <Text accessibilityRole="header" style={[styles.salut, { color: p.encre }]}>
                {p.salut}
              </Text>
              <Text style={[styles.date, { color: p.encre2 }]}>{date}</Text>
            </View>

            <View style={styles.zoneEtiquette} onLayout={surMesure}>
              <View style={[styles.pile, { transform: [{ scale: echelle }] }]}>
                {cartes.map((c) => (
                  <CarteEnigme
                    key={c.cle}
                    enigme={c.enigme}
                    palette={p}
                    face={c.face}
                    entree={c.entree}
                    sortie={c.sortie}
                    distance={distance}
                    onRetournee={(arrivee) => surRetournee(c, arrivee)}
                    onEntree={surEntree}
                    onSortie={() => surSortie(c.cle)}
                  />
                ))}
              </View>
            </View>

            <View style={styles.actions}>
              {face === 'recto' ? (
                <>
                  <BoutonPrincipal
                    palette={p}
                    libelle="Voir la réponse"
                    icone={<IconeRetourner taille={20} couleur={p.bouton_texte} />}
                    onPress={() => retourner('verso')}
                  />
                  <BoutonSecondaire
                    palette={p}
                    libelle="Une autre énigme"
                    icone={<IconeDe taille={18} couleur={p.lien} />}
                    onPress={autreEnigme}
                  />
                </>
              ) : (
                <>
                  <BoutonPrincipal
                    palette={p}
                    libelle="Une autre énigme"
                    icone={<IconeDe taille={20} couleur={p.bouton_texte} />}
                    onPress={autreEnigme}
                  />
                  <BoutonSecondaire
                    palette={p}
                    libelle="Revoir l'énigme"
                    icone={<IconeRetourner taille={18} couleur={p.lien} />}
                    onPress={() => retourner('recto')}
                  />
                </>
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

/** Hachures du papier de la feuille, comme dans les maquettes. */
function Papier({ palette: p }: { palette: Palette }) {
  const ids = useIdSvg('papier');
  return (
    <Svg
      width="100%"
      height="100%"
      fill="none"
      style={StyleSheet.absoluteFill}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Defs>
        <Pattern id={`${ids}-h`} width={11} height={4.4} patternUnits="userSpaceOnUse">
          <Path d="M-1 2.2h13" stroke={p.hach1} strokeWidth={1.4} strokeLinecap="round" />
        </Pattern>
        <Pattern
          id={`${ids}-d`}
          width={11}
          height={4.6}
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(36)"
        >
          <Path d="M-1 2.3h13" stroke={p.hach2} strokeWidth={1.3} strokeLinecap="round" />
        </Pattern>
      </Defs>
      <Rect width="100%" height="100%" fill={`url(#${ids}-h)`} opacity={p.op1} />
      <Rect width="100%" height="100%" fill={`url(#${ids}-d)`} opacity={p.op2} />
    </Svg>
  );
}

type PropsBouton = {
  palette: Palette;
  libelle: string;
  icone: ReactNode;
  onPress: PressableProps['onPress'];
};

function BoutonPrincipal({ palette: p, libelle, icone, onPress }: PropsBouton) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={libelle}
      onPress={onPress}
      style={({ pressed }) => [
        styles.principal,
        {
          backgroundColor: p.bouton,
          borderColor: p.bord_bouton,
          boxShadow: `1px 1.5px 0px ${p.ombre_bouton}`,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      {icone}
      <Text style={[styles.textePrincipal, { color: p.bouton_texte }]}>{libelle}</Text>
    </Pressable>
  );
}

function BoutonSecondaire({ palette: p, libelle, icone, onPress }: PropsBouton) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={libelle}
      onPress={onPress}
      style={({ pressed }) => [styles.secondaire, { opacity: pressed ? 0.6 : 1 }]}
    >
      {icone}
      <Text style={[styles.texteSecondaire, { color: p.lien }]}>{libelle}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  ecran: { flex: 1 },
  scene: { flex: 1 },
  bandeau: { position: 'absolute', top: 0, left: 0, right: 0 },
  feuille: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: `${PART_FEUILLE * 100}%`,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 26,
    overflow: 'hidden',
  },
  contenu: {
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: 20,
    gap: 12,
  },
  entete: { gap: 4 },
  salut: { fontFamily: POLICES.fraunces700, fontSize: 25 },
  date: { fontFamily: POLICES.nunito400, fontSize: 13 },
  zoneEtiquette: {
    flex: 1,
    minHeight: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pile: { width: LARGEUR_ETIQUETTE, height: HAUTEUR_ETIQUETTE },
  actions: { gap: 4 },
  principal: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1.4,
    borderRadius: 999,
  },
  textePrincipal: { fontFamily: POLICES.nunito800, fontSize: 16 },
  secondaire: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  texteSecondaire: { fontFamily: POLICES.nunito700, fontSize: 15 },
});
