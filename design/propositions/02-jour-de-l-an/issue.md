# Thème 02 — Jour de l'an
labels: thème, priorité

## Objectif
Porter le thème du Jour de l'an dans l'app : bandeau animé et palette, affichés automatiquement du 27 décembre au 3 janvier.

## Contexte
Design validé : `design/propositions/02-jour-de-l-an/` (`bandeau.html`, `enigme.html`, `reponse.html`, `palette.json`). Fête laïque : feux d'artifice, horloge, ballons, lumières, confettis.

## Critères d'acceptation
- Le bandeau est porté en `react-native-svg`, avec ses animations en Reanimated (éclats des feux d'artifice, scintillement des étoiles, balancement des ballons, pulsation de l'horloge, chute des confettis), en transformations et opacité seulement.
- Avec la réduction des animations du système, le mouvement est remplacé par un fond fixe.
- La palette de `palette.json` est ajoutée aux thèmes ; contrastes 4,5:1 conservés.
- `themeDuMoment` renvoie le Jour de l'an du 27 décembre au 3 janvier en mode automatique : la nuit garde son bandeau, la fête passe devant la saison.
- Le recto et le verso reprennent les maquettes (390 × 844).

## Tests attendus
- Tests unitaires de `themeDuMoment` : 26 décembre (Noël), 27 décembre et 3 janvier (Jour de l'an), 4 janvier (saison), nuit du 31 décembre (nuit).
- Rendu du bandeau sans erreur ; capture Expo Web 390 × 844 comparée aux maquettes.

## Hors périmètre
Écran des paramètres, choix manuel, autres fêtes.

## À vérifier sur téléphone
- Fluidité des animations du bandeau.
- Réduction des animations activée dans le système.
- Lisibilité en plein soleil.

## Dépend de
#12 (thème appliqué à l'écran)
