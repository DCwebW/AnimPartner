# Afficher le logo au lancement : icône, splash et écran de chargement
labels: écran

## Objectif

À l'ouverture, l'application montre son logo au lieu de l'écran blanc d'Expo, puis passe
d'elle-même à l'écran d'accueil. L'icône d'AnimPartner remplace celle du modèle Expo.

## Contexte

- Dossier de design : `design/propositions/00-identite/` (`notes.md` en premier).
- Fichiers prêts dans `design/propositions/00-identite/app/` : `icon.png`,
  `android-icon-foreground.png`, `android-icon-background.png`,
  `android-icon-monochrome.png`, `splash-icon.png`, `favicon.png`, `logo.png`.
- Maquettes : `splash.html` (splash natif) et `chargement.html` (écran React), en
  390 × 844, avec `?theme=sombre` pour la version sombre.
- `expo-splash-screen` fait partie du SDK Expo : l'ajouter avec
  `EXPO_OFFLINE=1 npx expo install expo-splash-screen` dans `apps/mobile`.

## Critères d'acceptation

- [ ] Les fichiers de `app/` remplacent ceux de `apps/mobile/assets/` (mêmes noms) ;
      `logo.png` y est ajouté. Rien d'autre n'est copié du dossier de design.
- [ ] `app.json` : fond de l'icône adaptive `#FEF3D4` (au lieu de `#E6F4FE`), plugin
      `expo-splash-screen` avec `image: ./assets/splash-icon.png`, `imageWidth: 200`,
      `resizeMode: contain`, `backgroundColor: #FEF3D4`, et `dark.backgroundColor:
      #262231`.
- [ ] Le splash natif reste affiché (`preventAutoHideAsync`) jusqu'à ce que les polices
      soient chargées, puis il est masqué.
- [ ] Juste après, un écran de chargement montre le logotype (`logo.png`) : 280 px de
      large, centré, remonté de 24 px, sur le même fond uni que le splash (`#FEF3D4`, ou
      `#262231` quand le thème du système est sombre). Libellé d'accessibilité
      « AnimPartner », rôle image.
- [ ] Le logotype apparaît en fondu (250 ms), reste au moins 800 ms, puis l'écran
      disparaît en fondu (300 ms) sur l'écran d'accueil. Animations avec Reanimated.
- [ ] Si le système demande de réduire les animations (`useReducedMotion`), pas de durée
      minimale : un seul fondu court vers l'écran d'accueil.
- [ ] L'écran de chargement n'est pas une route : il se superpose dans `_layout.tsx` et
      ne laisse rien dans l'historique de navigation (le bouton retour ne le rouvre pas).
- [ ] Les durées (250, 800, 300 ms) sont des constantes nommées dans un module sans
      React, pour être ajustées après la recette.
- [ ] `typecheck`, `lint`, `test` et `web:export` passent.

## Tests attendus

- La logique d'enchaînement (prêt ou pas, durée minimale écoulée ou pas, réduction des
  animations) est une fonction pure, testée seule : elle dit quand masquer l'écran.
- Test de rendu : l'écran de chargement affiche une image libellée « AnimPartner », puis
  laisse place à l'écran d'accueil une fois les conditions remplies (minuteurs simulés).
- Capture Expo Web en 390 × 844 de l'écran de chargement, comparée à
  `capture-chargement-clair.png`.

## Hors périmètre

- Passer `userInterfaceStyle` à `automatic` (mode sombre de toute l'application) : à
  décider à part. Le splash sombre est configuré mais ne s'affichera qu'à ce moment-là.
- Attendre le chargement du catalogue d'énigmes : le brancher quand #5 sera fusionnée,
  si le chargement se voit.
- Toute modification du logo ou des images : elles viennent du dossier de design.

## À vérifier sur téléphone

- **Le splash natif ne s'affiche pas dans Expo Go**, qui montre le sien : à vérifier
  sur l'APK EAS uniquement.
- Sur l'APK : icône sur l'écran d'accueil du téléphone (aucun élément coupé par le
  masque), icône à thème si elle est activée (Android 13+).
- Enchaînement splash, logotype, écran d'accueil : pas de flash blanc, pas de saut de
  position, fondus fluides.
- Avec « Supprimer les animations » activé dans l'accessibilité : passage direct.

## Dépend de

Aucune issue bloquante.
