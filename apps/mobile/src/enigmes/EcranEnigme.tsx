import {
  CATALOGUE,
  avancer,
  courant,
  creerHistorique,
  creerTirage,
  peutReculer,
  reculer,
  enigmesAffichables,
  enigmesPourAge,
  formaterDateDuJour,
  salutationAvecPrenom,
  type Aleatoire,
  type Enigme,
  type Palette,
} from '@animpartner/shared';
import { useEffect, useRef, useState, type ReactNode } from 'react';
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
import { useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, Path, Pattern, Rect } from 'react-native-svg';

import { useIdSvg } from '@/svg/useIdSvg';
import { POLICES } from '@/theme/polices';

import { CarteEnigme, libelleEtiquette, type Cote, type Sens } from './CarteEnigme';
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
  /** Côté par lequel elle entre en glissant ; `null` : déjà au centre. */
  entree: Cote | null;
  /** Côté par lequel elle sort ; `null` : c'est l'étiquette courante. */
  sortie: Cote | null;
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
  /** Prénom de l'animateur, ajouté à la salutation. */
  prenom?: string | null;
  /** Âge du plus jeune du groupe ; `null` ou absent : toutes les énigmes. */
  age?: number | null;
};

/** Les énigmes de l'âge ; si aucune ne convient, toutes (le tirage refuse une liste vide). */
function listePourAge(enigmes: readonly Enigme[], age: number | null): readonly Enigme[] {
  const filtrees = enigmesPourAge(enigmes, age);
  return filtrees.length > 0 ? filtrees : enigmes;
}

