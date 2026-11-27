import { salutationDuMoment, themeAffiche, type CleTheme } from '@animpartner/shared';
import { useEffect, useState } from 'react';
import { AppState, useWindowDimensions } from 'react-native';

import { usePrenom } from '@/reglages/usePrenom';
import { useModeTheme } from '@/reglages/useModeTheme';
import { bandeauDe, paletteDe } from '@/theme/themes';

import { EcranEnigme } from './EcranEnigme';

type Props = {
  /** Thème imposé, pour la recette ; sinon celui de la date et de l'heure. */
  force?: CleTheme;
  /** Horloge injectable pour les tests. */
  maintenant?: () => Date;
};

const horloge = () => new Date();

/** L'écran d'énigme dans le thème du moment, recalculé au retour de l'app au premier plan. */
export function EcranDuMoment({ force, maintenant = horloge }: Props) {
  const { width } = useWindowDimensions();
  const { mode, charge } = useModeTheme();
  const { prenom, charge: prenomCharge } = usePrenom();
  const [date, setDate] = useState(maintenant);

  useEffect(() => {
    const abonnement = AppState.addEventListener('change', (etat) => {
      if (etat === 'active') setDate(maintenant());
    });
    return () => abonnement.remove();
  }, [maintenant]);

  // Rien tant que le mode mémorisé n'est pas lu : pas de thème par défaut remplacé ensuite.
  if (!(charge && prenomCharge) && !force) return null;
  const cle = force ?? themeAffiche(mode, date);
  // La salutation suit l'heure, jamais le mode ; le thème forcé (recette) garde celle de sa palette.
  const base = paletteDe(cle);
  const palette = force ? base : { ...base, salut: salutationDuMoment(date) };
  return (
    <EcranEnigme
      palette={palette}
      bandeau={bandeauDe(cle, width)}
      maintenant={date}
      prenom={prenom}
    />
  );
}
