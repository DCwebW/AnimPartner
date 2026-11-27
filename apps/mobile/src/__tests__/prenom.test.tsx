import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AccueilPrenom } from '@/enigmes/AccueilPrenom';
import { CLE_PRENOM, ecrirePrenom, lirePrenom } from '@/reglages/prenom';
import { reinitialiserModeTheme } from '@/reglages/useModeTheme';
import { reinitialiserPrenom } from '@/reglages/usePrenom';

const midi = () => new Date(2026, 6, 10, 12);
const soir = () => new Date(2026, 6, 10, 22);

beforeEach(async () => {
  await AsyncStorage.clear();
  reinitialiserPrenom();
  reinitialiserModeTheme();
});

async function ouvrir(maintenant = midi) {
  await render(<AccueilPrenom maintenant={maintenant} />, { wrapper: GestureHandlerRootView });
}

describe('stockage du prénom', () => {
  it('relit ce qui a été écrit, nettoyé', async () => {
    expect(await ecrirePrenom('  Léa  ')).toBe('Léa');
    expect(await lirePrenom()).toBe('Léa');
  });
  it('refuse un prénom vide', async () => {
    expect(await ecrirePrenom('   ')).toBeNull();
    expect(await AsyncStorage.getItem(CLE_PRENOM)).toBeNull();
  });
  it('tronque un prénom trop long', async () => {
    expect(await ecrirePrenom('a'.repeat(40))).toHaveLength(30);
  });
  it('donne null si la valeur est absente ou illisible', async () => {
    expect(await lirePrenom()).toBeNull();
    await AsyncStorage.setItem(CLE_PRENOM, '{cassé');
    expect(await lirePrenom()).toBeNull();
  });
});

describe('première ouverture', () => {
  it('pose la question avant l’énigme', async () => {
    await ouvrir();
    expect(screen.getByLabelText('Ton prénom')).toBeOnTheScreen();
    expect(screen.queryByRole('button', { name: 'Voir la réponse' })).toBeNull();
  });

  it('refuse un prénom vide', async () => {
    await ouvrir();
    await fireEvent.changeText(screen.getByLabelText('Ton prénom'), '   ');
    expect(screen.getByRole('button', { name: 'C’est parti' })).toBeDisabled();
  });

  it('enregistre le prénom nettoyé et salue par son nom', async () => {
    await ouvrir();
    await fireEvent.changeText(screen.getByLabelText('Ton prénom'), '  Camille ');
    await fireEvent.press(screen.getByRole('button', { name: 'C’est parti' }));
    await waitFor(() =>
      expect(screen.getByRole('header', { name: 'Bonjour, Camille' })).toBeOnTheScreen(),
    );
    expect(await AsyncStorage.getItem(CLE_PRENOM)).toBe('"Camille"');
  });

  it('limite la saisie à 30 caractères', async () => {
    await ouvrir();
    expect(screen.getByLabelText('Ton prénom').props.maxLength).toBe(30);
  });

  it('« Plus tard » passe sans prénom et n’enregistre rien', async () => {
    await ouvrir();
    await fireEvent.press(screen.getByRole('button', { name: 'Plus tard' }));
    expect(screen.getByRole('header', { name: 'Bonjour' })).toBeOnTheScreen();
    expect(await AsyncStorage.getItem(CLE_PRENOM)).toBeNull();
  });
});

describe('ouvertures suivantes', () => {
  it('n’affiche pas la question et salue par le prénom gardé', async () => {
    await ecrirePrenom('Léa');
    await ouvrir(soir);
    expect(screen.queryByLabelText('Ton prénom')).toBeNull();
    expect(screen.getByRole('header', { name: 'Bonsoir, Léa' })).toBeOnTheScreen();
  });
});
