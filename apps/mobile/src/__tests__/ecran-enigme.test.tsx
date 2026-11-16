import { PALETTES, type Enigme } from '@animpartner/shared';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { EcranEnigme } from '@/enigmes/EcranEnigme';

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

    await fireEvent.press(screen.getByRole('button', { name: 'Voir la réponse' }));

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

    await fireEvent.press(screen.getByRole('button', { name: 'Voir la réponse' }));
    await fireEvent.press(screen.getByRole('button', { name: "Revoir l'énigme" }));

    expect(screen.getByText(question!)).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Voir la réponse' })).toBeOnTheScreen();
  });

  it('« Une autre énigme » depuis le recto affiche une nouvelle énigme au recto', async () => {
    await rendre();
    const premiere = questionAffichee();

    await fireEvent.press(screen.getByRole('button', { name: 'Une autre énigme' }));

    const seconde = questionAffichee();
    expect(seconde).toBeDefined();
    expect(seconde).not.toBe(premiere);
    expect(screen.getByRole('button', { name: 'Voir la réponse' })).toBeOnTheScreen();
  });

  it('« Une autre énigme » depuis le verso affiche une nouvelle énigme au recto', async () => {
    await rendre();
    const premiere = questionAffichee();

    await fireEvent.press(screen.getByRole('button', { name: 'Voir la réponse' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Une autre énigme' }));

    expect(screen.getByText('Énigme')).toBeOnTheScreen();
    expect(questionAffichee()).not.toBe(premiere);
  });

  it('ne remontre pas une énigme avant que toutes les autres soient passées', async () => {
    await rendre();
    const vues = [questionAffichee()];
    for (let i = 1; i < enigmes.length; i++) {
      await fireEvent.press(screen.getByRole('button', { name: 'Une autre énigme' }));
      vues.push(questionAffichee());
    }
    expect(new Set(vues).size).toBe(enigmes.length);
  });
});
