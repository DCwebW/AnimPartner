import { MODE_AUTOMATIQUE, type ModeTheme } from '@animpartner/shared';
import { useEffect, useSyncExternalStore } from 'react';

import { ecrireModeTheme, lireModeTheme } from './modeTheme';

type Etat = { mode: ModeTheme; charge: boolean };

// État partagé par tous les appels du hook : l'écran des paramètres et l'écran d'énigme
// voient le même mode, un changement s'applique partout tout de suite.
let etat: Etat = { mode: MODE_AUTOMATIQUE, charge: false };
let lectureLancee = false;
const ecouteurs = new Set<() => void>();

function publier(suivant: Etat) {
  etat = suivant;
  ecouteurs.forEach((ecouteur) => ecouteur());
}

function lancerLecture() {
  if (lectureLancee) return;
  lectureLancee = true;
  void lireModeTheme().then((lu) => {
    // Un changement fait pendant la lecture prime sur la valeur lue.
    if (!etat.charge) publier({ mode: lu, charge: true });
  });
}

function changer(nouveau: ModeTheme) {
  publier({ mode: nouveau, charge: true });
  ecrireModeTheme(nouveau).catch(() => {});
}

function abonner(ecouteur: () => void) {
  ecouteurs.add(ecouteur);
  return () => {
    ecouteurs.delete(ecouteur);
  };
}

/** Pour les tests : revient à l'état initial, avant toute lecture. */
export function reinitialiserModeTheme() {
  etat = { mode: MODE_AUTOMATIQUE, charge: false };
  lectureLancee = false;
}

/** Mode de thème mémorisé : `charge` vaut false tant que la lecture n'est pas terminée. */
export function useModeTheme() {
  const courant = useSyncExternalStore(
    abonner,
    () => etat,
    () => etat,
  );
  useEffect(lancerLecture, []);
  return { mode: courant.mode, charge: courant.charge, changer };
}
