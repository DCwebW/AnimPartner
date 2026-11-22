import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import {
  cancelAnimation,
  Easing,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { phaseDepart } from './noel';

/** Vrai quand les animations peuvent tourner : mouvement non réduit, app au premier plan. */
export function useAnimationsActives(): boolean {
  const reduites = useReducedMotion();
  const [premierPlan, setPremierPlan] = useState(AppState.currentState !== 'background');
  useEffect(() => {
    const abonnement = AppState.addEventListener('change', (etat) =>
      setPremierPlan(etat === 'active'),
    );
    return () => abonnement.remove();
  }, []);
  return !reduites && premierPlan;
}

/**
 * Phase (0 à 1) d'une boucle linéaire, sur le thread de l'interface. Le délai CSS négatif
 * devient la phase de départ. Les courbes (ease-in-out) et l'aller-retour des boucles
 * alternées se calculent à partir de cette phase, dans le style animé.
 * Hors `actif` : la phase se fige (pause en arrière-plan, reprise au même point).
 */
export function useBoucle(periode: number, delai: number, actif: boolean) {
  const phase = useSharedValue(phaseDepart(delai, periode));

  useEffect(() => {
    if (!actif) return;
    const depart = phase.value;
    phase.value = withSequence(
      withTiming(1, { duration: (1 - depart) * periode * 1000, easing: Easing.linear }),
      withTiming(0, { duration: 0 }),
      withRepeat(withTiming(1, { duration: periode * 1000, easing: Easing.linear }), -1, false),
    );
    return () => cancelAnimation(phase);
  }, [actif, periode, phase]);

  return phase;
}
