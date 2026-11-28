import type { AgeGroupe } from '@animpartner/shared';
import { useEffect, useSyncExternalStore } from 'react';

import { ecrireAgeGroupe, lireAgeGroupe } from './ageGroupe';

type Etat = { age: AgeGroupe; charge: boolean };

// État partagé par tous les appels du hook, comme pour le mode de thème.
let etat: Etat = { age: null, charge: false };
let lectureLancee = false;
const ecouteurs = new Set<() => void>();

function publier(suivant: Etat) {
  etat = suivant;
  ecouteurs.forEach((ecouteur) => ecouteur());
}

function lancerLecture() {
  if (lectureLancee) return;
  lectureLancee = true;
  void lireAgeGroupe().then((lu) => {
    // Un changement fait pendant la lecture prime sur la valeur lue.
    if (!etat.charge) publier({ age: lu, charge: true });
  });
}

function changer(nouveau: AgeGroupe) {
  publier({ age: nouveau, charge: true });
  ecrireAgeGroupe(nouveau).catch(() => {});
}

function abonner(ecouteur: () => void) {
  ecouteurs.add(ecouteur);
  return () => {
    ecouteurs.delete(ecouteur);
  };
}

/** Pour les tests : revient à l'état initial, avant toute lecture. */
export function reinitialiserAgeGroupe() {
  etat = { age: null, charge: false };
  lectureLancee = false;
}

/** Âge du groupe mémorisé : `charge` vaut false tant que la lecture n'est pas terminée. */
export function useAgeGroupe() {
  const courant = useSyncExternalStore(
    abonner,
    () => etat,
    () => etat,
  );
  useEffect(lancerLecture, []);
  return { age: courant.age, charge: courant.charge, changer };
}
