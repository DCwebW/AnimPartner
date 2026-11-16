import { CATALOGUE } from '@animpartner/shared';
import { render, screen } from '@testing-library/react-native';

import Accueil from '@/app/index';
import { lierQuestion } from '@/enigmes/typographie';

describe("Écran d'accueil", () => {
  it('montre une énigme du catalogue en thème beau temps', async () => {
    await render(<Accueil />);

    expect(screen.getByRole('header', { name: 'Bonjour' })).toBeOnTheScreen();
    const affichee = CATALOGUE.filter((e) => screen.queryByText(lierQuestion(e.question)) !== null);
    expect(affichee).toHaveLength(1);
    expect(screen.getByRole('button', { name: 'Voir la réponse' })).toBeOnTheScreen();
  });
});