export function EcranEnigme({
  palette: p,
  bandeau,
  enigmes = enigmesAffichables(CATALOGUE),
  aleatoire,
  maintenant,
  prenom,
  age = null,
}: Props) {
  const insets = useSafeAreaInsets();
  // Le tirage et la première énigme naissent ensemble : si React appelle l'initialiseur
  // deux fois (mode strict), il garde un couple cohérent et n'en saute aucune.
  const [{ tirer, premiere }, setTirage] = useState(() => {
    const tirage = creerTirage(listePourAge(enigmes, age), aleatoire);
    return { tirer: tirage, premiere: tirage() };
  });
  const [cartes, setCartes] = useState<Carte[]>(() => [
    { cle: 0, enigme: premiere, face: 'recto', entree: null, sortie: null },
  ]);
  // Les énigmes vues pendant la session, pour revenir en arrière.
  const [historique, setHistorique] = useState(() => creerHistorique(premiere));
  // La face dont les boutons s'affichent : elle change à la fin de chaque animation.
  const [face, setFace] = useState<Face>('recto');
  // Verrou commun au retournement, au glissement et au geste : un appui pendant une
  // animation est ignoré. Une ref, pour que deux appuis dans la même image ne passent pas
  // tous les deux, doublée d'une valeur partagée que le geste lit sur le thread de
  // l'interface.
  const occupe = useRef(false);
  const verrou = useSharedValue(false);
  const verrouiller = () => {
    occupe.current = true;
    verrou.set(true);
  };
  const liberer = () => {
    occupe.current = false;
    verrou.set(false);
  };
  const prochaineCle = useRef(1);
  // Quand l'âge change, un nouveau tirage démarre sur la liste filtrée. L'énigme affichée
  // reste si elle convient ; sinon la première du nouveau tirage la remplace, au recto.
  const ageApplique = useRef(age);
  /* eslint-disable react-hooks/set-state-in-effect -- le tirage doit repartir quand le réglage change */
  useEffect(() => {
    if (age === ageApplique.current) return;
    ageApplique.current = age;
    const liste = listePourAge(enigmes, age);
    const actuelle = courant(historique);
    const tirage = creerTirage(liste, aleatoire);
    if (liste.includes(actuelle)) {
      // L'énigme affichée compte comme déjà vue : le nouveau tirage ne la redonne pas d'abord.
      const premier = tirage();
      const suite =
        premier === actuelle && liste.length > 1
          ? tirage
          : (() => {
              let encore = true;
              return () => {
                if (!encore) return tirage();
                encore = false;
                return premier;
              };
            })();
      setTirage({ tirer: suite, premiere: actuelle });
      setHistorique(creerHistorique(actuelle));
    } else {
      const nouvelle = tirage();
      setTirage({ tirer: tirage, premiere: nouvelle });
      setHistorique(creerHistorique(nouvelle));
      setCartes([
        {
          cle: prochaineCle.current++,
          enigme: nouvelle,
          face: 'recto',
          entree: null,
          sortie: null,
        },
      ]);
      setFace('recto');
      liberer();
    }
    // Seul un changement d'âge relance le tirage.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [age]);
  /* eslint-enable react-hooks/set-state-in-effect */
  const { width: largeurFenetre } = useWindowDimensions();
  // Recalculée à chaque rendu : EcranDuMoment la rafraîchit au retour au premier plan.
  const date = formaterDateDuJour(maintenant ?? new Date());
  const [zone, setZone] = useState({ largeur: 0, hauteur: 0 });

  const retourner = (vers: Face) => {
    // Déjà sur cette face : aucune animation ne rendrait le verrou.
    if (occupe.current || vers === face) return;
    verrouiller();
    setCartes((cs) => cs.map((c) => (c.sortie ? c : { ...c, face: vers })));
  };

  const surRetournee = (carte: Carte, arrivee: Face) => {
    liberer();
    setFace(arrivee);
    if (arrivee === 'verso') {
      AccessibilityInfo.announceForAccessibility(
        `Réponse\u00a0: ${carte.enigme.reponse}. ${carte.enigme.explication}`,
      );
    }
  };

  /**
   * Change d'énigme : la suivante (déjà vue après un retour en arrière, sinon tirée) entre
   * par la droite, la précédente par la gauche. L'étiquette courante sort de l'autre côté,
   * telle quelle (au verso si la réponse est affichée) ; la nouvelle arrive au recto.
   * `verrouPris` : le geste tient déjà le verrou.
   */
  const changer = (sens: Sens, verrouPris = false) => {
    if (!verrouPris && occupe.current) return;
    const suivant = sens === 'suivante' ? avancer(historique, tirer) : reculer(historique);
    if (suivant === historique) {
      // Rien avant la première énigme.
      if (verrouPris) liberer();
      return;
    }
    verrouiller();
    setHistorique(suivant);
    const versLaGauche = sens === 'suivante';
    const nouvelle: Carte = {
      cle: prochaineCle.current++,
      enigme: courant(suivant),
      face: 'recto',
      entree: versLaGauche ? 'droite' : 'gauche',
      sortie: null,
    };
    setCartes((cs) => [
      ...cs.map((c) => ({ ...c, sortie: c.sortie ?? (versLaGauche ? 'gauche' : 'droite') })),
      nouvelle,
    ]);
  };

  const autreEnigme = () => changer('suivante');

  const surEntree = (carte: Carte) => {
    liberer();
    setFace('recto');
    // L'étiquette qui avait le focus du lecteur d'écran est partie : on lit la nouvelle.
    AccessibilityInfo.announceForAccessibility(libelleEtiquette(carte.enigme, 'recto'));
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
                {salutationAvecPrenom(p.salut, prenom)}
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
                    largeurEcran={largeurFenetre}
                    distance={distance}
                    peutReculer={peutReculer(historique)}
                    verrou={verrou}
                    onVerrouPris={() => (occupe.current = true)}
                    onVerrouRendu={() => (occupe.current = false)}
                    onBalayee={(sens) => changer(sens, true)}
                    onAction={(sens) => changer(sens)}
                    onRetournee={(arrivee) => surRetournee(c, arrivee)}
                    onEntree={() => surEntree(c)}
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
