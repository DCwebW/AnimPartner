import { useCallback, useRef, useState } from 'react';
import {
  cancelAnimation,
  Easing,
  ReduceMotion,
  useReducedMotion,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import type { Face } from './Etiquette';
import { DUREE_FONDU_REDUIT_MS, DUREE_RETOURNEMENT_MS, progressionDe } from './retournement';

export type Retournement = {
  /** La face à plat : celle dont les boutons s'affichent. */
  face: Face;
  /** La face vers laquelle l'étiquette tourne, ou `null` au repos. */
  cible: Face | null;
  /** 0 au recto, 1 au verso, animée sur le thread de l'interface. */
  progression: SharedValue<number>;
  /** Le système demande de réduire les animations. */
  reduit: boolean;
  /** Retourne l'étiquette vers une face. Ignoré pendant un retournement. */
  retourner: (vers: Face) => void;
  /**
   * Pose une face sans animation (nouvelle énigme). Renvoie `false`, sans rien faire,
   * pendant un retournement.
   */
  poser: (face: Face) => boolean;
};

/**
 * État du retournement de l'étiquette. Un seul rendu React au départ (la face d'arrivée
 * se monte) et un à l'arrivée (les boutons changent) : entre les deux, tout se passe
 * sur le thread de l'interface.
 */
export function useRetournement(surArrivee?: (face: Face) => void): Retournement {
  const reduit = useReducedMotion();
  const [face, setFace] = useState<Face>('recto');
  const [cible, setCible] = useState<Face | null>(null);
  const progression = useSharedValue(progressionDe('recto'));
  // Garde synchrone : deux appuis dans la même image ne lancent qu'un retournement.
  const enCours = useRef(false);

  // Capturé au départ du retournement : l'énigme ne peut pas changer avant l'arrivée,
  // puisque les appuis sont ignorés pendant ce temps.
  const terminer = useCallback(
    (vers: Face) => {
      enCours.current = false;
      setFace(vers);
      setCible(null);
      surArrivee?.(vers);
    },
    [surArrivee],
  );

  // Animation annulée : l'étiquette revient à plat sur sa face de départ, et l'écran
  // reprend la main au lieu de rester verrouillé.
  const annuler = useCallback(() => {
    enCours.current = false;
    setCible(null);
    progression.set(progressionDe(face));
  }, [face, progression]);

  const retourner = useCallback(
    (vers: Face) => {
      if (enCours.current || vers === face) return;
      enCours.current = true;
      setCible(vers);
      progression.set(
        withTiming(
          progressionDe(vers),
          {
            ...(reduit
              ? { duration: DUREE_FONDU_REDUIT_MS, easing: Easing.linear }
              : { duration: DUREE_RETOURNEMENT_MS, easing: Easing.inOut(Easing.cubic) }),
            // La réduction des animations est déjà traitée ici (fondu au lieu de la
            // rotation) : sans cela, Reanimated sauterait à la fin et supprimerait le fondu.
            reduceMotion: ReduceMotion.Never,
          },
          (fini) => {
            if (fini) scheduleOnRN(terminer, vers);
            else scheduleOnRN(annuler);
          },
        ),
      );
    },
    [face, progression, reduit, terminer, annuler],
  );

  const poser = useCallback(
    (nouvelle: Face) => {
      if (enCours.current) return false;
      cancelAnimation(progression);
      progression.set(progressionDe(nouvelle));
      setFace(nouvelle);
      return true;
    },
    [progression],
  );

  return { face, cible, progression, reduit, retourner, poser };
}
