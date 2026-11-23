import type { Enigme, Palette } from '@animpartner/shared';
import { useEffect, useEffectEvent, useState, type ReactNode } from 'react';
import { StyleSheet, type AccessibilityActionEvent } from 'react-native';
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { DUREE_RETOUR_MS, decalageSuivi, decisionBalayage, type Decision } from './balayage';
import { Etiquette, HAUTEUR_ETIQUETTE, LARGEUR_ETIQUETTE, type Face } from './Etiquette';
import {
  DUREE_FONDU_ENCHAINE_MS,
  DUREE_GLISSEMENT_MS,
  POSITION_ENTREE,
  POSITION_POSEE,
  POSITION_SORTIE,
  dureeSortie,
  styleGlissement,
} from './glissement';
import {
  DUREE_FONDU_REDUIT_MS,
  DUREE_RETOURNEMENT_MS,
  PERSPECTIVE,
  progressionDe,
  styleFace,
} from './retournement';

/** Côté de l'écran par lequel une étiquette entre ou sort. */
export type Cote = 'gauche' | 'droite';
/** Changement d'énigme demandé par le geste ou le lecteur d'écran. */
export type Sens = Exclude<Decision, 'retour'>;

type Props = {
  enigme: Enigme;
  palette: Palette;
  /** La face voulue : quand elle change, l'étiquette se retourne. */
  face: Face;
  /** Côté par lequel l'étiquette entre en glissant jusqu'au centre ; `null` : déjà là. */
  entree: Cote | null;
  /** Côté par lequel l'étiquette quitte l'écran, telle quelle ; `null` : elle reste. */
  sortie: Cote | null;
  /** Largeur de l'écran. */
  largeurEcran: number;
  /** Largeur à parcourir pour quitter l'écran, dans le repère de l'étiquette. */
  distance: number;
  /** Il existe une énigme précédente : le balayage vers la droite y mène. */
  peutReculer: boolean;
  /**
   * Verrou commun aux animations, lu et pris par le geste sur le thread de l'interface.
   * L'écran le tient à jour avec son propre verrou.
   */
  verrou: SharedValue<boolean>;
  /** Le geste vient de prendre le verrou. */
  onVerrouPris: () => void;
  /** Balayage non validé : l'étiquette est revenue au centre et rend le verrou. */
  onVerrouRendu: () => void;
  /** Balayage validé : le verrou est déjà pris, l'écran change d'énigme. */
  onBalayee: (sens: Sens) => void;
  /** Action du lecteur d'écran : l'écran vérifie le verrou lui-même. */
  onAction: (sens: Sens) => void;
  /** Fin du retournement : l'étiquette est posée sur `face`. */
  onRetournee: (face: Face) => void;
  /** Fin de l'entrée : l'étiquette est au centre. */
  onEntree: () => void;
  /** Fin de la sortie : l'étiquette peut être retirée. */
  onSortie: () => void;
};

const FACES: readonly Face[] = ['recto', 'verso'];

/**
 * La réduction des animations est traitée ici (fondu au lieu du mouvement) : sans
 * `Never`, Reanimated sauterait en plus à la fin de chaque animation et supprimerait le
 * fondu.
 */
const SANS_REDUCTION = ReduceMotion.Never;

/**
 * Une étiquette du carrousel. Elle porte son propre état d'animation : celle qui sort
 * reste figée sur sa face pendant que la suivante entre au recto. Les animations
 * démarrent dans des effets, une fois la nouvelle étiquette ou la face d'arrivée montée :
 * jamais d'image où l'une manquerait. Le geste déplace l'étiquette sur le thread de
 * l'interface, sans rendu React à chaque image.
 */
