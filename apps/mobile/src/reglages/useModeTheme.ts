import { MODE_AUTOMATIQUE, type ModeTheme } from '@animpartner/shared';
import { useCallback, useEffect, useState } from 'react';

import { ecrireModeTheme, lireModeTheme } from './modeTheme';

/** Mode de thème mémorisé : `charge` vaut false tant que la lecture n'est pas terminée. */
export function useModeTheme() {
  const [mode, setMode] = useState<ModeTheme>(MODE_AUTOMATIQUE);
  const [charge, setCharge] = useState(false);

  useEffect(() => {
    let actif = true;
    void lireModeTheme().then((lu) => {
      if (!actif) return;
      setMode(lu);
      setCharge(true);
    });
    return () => {
      actif = false;
    };
  }, []);

  const changer = useCallback((nouveau: ModeTheme) => {
    setMode(nouveau);
    setCharge(true);
    ecrireModeTheme(nouveau).catch(() => {});
  }, []);

  return { mode, charge, changer };
}
