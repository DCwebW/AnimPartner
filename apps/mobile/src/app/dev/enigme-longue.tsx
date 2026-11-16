import { PALETTES, type Enigme } from '@animpartner/shared';
import { useWindowDimensions } from 'react-native';

import { BandeauVent } from '@/bandeaux/BandeauVent';
import { EcranEnigme } from '@/enigmes/EcranEnigme';

// Route de développement : une question de la longueur maximale (140 caractères), pour
// vérifier qu'elle tient dans l'étiquette sans être coupée.
const QUESTION =
  'Je suis une longue énigme écrite pour la recette avec des mots ordinaires et assez de lettres pour remplir ici toute la place. Qui suis-je\u00a0?';

const LONGUE: Enigme = {
  id: 'recette-longue',
  question: QUESTION,
  reponse: 'Une énigme de recette',
  explication: 'Elle sert seulement à vérifier la place disponible dans l’étiquette.',
  ageMin: 7,
  ageMax: 10,
  statut: 'draft',
  source: 'manuelle',
  creeePar: 'porteur',
};

export default function DevEnigmeLongue() {
  const { width } = useWindowDimensions();
  return (
    <EcranEnigme
      palette={PALETTES.beauTemps}
      bandeau={<BandeauVent largeur={width} />}
      enigmes={[LONGUE]}
    />
  );
}
