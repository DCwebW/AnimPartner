import { getAnimatedStyle } from 'react-native-reanimated';
import { act, render, screen } from '@testing-library/react-native';

import { BandeauJourAn } from '@/bandeaux/BandeauJourAn';

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
  const el = screen.getByTestId('jour-an-confettis', { includeHiddenElements: true });
  const style = (
    getAnimatedStyle as unknown as (e: unknown) => { transform?: { translateY?: number }[] }
  )(el);
  return style.transform?.[0]?.translateY ?? 0;
};

describe('animations du bandeau du Jour de l’an', () => {
  it('les confettis tombent, puis la chute boucle sans dépasser 200 px', async () => {
    await render(<BandeauJourAn largeur={390} />);
    await avancer(8000);
    expect(decalage()).toBeGreaterThan(80);
    expect(decalage()).toBeLessThan(120);
    await avancer(9000);
    expect(decalage()).toBeGreaterThanOrEqual(0);
    expect(decalage()).toBeLessThan(40);
  }, 60000);

  it('animations réduites : rien ne bouge', async () => {
    mockAnimationsReduites = true;
    await render(<BandeauJourAn largeur={390} />);
    await avancer(8000);
    expect(decalage()).toBe(0);
  });
});
