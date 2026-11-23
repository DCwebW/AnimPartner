import {
  RESISTANCE,
  SEUIL_DISTANCE,
  SEUIL_VITESSE,
  decalageSuivi,
  decisionBalayage,
} from '@/enigmes/balayage';

const LARGEUR = 400;
const base = { largeur: LARGEUR, peutReculer: true };

describe('balayage au pouce', () => {
  it('garde les seuils de la spec', () => {
    expect(SEUIL_DISTANCE).toBe(0.3);
    expect(SEUIL_VITESSE).toBe(600);
  });

  it('passe à la suivante au-delà de 30 % de la largeur vers la gauche', () => {
    expect(decisionBalayage({ ...base, decalage: -121, vitesse: 0 })).toBe('suivante');
    expect(decisionBalayage({ ...base, decalage: -119, vitesse: 0 })).toBe('retour');
  });

  it('revient à la précédente au-delà de 30 % vers la droite', () => {
    expect(decisionBalayage({ ...base, decalage: 121, vitesse: 0 })).toBe('precedente');
    expect(decisionBalayage({ ...base, decalage: 119, vitesse: 0 })).toBe('retour');
  });

  it('valide un geste vif et court', () => {
    expect(decisionBalayage({ ...base, decalage: -30, vitesse: -700 })).toBe('suivante');
    expect(decisionBalayage({ ...base, decalage: 30, vitesse: 700 })).toBe('precedente');
    expect(decisionBalayage({ ...base, decalage: -30, vitesse: -500 })).toBe('retour');
  });

  it('suit la direction du lancer quand il contredit le déplacement', () => {
    // Le pouce est allé loin à gauche puis a été relancé vers la droite.
    expect(decisionBalayage({ ...base, decalage: -150, vitesse: 800 })).toBe('retour');
    expect(decisionBalayage({ ...base, decalage: 150, vitesse: -800 })).toBe('retour');
  });

  it('ne recule pas sans énigme précédente', () => {
    const debut = { largeur: LARGEUR, peutReculer: false };
    expect(decisionBalayage({ ...debut, decalage: 200, vitesse: 0 })).toBe('retour');
    expect(decisionBalayage({ ...debut, decalage: 30, vitesse: 900 })).toBe('retour');
    expect(decisionBalayage({ ...debut, decalage: -200, vitesse: 0 })).toBe('suivante');
  });

  it('suit le pouce, sauf vers la droite sans précédente où l’étiquette résiste', () => {
    expect(decalageSuivi(-80, true)).toBe(-80);
    expect(decalageSuivi(80, true)).toBe(80);
    expect(decalageSuivi(-80, false)).toBe(-80);
    expect(decalageSuivi(80, false)).toBe(80 * RESISTANCE);
    expect(RESISTANCE).toBeLessThan(0.5);
  });
});
