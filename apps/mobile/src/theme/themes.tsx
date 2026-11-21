import { PALETTES, type CleTheme, type Palette } from '@animpartner/shared';
import type { ReactNode } from 'react';

import { BandeauAutomne } from '@/bandeaux/BandeauAutomne';
import { BandeauHiver } from '@/bandeaux/BandeauHiver';
import { BandeauNuit } from '@/bandeaux/BandeauNuit';
import { BandeauVent } from '@/bandeaux/BandeauVent';

export function paletteDe(cle: CleTheme): Palette {
  return PALETTES[cle];
}

/** La scène du bandeau du thème, à la largeur de l'écran. */
export function bandeauDe(cle: CleTheme, largeur: number): ReactNode {
  switch (cle) {
    case 'nuit':
      return <BandeauNuit largeur={largeur} />;
    case 'hiver':
      return <BandeauHiver largeur={largeur} />;
    case 'automne':
      return <BandeauAutomne largeur={largeur} />;
    default:
      return <BandeauVent largeur={largeur} />;
  }
}
