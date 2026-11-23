import type { Enigme, Palette } from '@animpartner/shared';
import { useEffect, useEffectEvent, useState, type ReactNode } from 'react';
import { StyleSheet } from 'react-native';
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

import { Etiquette, HAUTEUR_ETIQUETTE, LARGEUR_ETIQUETTE, type Face } from './Etiquette';
import {
  DUREE_FONDU_ENCHAINE_MS,
  DUREE_GLISSEMENT_MS,
  POSITION_ENTREE,
  POSITION_POSEE,
  POSITION_SORTIE,
  styleGlissement,
} from './glissement';
import {
  DUREE_FONDU_REDUIT_MS,
  DUREE_RETOURNEMENT_MS,
  PERSPECTIVE,
  progressionDe,
  styleFace,
} from './retournement';

type Props = {
  enigme: Enigme;
  palette: Palette;
  /** La face voulue : quand elle change, l'étiquette se retourne. */
  face: Face;
  /** L'étiquette naît hors de l'écran, à droite, et glisse jusqu'au centre. */
  entree: boolean;
  /** L'étiquette glisse hors de l'écran par la gauche, telle quelle. */
  sortie: boolean;
  /** Largeur à parcourir pour quitter l'écran, dans le repère de l'étiquette. */
  distance: number;
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
 * jamais d'image où l'une manquerait. Entre le départ et l'arrivée, tout se passe sur le
 * thread de l'interface.
 */
export function CarteEnigme({
  enigme,
  palette,
  face,
  entree,
  sortie,
  distance,
  onRetournee,
  onEntree,
  onSortie,
}: Props) {
  const reduit = useReducedMotion();
  // La face à plat ; elle rejoint `face` à la fin du retournement.
  const [faceAuRepos, setFaceAuRepos] = useState(face);
  const progression = useSharedValue(progressionDe(face));
  const position = useSharedValue(entree ? POSITION_ENTREE : POSITION_POSEE);

  const retournee = useEffectEvent((arrivee: Face) => {
    setFaceAuRepos(arrivee);
    onRetournee(arrivee);
  });
  const entreeFinie = useEffectEvent(() => onEntree());
  const sortieFinie = useEffectEvent(() => onSortie());

  useEffect(() => {
    if (face === faceAuRepos) return;
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
  }, [face, faceAuRepos, progression, reduit]);

  useEffect(() => {
    if (!entree) return;
    position.set(
      withTiming(POSITION_POSEE, configGlissement(reduit), (fini) => {
        if (fini) scheduleOnRN(entreeFinie);
      }),
    );
    // Au montage seulement : l'entrée ne se rejoue pas.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!sortie) return;
    position.set(
      withTiming(POSITION_SORTIE, configGlissement(reduit), (fini) => {
        if (fini) scheduleOnRN(sortieFinie);
      }),
    );
    // Au départ de la sortie seulement.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortie]);

  const styleCarte = useAnimatedStyle(() => {
    const s = styleGlissement(position.value, distance, reduit);
    return { opacity: s.opacite, transform: [{ translateX: s.decalage }] };
  });

  return (
    <Animated.View
      style={[styles.carte, styleCarte]}
      pointerEvents="none"
      // L'étiquette qui s'en va ne se lit plus.
      aria-hidden={sortie}
      importantForAccessibility={sortie ? 'no-hide-descendants' : 'auto'}
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
  );
}

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
