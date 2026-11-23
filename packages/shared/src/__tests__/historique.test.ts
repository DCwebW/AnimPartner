import {
  HISTORIQUE_MAX,
  avancer,
  courant,
  creerHistorique,
  peutReculer,
  reculer,
} from '../enigmes/historique';

/** Tirage qui rend 1, 2, 3… et compte ses appels. */
function compteur() {
  let n = 0;
  const tirer = () => ++n;
  return { tirer, appels: () => n };
}

describe('historique des énigmes', () => {
  it('commence sur la première énigme, sans précédente', () => {
    const h = creerHistorique('a');
    expect(courant(h)).toBe('a');
    expect(peutReculer(h)).toBe(false);
  });

  it('avance en tirant une nouvelle énigme', () => {
    const { tirer, appels } = compteur();
    const h = avancer(creerHistorique(0), tirer);
    expect(courant(h)).toBe(1);
    expect(appels()).toBe(1);
    expect(peutReculer(h)).toBe(true);
  });

  it('recule vers l’énigme d’avant', () => {
    const { tirer } = compteur();
    let h = creerHistorique(0);
    h = avancer(h, tirer);
    h = avancer(h, tirer);
    h = reculer(h);
    expect(courant(h)).toBe(1);
    h = reculer(h);
    expect(courant(h)).toBe(0);
    expect(peutReculer(h)).toBe(false);
  });

  it('ne fait rien en reculant depuis le début', () => {
    const h = creerHistorique('a');
    expect(reculer(h)).toBe(h);
  });

  it('après un retour, avance dans les énigmes déjà vues avant d’en tirer une nouvelle', () => {
    const { tirer, appels } = compteur();
    let h = creerHistorique(0);
    h = avancer(h, tirer);
    h = avancer(h, tirer);
    h = reculer(reculer(h));

    h = avancer(h, tirer);
    expect(courant(h)).toBe(1);
    h = avancer(h, tirer);
    expect(courant(h)).toBe(2);
    expect(appels()).toBe(2);

    h = avancer(h, tirer);
    expect(courant(h)).toBe(3);
    expect(appels()).toBe(3);
  });

  it(`garde au plus ${HISTORIQUE_MAX} énigmes`, () => {
    const { tirer } = compteur();
    let h = creerHistorique(0);
    for (let i = 0; i < HISTORIQUE_MAX + 20; i++) h = avancer(h, tirer);
    expect(courant(h)).toBe(HISTORIQUE_MAX + 20);

    let retours = 0;
    while (peutReculer(h)) {
      h = reculer(h);
      retours++;
    }
    expect(retours).toBe(HISTORIQUE_MAX - 1);
    expect(courant(h)).toBe(21);
  });

  it('ne modifie pas l’historique reçu', () => {
    const { tirer } = compteur();
    const h = creerHistorique(0);
    avancer(h, tirer);
    expect(courant(h)).toBe(0);
    expect(peutReculer(h)).toBe(false);
  });
});
