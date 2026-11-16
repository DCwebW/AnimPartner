import { PALETTES } from '@animpartner/shared';
import { useWindowDimensions } from 'react-native';

import { BandeauVent } from '@/bandeaux/BandeauVent';
import { EcranEnigme } from '@/enigmes/EcranEnigme';

// Écran d'accueil : l'énigme du moment, en thème beau temps. Le thème suivra le moment
// de la journée et la saison avec l'issue #12.
export default function Accueil() {
  const { width } = useWindowDimensions();

  return <EcranEnigme palette={PALETTES.beauTemps} bandeau={<BandeauVent largeur={width} />} />;
}
