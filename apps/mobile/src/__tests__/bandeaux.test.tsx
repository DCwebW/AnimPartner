import { render, screen } from '@testing-library/react-native';

import { BandeauVent } from '@/bandeaux/BandeauVent';

describe('bandeau beau temps', () => {
  it('se rend sans erreur', async () => {
    await render(<BandeauVent largeur={390} />);
    expect(screen.getByTestId('bandeau-vent', { includeHiddenElements: true })).toBeTruthy();
  });

  it('garde les proportions de la planche selon la largeur', async () => {
    await render(<BandeauVent largeur={780} />);
    const svg = screen.getByTestId('bandeau-vent', { includeHiddenElements: true });
    expect(svg.props.width).toBe(780);
    expect(svg.props.height).toBe(400);
  });
});
