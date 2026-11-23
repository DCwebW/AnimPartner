import { PALETTES, type Enigme } from '@animpartner/shared';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { AccessibilityInfo } from 'react-native';

import { EcranEnigme } from '@/enigmes/EcranEnigme';
import { DUREE_FONDU_REDUIT_MS, DUREE_RETOURNEMENT_MS } from '@/enigmes/retournement';

let mockAnimationsReduites = false;
jest.mock('react-native-reanimated', () => ({
  __esModule: true,
  ...jest.requireActual('react-native-reanimated'),
  useReducedMotion: () => mockAnimationsReduites,
}));

const base = {
  explication: 'Une explication.',
  ageMin: 7,
  ageMax: 10,
  statut: 'validee',
  source: 'manuelle',
  creeePar: 'porteur',
  valideePar: 'porteur',
} as const;

const enigmes: Enigme[] = [
  { ...base, id: 'a', question: 'Question A\u00a0?', reponse: 'Réponse A' },
  { ...base, id: 'b', question: 'Question B\u00a0?', reponse: 'Réponse B' },
  { ...base, id: 'c', question: 'Question C\u00a0?', reponse: 'Réponse C' },
];

// Toujours 0 : le mélange de Fisher–Yates est alors déterministe.
const aleatoire = () => 0;

const rendre = () =>
  render(
    <EcranEnigme
      enigmes={enigmes}
      aleatoire={aleatoire}
      maintenant={new Date(2026, 3, 15, 10)}
      palette={PALETTES.beauTemps}
      bandeau={null}
    />,
  );

const questionAffichee = () =>
  enigmes.find((e) => screen.queryByText(e.question) !== null)?.question;

const enigmeAffichee = () => enigmes.find((e) => e.question === questionAffichee())!;

const avancer = async (ms: number) => {
  await act(async () => {
    jest.advanceTimersByTime(ms);
  });
};

/** Appuie sur un bouton puis laisse le retournement aller à son terme. */
const appuyer = async (libelle: string) => {
  await fireEvent.press(screen.getByRole('button', { name: libelle }));
  await avancer(DUREE_RETOURNEMENT_MS + 50);
};

beforeEach(() => {
  jest.useFakeTimers();
  // Déjà un mock dans la configuration Jest de React Native : on oublie ses appels.
  jest.clearAllMocks();
});

afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
  mockAnimationsReduites = false;
});

