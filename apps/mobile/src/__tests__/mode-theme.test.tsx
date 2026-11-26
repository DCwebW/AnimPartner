import AsyncStorage from '@react-native-async-storage/async-storage';
import { PALETTES } from '@animpartner/shared';
import { act, render, renderHook, screen, waitFor } from '@testing-library/react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { EcranDuMoment } from '@/enigmes/EcranDuMoment';
import { CLE_MODE_THEME, ecrireModeTheme, lireModeTheme } from '@/reglages/modeTheme';
import { useModeTheme } from '@/reglages/useModeTheme';

beforeEach(() => AsyncStorage.clear());

describe('stockage du mode de thème', () => {
  it('relit ce qui a été écrit', async () => {
    await ecrireModeTheme({ mode: 'fixe', theme: 'hiver' });
    expect(await lireModeTheme()).toEqual({ mode: 'fixe', theme: 'hiver' });
  });

  it('donne l’automatique si la clé manque, le JSON est cassé ou le thème inconnu', async () => {
    expect(await lireModeTheme()).toEqual({ mode: 'automatique' });
    await AsyncStorage.setItem(CLE_MODE_THEME, '{cassé');
    expect(await lireModeTheme()).toEqual({ mode: 'automatique' });
    await AsyncStorage.setItem(CLE_MODE_THEME, JSON.stringify({ mode: 'fixe', theme: 'plage' }));
    expect(await lireModeTheme()).toEqual({ mode: 'automatique' });
  });
});

describe('écran avec mode mémorisé', () => {
  const midiJuillet = () => new Date(2026, 6, 10, 12);

  it('rend dès le premier rendu visible la palette du thème fixe', async () => {
    await ecrireModeTheme({ mode: 'fixe', theme: 'nuit' });
    await render(<EcranDuMoment maintenant={midiJuillet} />, { wrapper: GestureHandlerRootView });
    expect(await screen.findByRole('header')).toHaveStyle({ color: PALETTES.nuit.encre });
  });

  it('applique un changement de mode sans remonter l’écran', async () => {
    const { result } = await renderHook(() => useModeTheme());
    await waitFor(() => expect(result.current.charge).toBe(true));
    expect(result.current.mode).toEqual({ mode: 'automatique' });
    await act(async () => result.current.changer({ mode: 'fixe', theme: 'noel' }));
    expect(result.current.mode).toEqual({ mode: 'fixe', theme: 'noel' });
    expect(await lireModeTheme()).toEqual({ mode: 'fixe', theme: 'noel' });
  });
});
