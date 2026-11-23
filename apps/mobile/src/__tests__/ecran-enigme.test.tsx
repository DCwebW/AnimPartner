import { PALETTES, type Enigme } from '@animpartner/shared';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { AccessibilityInfo, Dimensions } from 'react-native';
import { GestureHandlerRootView, State } from 'react-native-gesture-handler';
import { fireGestureHandler, getByGestureTestId } from 'react-native-gesture-handler/jest-utils';
import { ReduceMotion, ReducedMotionConfig } from 'react-native-reanimated';

import { EcranEnigme } from '@/enigmes/EcranEnigme';
import { DUREE_FONDU_ENCHAINE_MS, DUREE_GLISSEMENT_MS } from '@/enigmes/glissement';
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
    { wrapper: GestureHandlerRootView },
  );

const questionAffichee = () =>
  enigmes.find((e) => screen.queryByText(e.question) !== null)?.question;

/** L'énigme de l'étiquette courante, au recto comme au verso. */
const enigmeAffichee = () =>
  enigmes.find(
    (e) => screen.queryByText(e.question) !== null || screen.queryByText(e.reponse) !== null,
  )!;

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

  it('garde un vrai fondu quand Reanimated réduit aussi les animations', async () => {
    // Le système réduit les animations : Reanimated sauterait à la fin de chaque
    // animation, et le fondu deviendrait un changement instantané.
    mockAnimationsReduites = true;
    await render(
      <>
        <ReducedMotionConfig mode={ReduceMotion.Always} />
        <EcranEnigme
          enigmes={enigmes}
          aleatoire={aleatoire}
          maintenant={new Date(2026, 3, 15, 10)}
          palette={PALETTES.beauTemps}
          bandeau={null}
        />
      </>,
      { wrapper: GestureHandlerRootView },
    );
    const enigme = enigmeAffichee();

    await fireEvent.press(screen.getByRole('button', { name: 'Voir la réponse' }));
    await avancer(DUREE_FONDU_REDUIT_MS / 2);

    expect(screen.getByRole('button', { name: 'Voir la réponse' })).toBeOnTheScreen();
    expect(screen.queryByText(enigme.reponse)).not.toBeOnTheScreen();

    await avancer(DUREE_FONDU_REDUIT_MS / 2 + 50);
    expect(screen.getByText(enigme.reponse)).toBeOnTheScreen();
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

describe("glissement vers l'énigme suivante", () => {
  it('fait sortir l’étiquette du verso telle quelle, sans la retourner', async () => {
    await rendre();
    const premiere = enigmeAffichee();
    await appuyer('Voir la réponse');

    await fireEvent.press(screen.getByRole('button', { name: 'Une autre énigme' }));
    await avancer(DUREE_GLISSEMENT_MS / 2);

    // L'étiquette sortante est masquée au lecteur d'écran, mais toujours dessinée au verso.
    expect(screen.getByText(premiere.reponse, { includeHiddenElements: true })).toBeTruthy();
    expect(screen.queryByText(premiere.question, { includeHiddenElements: true })).toBeNull();

    await avancer(DUREE_GLISSEMENT_MS / 2 + 50);

    expect(screen.queryByText(premiere.reponse, { includeHiddenElements: true })).toBeNull();
    expect(screen.getByText('Énigme')).toBeOnTheScreen();
    expect(questionAffichee()).not.toBe(premiere.question);
    expect(screen.getByRole('button', { name: 'Voir la réponse' })).toBeOnTheScreen();
  });

  it('fait entrer la nouvelle énigme au recto pendant que l’ancienne sort', async () => {
    await rendre();
    const premiere = enigmeAffichee();

    await fireEvent.press(screen.getByRole('button', { name: 'Une autre énigme' }));
    await avancer(DUREE_GLISSEMENT_MS / 2);

    // Les deux étiquettes sont dessinées ; seule la nouvelle est lisible.
    expect(screen.getByText(premiere.question, { includeHiddenElements: true })).toBeTruthy();
    expect(screen.queryByText(premiere.question)).not.toBeOnTheScreen();
    expect(questionAffichee()).toBeDefined();

    await avancer(DUREE_GLISSEMENT_MS / 2 + 50);

    expect(screen.queryByText(premiere.question, { includeHiddenElements: true })).toBeNull();
    expect(questionAffichee()).toBeDefined();
    expect(questionAffichee()).not.toBe(premiere.question);
    expect(screen.getByRole('button', { name: 'Voir la réponse' })).toBeOnTheScreen();
  });

  it.each([
    ['normales', false],
    ['réduites', true],
  ])('rend la main après chaque glissement (animations %s)', async (_, reduites) => {
    mockAnimationsReduites = reduites;
    await rendre();
    const vues = [questionAffichee()];

    await appuyer('Une autre énigme');
    vues.push(questionAffichee());
    await appuyer('Une autre énigme');
    vues.push(questionAffichee());
    expect(new Set(vues).size).toBe(3);

    const enigme = enigmeAffichee();
    await appuyer('Voir la réponse');
    expect(screen.getByText(enigme.reponse)).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: "Revoir l'énigme" })).toBeOnTheScreen();
  });

  it('ignore un appui pendant le glissement', async () => {
    const attendue = await (async () => {
      const rendu = await rendre();
      await appuyer('Une autre énigme');
      const question = questionAffichee();
      await rendu.unmount();
      return question;
    })();

    await rendre();
    await fireEvent.press(screen.getByRole('button', { name: 'Une autre énigme' }));
    await avancer(100);
    await fireEvent.press(screen.getByRole('button', { name: 'Une autre énigme' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Voir la réponse' }));
    await avancer(DUREE_GLISSEMENT_MS + DUREE_RETOURNEMENT_MS);

    // Une seule nouvelle énigme tirée, toujours au recto.
    expect(questionAffichee()).toBe(attendue);
    expect(screen.getByRole('button', { name: 'Voir la réponse' })).toBeOnTheScreen();
  });

  it('se contente d’un fondu enchaîné quand les animations sont réduites', async () => {
    mockAnimationsReduites = true;
    await rendre();
    const premiere = enigmeAffichee();
    await appuyer('Voir la réponse');

    await fireEvent.press(screen.getByRole('button', { name: 'Une autre énigme' }));
    await avancer(DUREE_FONDU_ENCHAINE_MS + 50);

    expect(screen.queryByText(premiere.reponse, { includeHiddenElements: true })).toBeNull();
    expect(screen.getByText('Énigme')).toBeOnTheScreen();
    expect(questionAffichee()).not.toBe(premiere.question);
  });
});

/** L'étiquette courante, telle que le lecteur d'écran la présente. */
// La bibliothèque de test normalise les espaces : l'insécable devient une espace simple.
const carteCourante = () => screen.getByLabelText(/^(Énigme, de|Réponse\s:)/);

const actionsProposees = () =>
  (carteCourante().props.accessibilityActions as { name: string; label: string }[]).map(
    (a) => a.label,
  );

/** Déclenche une action d'accessibilité de l'étiquette, puis laisse l'animation finir. */
const agir = async (actionName: 'suivante' | 'precedente', attendre = true) => {
  await fireEvent(carteCourante(), 'accessibilityAction', { nativeEvent: { actionName } });
  if (attendre) await avancer(DUREE_RETOURNEMENT_MS + 50);
};

/** Un balayage franc : la moitié de la largeur de l'écran. */
const FRANC = Dimensions.get('window').width / 2;

/** Balaie l'étiquette au pouce, de `translationX` points, puis laisse l'animation finir. */
const balayer = async (translationX: number, velocityX = 0) => {
  await act(async () => {
    fireGestureHandler(getByGestureTestId(`balayage-${enigmeAffichee().id}`), [
      { state: State.BEGAN, translationX: 0, velocityX: 0 },
      { state: State.ACTIVE, translationX: translationX / 2, velocityX },
      { state: State.ACTIVE, translationX, velocityX },
      { state: State.END, translationX, velocityX },
    ]);
  });
  // Le geste rend la main au fil JavaScript par un minuteur : on le laisse passer et React
  // monter la nouvelle étiquette avant de faire courir l'animation.
  await avancer(20);
  await avancer(DUREE_RETOURNEMENT_MS + 50);
};

describe('historique et actions de l’étiquette', () => {
  it('propose « Énigme suivante », sans « Énigme précédente » au début', async () => {
    await rendre();
    expect(actionsProposees()).toEqual(['Énigme suivante']);

    await agir('suivante');
    expect(actionsProposees()).toEqual(['Énigme suivante', 'Énigme précédente']);
  });

  it('revient à l’énigme d’avant, au recto, puis retrouve la suivante sans nouveau tirage', async () => {
    await rendre();
    const premiere = questionAffichee();
    await agir('suivante');
    const seconde = questionAffichee();
    expect(seconde).not.toBe(premiere);

    await agir('precedente');
    expect(questionAffichee()).toBe(premiere);
    expect(screen.getByRole('button', { name: 'Voir la réponse' })).toBeOnTheScreen();

    await agir('suivante');
    expect(questionAffichee()).toBe(seconde);
  });

  it('le bouton « Une autre énigme » avance aussi dans l’historique', async () => {
    await rendre();
    await appuyer('Une autre énigme');
    const seconde = questionAffichee();
    await agir('precedente');

    await appuyer('Une autre énigme');
    expect(questionAffichee()).toBe(seconde);
  });

  it('ramène l’énigme précédente au recto même depuis le verso', async () => {
    await rendre();
    const premiere = enigmeAffichee();
    await agir('suivante');
    await appuyer('Voir la réponse');

    await agir('precedente');

    expect(screen.getByText(premiere.question)).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Voir la réponse' })).toBeOnTheScreen();
  });

  it('ignore les actions pendant une animation', async () => {
    await rendre();
    const enigme = enigmeAffichee();

    await fireEvent.press(screen.getByRole('button', { name: 'Voir la réponse' }));
    await avancer(100);
    await agir('suivante', false);
    await avancer(DUREE_RETOURNEMENT_MS);

    expect(screen.getByText(enigme.reponse)).toBeOnTheScreen();
  });

  it('décrit l’étiquette au lecteur d’écran selon sa face', async () => {
    await rendre();
    const enigme = enigmeAffichee();
    expect(carteCourante().props.accessibilityLabel).toBe(
      `Énigme, de 7 à 10 ans\u00a0: ${enigme.question}`,
    );

    await appuyer('Voir la réponse');
    expect(carteCourante().props.accessibilityLabel).toBe(
      `Réponse\u00a0: ${enigme.reponse}. ${enigme.explication}`,
    );
  });
});

describe('balayage au pouce', () => {
  it('passe à l’énigme suivante en balayant vers la gauche', async () => {
    await rendre();
    const premiere = questionAffichee();

    await balayer(-FRANC);

    expect(questionAffichee()).not.toBe(premiere);
    expect(screen.getByRole('button', { name: 'Voir la réponse' })).toBeOnTheScreen();
  });

  it('revient à l’énigme précédente en balayant vers la droite', async () => {
    await rendre();
    const premiere = questionAffichee();
    await balayer(-FRANC);

    await balayer(FRANC);

    expect(questionAffichee()).toBe(premiere);
  });

  it('valide un geste vif et court', async () => {
    await rendre();
    const premiere = questionAffichee();

    await balayer(-40, -900);

    expect(questionAffichee()).not.toBe(premiere);
  });

  it('remet l’étiquette en place après un balayage trop court', async () => {
    await rendre();
    const premiere = questionAffichee();

    await balayer(-50);

    expect(questionAffichee()).toBe(premiere);
    // L'écran a repris la main : le bouton répond.
    await appuyer('Voir la réponse');
    expect(screen.getByRole('button', { name: "Revoir l'énigme" })).toBeOnTheScreen();
  });

  it('ne recule pas avant la première énigme', async () => {
    await rendre();
    const premiere = questionAffichee();

    await balayer(FRANC);

    expect(questionAffichee()).toBe(premiere);
    await appuyer('Une autre énigme');
    expect(questionAffichee()).not.toBe(premiere);
  });

  it('fait sortir l’étiquette du verso telle quelle, la nouvelle arrivant au recto', async () => {
    await rendre();
    await appuyer('Voir la réponse');

    await balayer(-FRANC);

    expect(screen.getByText('Énigme')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Voir la réponse' })).toBeOnTheScreen();
  });

  it('ignore le geste pendant un retournement', async () => {
    await rendre();
    const enigme = enigmeAffichee();

    await fireEvent.press(screen.getByRole('button', { name: 'Voir la réponse' }));
    await avancer(100);
    await balayer(-FRANC);

    expect(screen.getByText(enigme.reponse)).toBeOnTheScreen();
  });

  it('fonctionne avec les animations réduites', async () => {
    mockAnimationsReduites = true;
    await rendre();
    const premiere = questionAffichee();

    await balayer(-FRANC);
    expect(questionAffichee()).not.toBe(premiere);

    await balayer(FRANC);
    expect(questionAffichee()).toBe(premiere);
  });
});
