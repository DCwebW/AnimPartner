import {
  DUREE_MINIMALE_MS,
  FONDU_ENTREE_MS,
  FONDU_REDUIT_MS,
  FONDU_SORTIE_MS,
  delaiAvantMasquage,
  dureeSortie,
} from '@/lancement/enchainement';

describe("enchaînement de l'écran de chargement", () => {
  it('garde les durées de la spec', () => {
    expect(FONDU_ENTREE_MS).toBe(250);
    expect(DUREE_MINIMALE_MS).toBe(800);
    expect(FONDU_SORTIE_MS).toBe(300);
  });

  it("attend tant que l'application n'est pas prête", () => {
    expect(delaiAvantMasquage({ pret: false, ecouleMs: 5000, animationsReduites: false })).toBe(
      null,
    );
    expect(delaiAvantMasquage({ pret: false, ecouleMs: 5000, animationsReduites: true })).toBe(
      null,
    );
  });

  it("laisse le fondu d'entrée et la durée minimale s'écouler", () => {
    expect(delaiAvantMasquage({ pret: true, ecouleMs: 0, animationsReduites: false })).toBe(1050);
    expect(delaiAvantMasquage({ pret: true, ecouleMs: 400, animationsReduites: false })).toBe(650);
  });

  it('masque tout de suite une fois la durée minimale écoulée', () => {
    expect(delaiAvantMasquage({ pret: true, ecouleMs: 1050, animationsReduites: false })).toBe(0);
    expect(delaiAvantMasquage({ pret: true, ecouleMs: 4000, animationsReduites: false })).toBe(0);
  });

  it('supprime la durée minimale quand les animations sont réduites', () => {
    expect(delaiAvantMasquage({ pret: true, ecouleMs: 0, animationsReduites: true })).toBe(0);
  });

  it('raccourcit le fondu de sortie quand les animations sont réduites', () => {
    expect(dureeSortie(false)).toBe(FONDU_SORTIE_MS);
    expect(dureeSortie(true)).toBe(FONDU_REDUIT_MS);
    expect(FONDU_REDUIT_MS).toBeLessThan(FONDU_SORTIE_MS);
  });
});
