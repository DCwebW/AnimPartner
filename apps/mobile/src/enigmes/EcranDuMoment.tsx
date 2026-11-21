import { themeDuMoment, type CleTheme } from '@animpartner/shared';
import { useEffect, useState } from 'react';
import { AppState, useWindowDimensions } from 'react-native';

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
  const [date, setDate] = useState(maintenant);

  useEffect(() => {
    const abonnement = AppState.addEventListener('change', (etat) => {
      if (etat === 'active') setDate(maintenant());
    });
    return () => abonnement.remove();
  }, [maintenant]);

  const cle = force ?? themeDuMoment(date);
  return <EcranEnigme palette={paletteDe(cle)} bandeau={bandeauDe(cle, width)} maintenant={date} />;
}