export function CarteEnigme({
  enigme,
  palette,
  face,
  entree,
  sortie,
  largeurEcran,
  distance,
  peutReculer,
  verrou,
  onVerrouPris,
  onVerrouRendu,
  onBalayee,
  onAction,
  onRetournee,
  onEntree,
  onSortie,
}: Props) {
  const reduit = useReducedMotion();
  // La face à plat ; elle rejoint `face` à la fin du retournement.
  const [faceAuRepos, setFaceAuRepos] = useState(face);
  const progression = useSharedValue(progressionDe(face));
  const position = useSharedValue(
    entree === 'droite' ? POSITION_ENTREE : entree === 'gauche' ? POSITION_SORTIE : POSITION_POSEE,
  );
  // Ce geste-ci a pris le verrou : lui seul déplace l'étiquette et décide au relâcher.
  const suivi = useSharedValue(false);

  const retournee = useEffectEvent((arrivee: Face) => {
    setFaceAuRepos(arrivee);
    onRetournee(arrivee);
  });
  const entreeFinie = useEffectEvent(() => onEntree());
  const sortieFinie = useEffectEvent(() => onSortie());

  useEffect(() => {
    if (face === faceAuRepos) return;
    // Un geste pris dans la même image qu'un appui (course entre les deux verrous) lâche
    // l'étiquette : elle revient au centre et le geste ne décidera rien.
    suivi.set(false);
    if (Math.abs(position.get() - POSITION_POSEE) > 0.001) {
      position.set(withTiming(POSITION_POSEE, CONFIG_RETOUR));
    }
    progression.set(
      withTiming(
        progressionDe(face),
        reduit
          ? { duration: DUREE_FONDU_REDUIT_MS, easing: Easing.linear, reduceMotion: SANS_REDUCTION }
          : {
              duration: DUREE_RETOURNEMENT_MS,
              easing: Easing.inOut(Easing.cubic),
              reduceMotion: SANS_REDUCTION,
            },
        // Une animation n'est annulée que remplacée par la suivante (même effet relancé)
        // ou quand l'étiquette disparaît : dans les deux cas, rien à rendre.
        (fini) => {
          if (fini) scheduleOnRN(retournee, face);
        },
      ),
    );
  }, [face, faceAuRepos, position, progression, reduit, suivi]);

  useEffect(() => {
    if (entree === null) return;
    position.set(
      withTiming(POSITION_POSEE, configGlissement(reduit), (fini) => {
        if (fini) scheduleOnRN(entreeFinie);
      }),
    );
    // Au montage seulement, et sans `reduit` en dépendance : relancée après un changement
    // du réglage, l'entrée finirait aussitôt et appellerait `onEntree` à contretemps,
    // libérant le verrou pendant un retournement.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (sortie === null) return;
    // Plus rien ne doit déplacer l'étiquette qui sort : un geste encore actif (course avec
    // un appui) annulerait sa sortie et la laisserait à l'écran.
    suivi.set(false);
    const cible = sortie === 'gauche' ? POSITION_SORTIE : POSITION_ENTREE;
    const depart = position.get();
    // Après un balayage, l'étiquette part de là où le pouce l'a laissée, déjà lancée :
    // elle décélère sans repartir de zéro.
    const lancee = Math.abs(depart - POSITION_POSEE) > 0.01;
    position.set(
      withTiming(
        cible,
        {
          duration: dureeSortie(depart, cible, reduit),
          easing: reduit
            ? Easing.linear
            : lancee
              ? Easing.out(Easing.cubic)
              : Easing.inOut(Easing.cubic),
          reduceMotion: SANS_REDUCTION,
        },
        (fini) => {
          if (fini) scheduleOnRN(sortieFinie);
        },
      ),
    );
    // Au départ de la sortie seulement.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortie]);

  // La configuration du geste est relue à chaque rendu : ses rappels voient les dernières
  // props.
  const geste = usePanGesture({
    enabled: sortie === null,
    // Seul un mouvement horizontal franc devient un balayage.
    activeOffsetX: [-12, 12],
    failOffsetY: [-12, 12],
    // Un identifiant par énigme : deux étiquettes voisines ne portent jamais la même.
    testID: `balayage-${enigme.id}`,
    onActivate: () => {
      'worklet';
      if (verrou.get()) return;
      verrou.set(true);
      suivi.set(true);
      scheduleOnRN(onVerrouPris);
    },
    onUpdate: (e) => {
      'worklet';
      // Animations réduites : l'étiquette ne suit pas le pouce.
      if (!suivi.get() || reduit) return;
      position.set(POSITION_POSEE - decalageSuivi(e.translationX, peutReculer) / largeurEcran);
    },
    onDeactivate: (e) => {
      'worklet';
      if (!suivi.get()) return;
      suivi.set(false);
      const decision = e.canceled
        ? 'retour'
        : decisionBalayage({
            decalage: e.translationX,
            vitesse: e.velocityX,
            largeur: largeurEcran,
            peutReculer,
          });
      if (decision !== 'retour') {
        scheduleOnRN(onBalayee, decision);
        return;
      }
      position.set(
        withTiming(POSITION_POSEE, CONFIG_RETOUR, () => {
          verrou.set(false);
          scheduleOnRN(onVerrouRendu);
        }),
      );
    },
  });

  const styleCarte = useAnimatedStyle(() => {
    const s = styleGlissement(position.value, distance, reduit);
    return { opacity: s.opacite, transform: [{ translateX: s.decalage }] };
  });

  const courante = sortie === null;
  const actions = [
    { name: 'suivante', label: 'Énigme suivante' },
    ...(peutReculer ? [{ name: 'precedente', label: 'Énigme précédente' }] : []),
  ];
  const surAction = (e: AccessibilityActionEvent) => {
    const nom = e.nativeEvent.actionName;
    if (nom === 'suivante' || nom === 'precedente') onAction(nom);
  };

  return (
    <GestureDetector gesture={geste}>
      <Animated.View
        style={[styles.carte, styleCarte]}
        pointerEvents={courante ? 'auto' : 'none'}
        // L'étiquette courante se lit d'un bloc, avec ses actions : le lecteur d'écran
        // peut changer d'énigme sans le geste. Celle qui s'en va ne se lit plus.
        accessible={courante}
        accessibilityLabel={courante ? libelleEtiquette(enigme, faceAuRepos) : undefined}
        accessibilityActions={courante ? actions : undefined}
        onAccessibilityAction={courante ? surAction : undefined}
        aria-hidden={!courante}
        importantForAccessibility={courante ? 'auto' : 'no-hide-descendants'}
      >
        {FACES.filter((f) => f === faceAuRepos || f === face).map((f) => (
          <FaceAnimee
            key={f}
            face={f}
            progression={progression}
            reduit={reduit}
            // Pendant le retournement, la face d'arrivée reste muette pour le lecteur
            // d'écran : la réponse est annoncée une fois l'étiquette posée.
            cachee={f !== faceAuRepos}
          >
            <Etiquette enigme={enigme} face={f} palette={palette} />
          </FaceAnimee>
        ))}
      </Animated.View>
    </GestureDetector>
  );
}

/** Ce que le lecteur d'écran dit de l'étiquette, selon la face à plat. */
export function libelleEtiquette(enigme: Enigme, face: Face): string {
  return face === 'recto'
    ? `Énigme, de ${enigme.ageMin} à ${enigme.ageMax} ans\u00a0: ${enigme.question}`
    : `Réponse\u00a0: ${enigme.reponse}. ${enigme.explication}`;
}

/** Retour de l'étiquette au centre, quand un balayage n'est pas validé. */
const CONFIG_RETOUR = {
  duration: DUREE_RETOUR_MS,
  easing: Easing.out(Easing.cubic),
  reduceMotion: SANS_REDUCTION,
};

function configGlissement(reduit: boolean) {
  return reduit
    ? { duration: DUREE_FONDU_ENCHAINE_MS, easing: Easing.linear, reduceMotion: SANS_REDUCTION }
    : {
        duration: DUREE_GLISSEMENT_MS,
        easing: Easing.inOut(Easing.cubic),
        reduceMotion: SANS_REDUCTION,
      };
}

type PropsFace = {
  face: Face;
  progression: SharedValue<number>;
  reduit: boolean;
  cachee: boolean;
  children: ReactNode;
};

/** Une face de l'étiquette, tournée et inclinée sur le thread de l'interface. */
function FaceAnimee({ face, progression, reduit, cachee, children }: PropsFace) {
  const style = useAnimatedStyle(() => {
    const s = styleFace(face, progression.value, reduit);
    return {
      opacity: s.opacite,
      transform: [
        { perspective: PERSPECTIVE },
        { rotate: `${s.inclinaison}deg` },
        { rotateY: `${s.rotationY}deg` },
      ],
    };
  });
  return (
    <Animated.View
      style={[styles.face, style]}
      aria-hidden={cachee}
      importantForAccessibility={cachee ? 'no-hide-descendants' : 'auto'}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  carte: { ...StyleSheet.absoluteFill, width: LARGEUR_ETIQUETTE, height: HAUTEUR_ETIQUETTE },
  face: { ...StyleSheet.absoluteFill, backfaceVisibility: 'hidden' },
});