describe("écran d'énigme", () => {
  it('salue, donne la date du jour en français et montre une énigme au recto', async () => {
    await rendre();

    expect(screen.getByText('Bonjour')).toBeOnTheScreen();
    expect(screen.getByText('Mercredi 15 avril')).toBeOnTheScreen();
    expect(screen.getByText('Énigme')).toBeOnTheScreen();
    expect(questionAffichee()).toBeDefined();
    expect(screen.getByRole('button', { name: 'Voir la réponse' })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Une autre énigme' })).toBeOnTheScreen();
    expect(screen.queryByRole('button', { name: "Revoir l'énigme" })).not.toBeOnTheScreen();
  });

  it('affiche la tranche d’âge dans la pastille', async () => {
    await rendre();
    expect(screen.getByText('7\u00a0–\u00a010\u00a0ans')).toBeOnTheScreen();
  });

  it('« Voir la réponse » montre le verso de la même énigme', async () => {
    await rendre();
    const question = questionAffichee();
    const enigme = enigmes.find((e) => e.question === question)!;

    await appuyer('Voir la réponse');

    expect(screen.getByText('Réponse')).toBeOnTheScreen();
    expect(screen.getByText(enigme.reponse)).toBeOnTheScreen();
    expect(screen.getByText(enigme.explication)).toBeOnTheScreen();
    expect(screen.queryByText(enigme.question)).not.toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Une autre énigme' })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: "Revoir l'énigme" })).toBeOnTheScreen();
    expect(screen.queryByRole('button', { name: 'Voir la réponse' })).not.toBeOnTheScreen();
  });

  it('« Revoir l’énigme » remet le recto de la même énigme', async () => {
    await rendre();
    const question = questionAffichee();

    await appuyer('Voir la réponse');
    await appuyer("Revoir l'énigme");

    expect(screen.getByText(question!)).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Voir la réponse' })).toBeOnTheScreen();
  });

  it('« Une autre énigme » depuis le recto affiche une nouvelle énigme au recto', async () => {
    await rendre();
    const premiere = questionAffichee();

    await appuyer('Une autre énigme');

    const seconde = questionAffichee();
    expect(seconde).toBeDefined();
    expect(seconde).not.toBe(premiere);
    expect(screen.getByRole('button', { name: 'Voir la réponse' })).toBeOnTheScreen();
  });

  it('« Une autre énigme » depuis le verso affiche une nouvelle énigme au recto', async () => {
    await rendre();
    const premiere = questionAffichee();

    await appuyer('Voir la réponse');
    await appuyer('Une autre énigme');

    expect(screen.getByText('Énigme')).toBeOnTheScreen();
    expect(questionAffichee()).not.toBe(premiere);
  });

  it('ne remontre pas une énigme avant que toutes les autres soient passées', async () => {
    await rendre();
    const vues = [questionAffichee()];
    for (let i = 1; i < enigmes.length; i++) {
      await appuyer('Une autre énigme');
      vues.push(questionAffichee());
    }
    expect(new Set(vues).size).toBe(enigmes.length);
  });
});

describe("retournement de l'étiquette", () => {
  it('garde les boutons du recto tant que l’étiquette tourne', async () => {
    await rendre();
    const enigme = enigmeAffichee();

    await fireEvent.press(screen.getByRole('button', { name: 'Voir la réponse' }));
    await avancer(DUREE_RETOURNEMENT_MS / 2);

    expect(screen.getByRole('button', { name: 'Voir la réponse' })).toBeOnTheScreen();
    expect(screen.queryByRole('button', { name: "Revoir l'énigme" })).not.toBeOnTheScreen();
    expect(screen.queryByText(enigme.reponse)).not.toBeOnTheScreen();

    await avancer(DUREE_RETOURNEMENT_MS / 2 + 50);

    expect(screen.getByText(enigme.reponse)).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: "Revoir l'énigme" })).toBeOnTheScreen();
    expect(screen.queryByText(enigme.question)).not.toBeOnTheScreen();
  });

  it('ignore un appui pendant le retournement', async () => {
    await rendre();
    const enigme = enigmeAffichee();

    await fireEvent.press(screen.getByRole('button', { name: 'Voir la réponse' }));
    await avancer(100);
    await fireEvent.press(screen.getByRole('button', { name: 'Une autre énigme' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Voir la réponse' }));
    await avancer(DUREE_RETOURNEMENT_MS);

    // Toujours la même énigme, au verso, et un seul retournement.
    expect(screen.getByText(enigme.reponse)).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: "Revoir l'énigme" })).toBeOnTheScreen();
    await avancer(DUREE_RETOURNEMENT_MS);
    expect(screen.getByText(enigme.reponse)).toBeOnTheScreen();
  });

  it('ignore un appui pendant le retour au recto', async () => {
    await rendre();
    const enigme = enigmeAffichee();
    await appuyer('Voir la réponse');

    await fireEvent.press(screen.getByRole('button', { name: "Revoir l'énigme" }));
    await avancer(100);
    await fireEvent.press(screen.getByRole('button', { name: 'Une autre énigme' }));
    await avancer(DUREE_RETOURNEMENT_MS);

    expect(screen.getByText(enigme.question)).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Voir la réponse' })).toBeOnTheScreen();
  });

  it('annonce la réponse au lecteur d’écran une fois l’étiquette retournée', async () => {
    const annonce = jest.spyOn(AccessibilityInfo, 'announceForAccessibility');
    await rendre();
    const enigme = enigmeAffichee();

    await fireEvent.press(screen.getByRole('button', { name: 'Voir la réponse' }));
    await avancer(DUREE_RETOURNEMENT_MS / 2);
    expect(annonce).not.toHaveBeenCalled();

    await avancer(DUREE_RETOURNEMENT_MS / 2 + 50);
    expect(annonce).toHaveBeenCalledTimes(1);
    expect(annonce).toHaveBeenCalledWith(`Réponse\u00a0: ${enigme.reponse}. ${enigme.explication}`);
  });

  it('n’annonce rien au retour vers le recto', async () => {
    const annonce = jest.spyOn(AccessibilityInfo, 'announceForAccessibility');
    await rendre();
    await appuyer('Voir la réponse');
    annonce.mockClear();

    await appuyer("Revoir l'énigme");

    expect(annonce).not.toHaveBeenCalled();
  });

  it('se contente d’un fondu court quand les animations sont réduites', async () => {
    mockAnimationsReduites = true;
    await rendre();
    const enigme = enigmeAffichee();

    await fireEvent.press(screen.getByRole('button', { name: 'Voir la réponse' }));
    await avancer(DUREE_FONDU_REDUIT_MS + 50);

    expect(screen.getByText(enigme.reponse)).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: "Revoir l'énigme" })).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole('button', { name: "Revoir l'énigme" }));
    await avancer(DUREE_FONDU_REDUIT_MS + 50);

    expect(screen.getByText(enigme.question)).toBeOnTheScreen();
  });
});
