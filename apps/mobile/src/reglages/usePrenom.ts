import { nettoyerPrenom } from '@animpartner/shared';
import { useEffect, useSyncExternalStore } from 'react';

import { ecrirePrenom, lirePrenom } from './prenom';

type Etat = { prenom: string | null; charge: boolean; passe: boolean };

// État partagé par tous les appels du hook, comme `useModeTheme`.
let etat: Etat = { prenom: null, charge: false, passe: false };
let lectureLancee = false;
const ecouteurs = new Set<() => void>();

function publier(suivant: Etat) {
  etat = suivant;
  ecouteurs.forEach((ecouteur) => ecouteur());
}

function lancerLecture() {
  if (lectureLancee) return;
  lectureLancee = true;
  void lirePrenom().then((lu) => {
    if (!etat.charge) publier({ ...etat, prenom: lu, charge: true });
  });
}

async function enregistrer(saisi: string) {
  const prenom = nettoyerPrenom(saisi);
  if (prenom === '') return;
  // Si l'écriture échoue, le prénom sert quand même pour cette session.
  await ecrirePrenom(prenom).catch(() => {});
  publier({ prenom, charge: true, passe: true });
}

/** « Plus tard » : pas de prénom pour cette session, la question reviendra à l'ouverture suivante. */
function passer() {
  publier({ ...etat, passe: true });
}

function abonner(ecouteur: () => void) {
  ecouteurs.add(ecouteur);
  return () => {
    ecouteurs.delete(ecouteur);
  };
}

/** Pour les tests : revient à l'état initial, avant toute lecture. */
export function reinitialiserPrenom() {
  etat = { prenom: null, charge: false, passe: false };
  lectureLancee = false;
}

/** Prénom mémorisé sur le téléphone ; `charge` vaut false tant que la lecture n'est pas finie. */
export function usePrenom() {
  const courant = useSyncExternalStore(
    abonner,
    () => etat,
    () => etat,
  );
  useEffect(lancerLecture, []);
  return { ...courant, enregistrer, passer };
}
