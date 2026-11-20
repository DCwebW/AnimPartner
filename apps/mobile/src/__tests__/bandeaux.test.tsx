import { render, screen } from '@testing-library/react-native';
import type { ComponentType } from 'react';

import { BandeauAutomne } from '@/bandeaux/BandeauAutomne';
import { BandeauHiver } from '@/bandeaux/BandeauHiver';
import { BandeauNuit } from '@/bandeaux/BandeauNuit';
import { BandeauVent } from '@/bandeaux/BandeauVent';

const BANDEAUX: [string, string, ComponentType<{ largeur: number }>][] = [
  ['beau temps', 'bandeau-vent', BandeauVent],
  ['nuit', 'bandeau-nuit', BandeauNuit],
  ['hiver', 'bandeau-hiver', BandeauHiver],
  ['automne', 'bandeau-automne', BandeauAutomne],
];

describe.each(BANDEAUX)('bandeau %s', (_nom, testID, Bandeau) => {
  it('se rend sans erreur', async () => {
    await render(<Bandeau largeur={390} />);
    expect(screen.getByTestId(testID, { includeHiddenElements: true })).toBeTruthy();
  });

  it('garde les proportions de la planche selon la largeur', async () => {
    await render(<Bandeau largeur={780} />);
    const svg = screen.getByTestId(testID, { includeHiddenElements: true });
    expect(svg.props.width).toBe(780);
    expect(svg.props.height).toBe(400);
  });

  it('reste caché des lecteurs d’écran', async () => {
    await render(<Bandeau largeur={390} />);
    const svg = screen.getByTestId(testID, { includeHiddenElements: true });
    expect(svg.props.importantForAccessibility).toBe('no-hide-descendants');
  });
});
