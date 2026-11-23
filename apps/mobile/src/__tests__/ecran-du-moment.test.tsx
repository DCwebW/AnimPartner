import { PALETTES } from '@animpartner/shared';
import { act, render, screen } from '@testing-library/react-native';
import { AppState, type AppStateStatus } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useLocalSearchParams } from 'expo-router';

import DevTheme from '@/app/dev/theme';
import { EcranDuMoment } from '@/enigmes/EcranDuMoment';
import { bandeauDe, paletteDe } from '@/theme/themes';

jest.mock('expo-router', () => ({ useLocalSearchParams: jest.fn() }));
const paramsMock = useLocalSearchParams as jest.Mock;

let ecouteur: ((etat: AppStateStatus) => void) | undefined;

beforeEach(() => {
  ecouteur = undefined;
  jest.spyOn(AppState, 'addEventListener').mockImplementation((_type, fn) => {
    ecouteur = fn;
    return { remove: jest.fn() };
  });
});
afterEach(() => jest.restoreAllMocks());

describe('thème du moment', () => {
  it('prend la palette de beau temps un après-midi de printemps', async () => {
    await render(<EcranDuMoment maintenant={() => new Date(2026, 3, 15, 14)} />, {
      wrapper: GestureHandlerRootView,
    });
    expect(screen.getByRole('header', { name: 'Bonjour' })).toBeOnTheScreen();
    expect(screen.getByText('Mercredi 15 avril')).toBeOnTheScreen();
  });

  it('dit « Bonsoir » la nuit', async () => {
    await render(<EcranDuMoment maintenant={() => new Date(2026, 3, 15, 22)} />, {
      wrapper: GestureHandlerRootView,
    });
    expect(screen.getByRole('header', { name: 'Bonsoir' })).toBeOnTheScreen();
  });

  it('dit « Bonjour » en hiver et en automne dans la journée', async () => {
    const hiver = await render(<EcranDuMoment maintenant={() => new Date(2026, 0, 10, 12)} />, {
      wrapper: GestureHandlerRootView,
    });
    expect(screen.getByRole('header', { name: 'Bonjour' })).toBeOnTheScreen();
    await hiver.unmount();
    await render(<EcranDuMoment maintenant={() => new Date(2026, 9, 10, 12)} />, {
      wrapper: GestureHandlerRootView,
    });
    expect(screen.getByRole('header', { name: 'Bonjour' })).toBeOnTheScreen();
  });

  it('recalcule le thème au retour au premier plan', async () => {
    let heure = 14;
    await render(<EcranDuMoment maintenant={() => new Date(2026, 3, 15, heure)} />, {
      wrapper: GestureHandlerRootView,
    });
    expect(screen.getByRole('header', { name: 'Bonjour' })).toBeOnTheScreen();

    heure = 21;
    await act(async () => ecouteur?.('active'));
    expect(screen.getByRole('header', { name: 'Bonsoir' })).toBeOnTheScreen();
  });

  it("ne recalcule pas quand l'app passe en arrière-plan", async () => {
    let heure = 14;
    await render(<EcranDuMoment maintenant={() => new Date(2026, 3, 15, heure)} />, {
      wrapper: GestureHandlerRootView,
    });
    heure = 21;
    await act(async () => ecouteur?.('background'));
    expect(screen.getByRole('header', { name: 'Bonjour' })).toBeOnTheScreen();
  });

  it('un thème forcé ignore la date', async () => {
    await render(<EcranDuMoment force="nuit" maintenant={() => new Date(2026, 3, 15, 14)} />, {
      wrapper: GestureHandlerRootView,
    });
    expect(screen.getByRole('header', { name: 'Bonsoir' })).toBeOnTheScreen();
  });
});

describe('couleurs par thème', () => {
  it.each([
    ['beauTemps', new Date(2026, 3, 15, 14)],
    ['nuit', new Date(2026, 3, 15, 22)],
    ['hiver', new Date(2026, 0, 10, 12)],
    ['automne', new Date(2026, 9, 10, 12)],
    ['noel', new Date(2026, 11, 15, 12)],
  ] as const)('%s : le titre prend l’encre de la palette', async (cle, date) => {
    await render(<EcranDuMoment maintenant={() => date} />, { wrapper: GestureHandlerRootView });
    expect(screen.getByRole('header')).toHaveStyle({ color: PALETTES[cle].encre });
  });

  it('met la date à jour au retour au premier plan', async () => {
    let jour = 15;
    await render(<EcranDuMoment maintenant={() => new Date(2026, 3, jour, 14)} />, {
      wrapper: GestureHandlerRootView,
    });
    expect(screen.getByText('Mercredi 15 avril')).toBeOnTheScreen();
    jour = 16;
    await act(async () => ecouteur?.('active'));
    expect(screen.getByText('Jeudi 16 avril')).toBeOnTheScreen();
  });
});

describe('table des thèmes', () => {
  it('associe une palette et un bandeau à chaque thème', () => {
    for (const cle of ['beauTemps', 'nuit', 'hiver', 'automne', 'noel'] as const) {
      expect(paletteDe(cle)).toBe(PALETTES[cle]);
      expect(bandeauDe(cle, 390)).toBeTruthy();
    }
  });
});

describe('route de développement', () => {
  it('force le thème demandé dans l’adresse', async () => {
    paramsMock.mockReturnValue({ theme: 'nuit' });
    await render(<DevTheme />, { wrapper: GestureHandlerRootView });
    expect(screen.getByRole('header', { name: 'Bonsoir' })).toBeOnTheScreen();
  });

  it('retombe sur le thème du moment si la valeur est inconnue', async () => {
    paramsMock.mockReturnValue({ theme: 'zzz' });
    await render(<DevTheme />, { wrapper: GestureHandlerRootView });
    expect(screen.getByRole('header')).toBeOnTheScreen();
  });
});
