import { CATALOGUE } from '@animpartner/shared';
import { render, screen } from '@testing-library/react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import Accueil from '@/app/index';
import { lierQuestion } from '@/enigmes/typographie';

describe("Écran d'accueil", () => {
  // L'accueil suit l'heure du téléphone : on la fixe en début d'après-midi.
  beforeAll(() => {
    jest.useFakeTimers({
      doNotFake: [
        'setTimeout',
        'clearTimeout',
        'setInterval',
        'clearInterval',
        'setImmediate',
        'clearImmediate',
        'nextTick',
        'queueMicrotask',
        'requestAnimationFrame',
        'cancelAnimationFrame',
      ],
    });
    jest.setSystemTime(new Date(2026, 3, 15, 14));
  });
  afterAll(() => jest.useRealTimers());

  it('montre une énigme du catalogue dans le thème du moment', async () => {
    await render(<Accueil />, { wrapper: GestureHandlerRootView });

    expect(screen.getByRole('header', { name: 'Bonjour' })).toBeOnTheScreen();
    const affichee = CATALOGUE.filter((e) => screen.queryByText(lierQuestion(e.question)) !== null);
    expect(affichee).toHaveLength(1);
    expect(screen.getByRole('button', { name: 'Voir la réponse' })).toBeOnTheScreen();
  });
});
