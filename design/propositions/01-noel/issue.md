# Thème 01 — Noël
labels: thème, priorité

## Objectif
Porter le thème de Noël dans l'app : bandeau animé et palette, affichés automatiquement du 1er au 26 décembre.

## Contexte
Design validé : `design/propositions/01-noel/` (`bandeau.html`, `enigme.html`, `reponse.html`, `palette.json`). Fête laïque : sapin, cadeaux, fanions, confettis.

## Critères d'acceptation
- Le bandeau est porté en `react-native-svg`, avec ses animations en Reanimated (balancement des fanions, lueur des boules, étoile, chute des confettis), en transformations et opacité seulement.
- Avec la réduction des animations du système, le mouvement est remplacé par un fond fixe.
- La palette de `palette.json` est ajoutée aux thèmes ; contrastes 4,5:1 conservés.
- `themeDuMoment` renvoie Noël du 1er au 26 décembre en mode automatique : la nuit garde son bandeau, Noël passe devant la saison.
- Le recto et le verso reprennent les maquettes (390 × 844).

## Tests attendus
- Tests unitaires de `themeDuMoment` : 30 novembre (saison), 1er et 26 décembre (Noël), 27 décembre (saison), nuit du 15 décembre (nuit).
- Rendu du bandeau sans erreur ; capture Expo Web 390 × 844 comparée aux maquettes.

## Hors périmètre
Écran des paramètres, choix manuel, autres fêtes.

## À vérifier sur téléphone
- Fluidité des animations du bandeau.
- Réduction des animations activée dans le système.
- Lisibilité en plein soleil.

## Dépend de
#12 (thème appliqué à l'écran)
