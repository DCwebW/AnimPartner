import { themeAffiche } from '@animpartner/shared';

import { useModeTheme } from '@/reglages/useModeTheme';
import { usePrenom } from '@/reglages/usePrenom';
import { paletteDe } from '@/theme/themes';

import { EcranDuMoment } from './EcranDuMoment';
import { FormulairePrenom } from './FormulairePrenom';

type Props = { maintenant?: () => Date };

const horloge = () => new Date();

/** Pose la question du prénom à la première ouverture, puis l'écran d'énigme. */
export function AccueilPrenom({ maintenant = horloge }: Props) {
  const { prenom, charge, passe, enregistrer, passer } = usePrenom();
  const { mode, charge: modeCharge } = useModeTheme();

  // Rien avant la lecture : ni question inutile, ni énigme sans prénom remplacée ensuite.
  if (!charge || !modeCharge) return null;
  if (prenom === null && !passe) {
    return (
      <FormulairePrenom
        palette={paletteDe(themeAffiche(mode, maintenant()))}
        onValider={(saisi) => void enregistrer(saisi)}
        onPlusTard={passer}
      />
    );
  }
  return <EcranDuMoment maintenant={maintenant} />;
}
