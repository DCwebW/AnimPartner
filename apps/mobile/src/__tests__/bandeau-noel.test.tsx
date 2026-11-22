import { getAnimatedStyle } from 'react-native-reanimated';
import { act, render, screen } from '@testing-library/react-native';

import { BandeauNoel } from '@/bandeaux/BandeauNoel';

let mockAnimationsReduites = false;
jest.mock('react-native-reanimated', () => ({
  __esModule: true,
  ...jest.requireActual('react-native-reanimated'),
  useReducedMotion: () => mockAnimationsReduites,
}));

beforeEach(() => {
  jest.useFakeTimers();
  mockAnimationsReduites = false;
});
afterEach(() => jest.useRealTimers());

const avancer = async (ms: number) => {
  await act(async () => {
    jest.advanceTimersByTime(ms);
  });
};

const decalage = (): number => {
  const el = screen.getByTestId('noel-confettis', { includeHiddenElements: true });
  // Les types de reanimated déclarent `getAnimatedStyle` sans paramètre ni retour : on les précise.
  const style = (
    getAnimatedStyle as unknown as (e: unknown) => { transform?: { translateY?: number }[] }
  )(el);
  return style.transform?.[0]?.translateY ?? 0;
};

describe('animations du bandeau de Noël', () => {
  it('les confettis tombent, puis la chute boucle sans dépasser 200 px', async () => {
    await render(<BandeauNoel largeur={390} />);
    await avancer(8000);
    expect(decalage()).toBeGreaterThan(80);
    expect(decalage()).toBeLessThan(120);
    await avancer(9000); // 17 s : un tour complet et un peu plus
    expect(decalage()).toBeGreaterThanOrEqual(0);
    expect(decalage()).toBeLessThan(40);
  }, 60000);

  it('animations réduites : rien ne bouge', async () => {
    mockAnimationsReduites = true;
    await render(<BandeauNoel largeur={390} />);
    await avancer(8000);
    expect(decalage()).toBe(0);
  });
});
