import { render, screen } from '@testing-library/react-native';

import Accueil from '@/app/index';

describe("Écran d'accueil", () => {
  it('affiche le titre « AnimPartner »', async () => {
    await render(<Accueil />);

    expect(screen.getByRole('header', { name: 'AnimPartner' })).toBeOnTheScreen();
  });
});
