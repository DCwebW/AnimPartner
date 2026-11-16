import { act, render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { Lancement } from '@/lancement/Lancement';

let mockAnimationsReduites = false;
jest.mock('react-native-reanimated', () => ({
  __esModule: true,
  ...jest.requireActual('react-native-reanimated'),
  useReducedMotion: () => mockAnimationsReduites,
}));

const avancer = async (ms: number) => {
  await act(async () => {
    jest.advanceTimersByTime(ms);
  });
};

describe('écran de chargement', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    mockAnimationsReduites = false;
  });

  it('affiche le logotype libellé « AnimPartner »', async () => {
    await render(
      <Lancement affiche pret={false}>
        <Text>Accueil</Text>
      </Lancement>,
    );

    expect(screen.getByRole('image', { name: 'AnimPartner' })).toBeOnTheScreen();
  });

  it('ne compte pas la durée minimale tant que le splash natif est affiché', async () => {
    const { rerender } = await render(
      <Lancement affiche={false} pret>
        <Text>Accueil</Text>
      </Lancement>,
    );

    await avancer(5000);
    expect(screen.getByRole('image', { name: 'AnimPartner' })).toBeOnTheScreen();

    await rerender(
      <Lancement affiche pret>
        <Text>Accueil</Text>
      </Lancement>,
    );
    await avancer(1000);
    expect(screen.getByRole('image', { name: 'AnimPartner' })).toBeOnTheScreen();

    await avancer(400);
    expect(screen.queryByRole('image', { name: 'AnimPartner' })).not.toBeOnTheScreen();
  });

  it("reste affiché tant que l'application n'est pas prête", async () => {
    await render(
      <Lancement affiche pret={false}>
        <Text>Accueil</Text>
      </Lancement>,
    );

    await avancer(5000);

    expect(screen.getByRole('image', { name: 'AnimPartner' })).toBeOnTheScreen();
  });

  it("laisse place à l'écran d'accueil après la durée minimale et le fondu", async () => {
    await render(
      <Lancement affiche pret>
        <Text>Accueil</Text>
      </Lancement>,
    );

    await avancer(1000);
    expect(screen.getByRole('image', { name: 'AnimPartner' })).toBeOnTheScreen();

    await avancer(400);
    expect(screen.queryByRole('image', { name: 'AnimPartner' })).not.toBeOnTheScreen();
    expect(screen.getByText('Accueil')).toBeOnTheScreen();
  });

  it("passe vite à l'accueil quand les animations sont réduites", async () => {
    mockAnimationsReduites = true;

    await render(
      <Lancement affiche pret>
        <Text>Accueil</Text>
      </Lancement>,
    );

    await avancer(200);
    expect(screen.queryByRole('image', { name: 'AnimPartner' })).not.toBeOnTheScreen();
    expect(screen.getByText('Accueil')).toBeOnTheScreen();
  });
});
