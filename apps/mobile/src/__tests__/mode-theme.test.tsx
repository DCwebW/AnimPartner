import AsyncStorage from '@react-native-async-storage/async-storage';
import { PALETTES, type ModeTheme } from '@animpartner/shared';
import { act, render, renderHook, screen, waitFor } from '@testing-library/react-native';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { EcranDuMoment } from '@/enigmes/EcranDuMoment';
import { CLE_MODE_THEME, ecrireModeTheme, lireModeTheme } from '@/reglages/modeTheme';
import { reinitialiserModeTheme, useModeTheme } from '@/reglages/useModeTheme';

beforeEach(async () => {
  await AsyncStorage.clear();
  reinitialiserModeTheme();
});

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

const pilote: { changer?: (mode: ModeTheme) => void } = {};
function Pilote() {
  const { changer } = useModeTheme();
  useEffect(() => {
    pilote.changer = changer;
  }, [changer]);
  return null;
}

describe('écran avec mode mémorisé', () => {
  const midiJuillet = () => new Date(2026, 6, 10, 12);

  it('rend dès le premier rendu visible la palette du thème fixe', async () => {
    await ecrireModeTheme({ mode: 'fixe', theme: 'nuit' });
    // Le premier rendu visible porte déjà la palette du mode mémorisé, jamais celle par défaut.
    await render(<EcranDuMoment maintenant={midiJuillet} />, { wrapper: GestureHandlerRootView });
    const titres = screen.queryAllByRole('header');
    expect(titres).toHaveLength(1);
    expect(titres[0]).toHaveStyle({ color: PALETTES.nuit.encre });
    // La salutation suit l'heure : « Bonjour » à midi, même avec le thème nuit.
    expect(titres[0]).toHaveTextContent('Bonjour');
  });

  it('applique un changement de mode à l’écran sans le remonter', async () => {
    await render(
      <>
        <EcranDuMoment maintenant={midiJuillet} />
        <Pilote />
      </>,
      { wrapper: GestureHandlerRootView },
    );
    const titre = await screen.findByRole('header', { name: 'Bonjour' });
    expect(titre).toHaveStyle({ color: PALETTES.beauTemps.encre });
    await act(async () => pilote.changer?.({ mode: 'fixe', theme: 'noel' }));
    expect(screen.getByRole('header', { name: 'Bonjour' })).toHaveStyle({
      color: PALETTES.noel.encre,
    });
    expect(await lireModeTheme()).toEqual({ mode: 'fixe', theme: 'noel' });
  });

  it('garde le mode choisi pendant la lecture initiale', async () => {
    await ecrireModeTheme({ mode: 'fixe', theme: 'hiver' });
    const { result } = await renderHook(() => useModeTheme());
    await act(async () => result.current.changer({ mode: 'aleatoire' }));
    await waitFor(() => expect(result.current.charge).toBe(true));
    expect(result.current.mode).toEqual({ mode: 'aleatoire' });
  });
});
