import AsyncStorage from '@react-native-async-storage/async-storage';
import { PALETTES, enigmesPourAge, type Enigme } from '@animpartner/shared';
import { act, fireEvent, render, renderHook, screen, waitFor } from '@testing-library/react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { EcranEnigme } from '@/enigmes/EcranEnigme';
import { CLE_AGE_GROUPE, ecrireAgeGroupe, lireAgeGroupe } from '@/reglages/ageGroupe';
import { reinitialiserAgeGroupe, useAgeGroupe } from '@/reglages/useAgeGroupe';

beforeEach(async () => {
  jest.useFakeTimers();
  await AsyncStorage.clear();
  reinitialiserAgeGroupe();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('stockage de l’âge du groupe', () => {
  it('relit ce qui a été écrit', async () => {
    await ecrireAgeGroupe(7);
    expect(await lireAgeGroupe()).toBe(7);
    await ecrireAgeGroupe(null);
    expect(await lireAgeGroupe()).toBeNull();
  });

  it('donne null si la clé manque, le JSON est cassé ou la valeur hors bornes', async () => {
    expect(await lireAgeGroupe()).toBeNull();
    await AsyncStorage.setItem(CLE_AGE_GROUPE, '{cassé');
    expect(await lireAgeGroupe()).toBeNull();
    await AsyncStorage.setItem(CLE_AGE_GROUPE, '2');
    expect(await lireAgeGroupe()).toBeNull();
    await AsyncStorage.setItem(CLE_AGE_GROUPE, '"7"');
    expect(await lireAgeGroupe()).toBeNull();
  });
});

describe('hook useAgeGroupe', () => {
  it('charge la valeur mémorisée puis écrit les changements', async () => {
    await ecrireAgeGroupe(5);
    const { result } = await renderHook(() => useAgeGroupe());
    await waitFor(() => expect(result.current.charge).toBe(true));
    expect(result.current.age).toBe(5);

    await act(async () => result.current.changer(9));
    expect(result.current.age).toBe(9);
    expect(await AsyncStorage.getItem(CLE_AGE_GROUPE)).toBe('9');
  });
});

const base = {
  explication: 'Une explication.',
  statut: 'validee',
  source: 'manuelle',
  creeePar: 'porteur',
} as const;

const enigmes: Enigme[] = [
  { ...base, id: 'petit', question: 'Petit ?', reponse: 'RP', ageMin: 3, ageMax: 5 },
  { ...base, id: 'moyen', question: 'Moyen ?', reponse: 'RM', ageMin: 6, ageMax: 9 },
  { ...base, id: 'moyen2', question: 'Moyen deux ?', reponse: 'RM2', ageMin: 6, ageMax: 9 },
  { ...base, id: 'grand', question: 'Grand ?', reponse: 'RG', ageMin: 10, ageMax: 12 },
];

const ids = () => enigmes.filter((e) => screen.queryByText(e.question) !== null).map((e) => e.id);

const ecran = (age: number | null, aleatoire?: () => number) => (
  <EcranEnigme
    enigmes={enigmes}
    age={age}
    aleatoire={aleatoire}
    maintenant={new Date(2026, 3, 15, 10)}
    palette={PALETTES.beauTemps}
    bandeau={null}
  />
);

describe('écran filtré par âge', () => {
  it('repart au recto quand l’énigme affichée est remplacée', async () => {
    const { rerender } = await render(
      ecran(3, () => 0),
      { wrapper: GestureHandlerRootView },
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Voir la réponse' }));
    await act(async () => {
      jest.advanceTimersByTime(2000);
    });
    expect(screen.getByRole('button', { name: "Revoir l'énigme" })).toBeOnTheScreen();
    await rerender(ecran(11, () => 0));
    expect(ids()).toEqual(['grand']);
    expect(screen.getByRole('button', { name: 'Voir la réponse' })).toBeOnTheScreen();
  });

  it('ne redonne pas l’énigme conservée en premier et respecte le filtre ensuite', async () => {
    const { rerender } = await render(
      ecran(7, () => 0),
      { wrapper: GestureHandlerRootView },
    );
    const avant = ids()[0]!;
    const age = 8;
    await rerender(ecran(age, () => 0));
    expect(ids()).toEqual([avant]);
    await fireEvent.press(screen.getByRole('button', { name: 'Une autre énigme' }));
    await act(async () => {
      jest.advanceTimersByTime(2000);
    });
    const apres = ids();
    expect(apres).toHaveLength(1);
    expect(apres[0]).not.toBe(avant);
    expect(enigmesPourAge(enigmes, age).map((e) => e.id)).toContain(apres[0]);
  });

  it('retombe sur toutes les énigmes quand un changement d’âge ne laisse rien', async () => {
    const seules = enigmes.filter((e) => e.ageMax < 6);
    const vue = (age: number) => (
      <EcranEnigme
        enigmes={seules}
        age={age}
        maintenant={new Date(2026, 3, 15, 10)}
        palette={PALETTES.beauTemps}
        bandeau={null}
      />
    );
    const { rerender } = await render(vue(4), { wrapper: GestureHandlerRootView });
    await rerender(vue(11));
    expect(screen.getByText('Petit\u00a0?')).toBeOnTheScreen();
  });

  it('ne montre que des énigmes compatibles, dès le premier rendu', async () => {
    const compatibles = enigmesPourAge(enigmes, 7).map((e) => e.id);
    for (let i = 0; i < 20; i++) {
      const { unmount } = await render(ecran(7), { wrapper: GestureHandlerRootView });
      expect(ids()).toHaveLength(1);
      expect(compatibles).toContain(ids()[0]);
      await unmount();
    }
  });

  it('garde l’énigme affichée si elle convient au nouvel âge', async () => {
    const { rerender } = await render(
      ecran(null, () => 0),
      { wrapper: GestureHandlerRootView },
    );
    const avant = ids();
    const age = enigmes.find((e) => e.id === avant[0])!.ageMin;
    await rerender(ecran(age, () => 0));
    expect(ids()).toEqual(avant);
  });

  it('remplace une énigme incompatible par une compatible, au recto', async () => {
    const { rerender } = await render(
      ecran(3, () => 0),
      { wrapper: GestureHandlerRootView },
    );
    expect(ids()).toEqual(['petit']);
    await rerender(ecran(11, () => 0));
    expect(ids()).toEqual(['grand']);
    expect(screen.getByRole('button', { name: 'Voir la réponse' })).toBeOnTheScreen();
  });

  it('retombe sur toutes les énigmes si le filtre est vide', async () => {
    await render(ecran(11), { wrapper: GestureHandlerRootView });
    expect(ids()).toHaveLength(1);
    screen.unmount();
    const seules = enigmes.filter((e) => e.ageMax < 6);
    await render(
      <EcranEnigme
        enigmes={seules}
        age={11}
        maintenant={new Date(2026, 3, 15, 10)}
        palette={PALETTES.beauTemps}
        bandeau={null}
      />,
      { wrapper: GestureHandlerRootView },
    );
    expect(screen.getByText('Petit ?')).toBeOnTheScreen();
  });
});
