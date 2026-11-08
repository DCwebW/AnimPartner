# Backlog — écran d'énigmes

> Rédigé le 8 novembre 2026, **créé sur GitHub le 9 novembre 2026** : `Tn` est l'issue
> [#n](https://github.com/DCwebW/AnimPartner/issues) (T1 = #1 … T13 = #13). Les issues font
> foi désormais : ce fichier garde la trace du découpage, il n'est plus mis à jour.
> Chaque tâche suit le modèle [`.github/ISSUE_TEMPLATE/tache.md`](../../.github/ISSUE_TEMPLATE/tache.md).

## La spec d'origine

Une étiquette, sur l'écran d'accueil, porte une énigme.

- « Une autre énigme » : une autre énigme remplace la première, avec un glissement comme
  dans un carrousel.
- « Voir la réponse » : l'étiquette s'anime et se retourne.
- « Revoir l'énigme » : l'étiquette se remet à l'endroit.

## Décisions prises pour ce découpage

- **Énigmes locales d'abord** : un catalogue dans le code. L'API viendra après, sans
  changer l'écran.
- **Ordre** : tirage au hasard, sans revoir une énigme avant d'avoir vu toutes les autres.
- **Dans la première version** : le thème suit le moment (nuit, hiver, automne, beau
  temps) et la salutation porte le prénom.
- **Hors de la première version** : la météo réelle (la ligne n'affiche que la date) et
  l'engrenage des paramètres (masqué).
- **Libellés** : ceux des maquettes. Sur le verso, le lien secondaire s'appelle
  « Revoir l'énigme ».

## Ordre et parallélisme

```
T1 squelette
 ├─ T2 CI ─────────────┐
 ├─ T3 capture web     │
 ├─ T4 préversion PR   │   (attend le porteur : compte Expo, secret)
 ├─ T5 modèle ── T6 tirage ─┐
 ├─ T7 thème (logique) ─────┼─────────────┐
 └─ T8 palettes, bandeaux ──┤             │
                            T9 écran statique
                             ├─ T10 retournement ── T11 glissement
                             └─ T12 thème appliqué ── T13 prénom
```

Après T1, les lots T2–T4, T5–T6, T7 et T8 ne touchent pas les mêmes fichiers et peuvent
avancer en parallèle. À partir de T9, tout touche le même écran : une tâche à la fois.

---

## T1 — Initialiser le monorepo et l'application Expo

Labels : `socle`

**Objectif** — Poser le squelette sur lequel toutes les autres tâches s'appuient.

**Contexte** — [`CLAUDE.md`](../../CLAUDE.md), [stack technique](../stack-technique.md),
section « Structure prévue ».

**Critères d'acceptation**
- [ ] Espaces de travail npm : `apps/mobile` (Expo, TypeScript strict, Expo Router) et
      `packages/shared`. `apps/api` n'est pas créé ici.
- [ ] Le contenu de démonstration du gabarit Expo est retiré ; la route d'accueil affiche
      un écran vide titré « AnimPartner ».
- [ ] Installées avec `npx expo install` : `react-native-reanimated`, `react-native-svg`,
      `@react-native-async-storage/async-storage`, `expo-font`, `@expo-google-fonts/fraunces`,
      `@expo-google-fonts/nunito-sans`.
- [ ] Scripts à la racine : `typecheck`, `lint`, `test`, `web:export`, qui passent.
- [ ] Jest configuré avec `jest-expo` et React Native Testing Library, avec un test
      d'exemple sur l'écran d'accueil.
- [ ] Version de Node fixée (`.nvmrc`), `.env.example` vide de toute valeur réelle.
- [ ] Le tableau « Commandes » de `CLAUDE.md` est mis à jour avec les commandes réelles.

**Tests attendus** — Le test d'exemple rend l'écran d'accueil et trouve « AnimPartner ».

**Hors périmètre** — CI, API, tout écran réel.

**À vérifier sur téléphone** — `npx expo start`, le QR code ouvre l'app dans Expo Go.

**Dépend de** — rien.

---

## T2 — Vérifier chaque PR en CI

Labels : `socle`

**Objectif** — Qu'aucune PR ne soit fusionnable si le typage, le lint, les tests ou
l'export web échouent.

**Critères d'acceptation**
- [ ] Workflow GitHub Actions sur chaque PR et chaque push sur `main` : installation
      (`npm ci`, Node de `.nvmrc`, cache npm), puis `typecheck`, `lint`, `test`,
      `web:export`.
- [ ] Chaque étape est un pas distinct, pour qu'un échec dise lequel.

**Tests attendus** — Le workflow passe sur la PR elle-même.

**Hors périmètre** — Préversions Expo, déploiement, protection de branche (réglée par le
porteur dans GitHub).

**Dépend de** — T1.

---

## T3 — Capturer un écran Expo Web en 390 × 844

Labels : `socle`

**Objectif** — Donner aux agents l'outil du contrôle visuel : une capture de l'app, à la
taille des maquettes, à comparer avec `design/canvas/`.

**Critères d'acceptation**
- [ ] `npm run capture -- <route> [fichier]` exporte l'app web, la sert localement, ouvre
      la route avec Playwright en 390 × 844 et enregistre une capture PNG.
- [ ] Même commande avec `--maquette <Fichier.dc.html>` : capture la maquette à la même
      taille, pour une comparaison côte à côte.
- [ ] Les captures vont dans un dossier ignoré par git.
- [ ] Mode d'emploi ajouté dans `CLAUDE.md`, étape 5 de la méthode.

**Tests attendus** — La commande produit une image non vide pour la route d'accueil.

**Hors périmètre** — Comparaison automatique pixel à pixel.

**Dépend de** — T1.

---

## T4 — Publier une préversion Expo Go pour chaque PR

Labels : `socle`, `attend le porteur`

**Objectif** — Faire la recette d'une PR depuis le téléphone, sans allumer le PC.

**Contexte** — [`expo/expo-github-action/preview`](https://github.com/expo/expo-github-action/blob/main/preview/README.md),
[guide Expo](https://docs.expo.dev/eas-update/github-actions/).

**Préalable du porteur** — créer le projet sur expo.dev (`eas init`), ajouter le secret
`EXPO_TOKEN` dans GitHub.

**Critères d'acceptation**
- [ ] `eas.json` et la configuration EAS Update de l'app, avec la politique de version
      `sdkVersion` (exigée par Expo Go).
- [ ] Workflow sur chaque PR : `eas update` sur une branche nommée d'après la PR (nom passé
      explicitement), `qr-target: expo-go`, commentaire avec QR code et lien.
- [ ] Permission `pull-requests: write` limitée à ce workflow.

**À vérifier sur téléphone** — Le lien du commentaire, ouvert sur le téléphone, lance la
préversion dans Expo Go (le QR code ne peut pas être scanné par l'écran qui l'affiche).

**Hors périmètre** — Build de l'APK, API par PR.

**Dépend de** — T1.

---

## T5 — Définir le modèle d'énigme et le catalogue local

Labels : `logique`

**Objectif** — Une seule définition d'une énigme, prête pour la future base, et un premier
catalogue embarqué dans l'app.

**Contexte** — [Décisions du MVP](../decisions-mvp.md) : statut `draft`, multi-utilisateurs
dans le schéma.

**Critères d'acceptation**
- [ ] Schéma Zod `Enigme` dans `packages/shared` : `id` stable, `question` (140 caractères
      au plus), `reponse`, `explication`, `ageMin`, `ageMax`, `statut` (`draft` ou
      `validee`), `source` (`manuelle` ou `generee`), `creeePar`, `valideePar` (facultatif).
      Type TypeScript déduit du schéma.
- [ ] Catalogue d'une vingtaine d'énigmes en `validee` : les quatre des maquettes, plus
      des nouvelles. Chacune a **une seule bonne réponse** et une explication d'une phrase.
- [ ] Une fonction renvoie les énigmes affichables (statut `validee` uniquement).

**Tests attendus** — Chaque énigme du catalogue passe le schéma ; les `id` sont uniques ;
une énigme `draft` n'est jamais affichable ; une question de 141 caractères est refusée.

**Hors périmètre** — Base de données, API.

**Note pour la relecture** — Le porteur relit chaque énigme dans la PR : c'est la
validation prévue par les décisions du MVP.

**Dépend de** — T1.

---

## T6 — Tirer les énigmes au hasard sans répétition

Labels : `logique`

**Objectif** — « Une autre énigme » ne remontre pas une énigme avant que toutes les
autres soient passées.

**Critères d'acceptation**
- [ ] Logique pure, sans React, dans `packages/shared` : un « sac » mélangé (Fisher–Yates)
      dont on tire une énigme à la fois.
- [ ] Sac vide : nouveau mélange, sans que la première énigme du nouveau sac soit la
      dernière vue.
- [ ] Le générateur aléatoire est injectable, pour des tests déterministes.
- [ ] Catalogue d'une seule énigme : elle revient, sans erreur.

**Tests attendus** — Sur N tirages, les N énigmes sont toutes différentes ; au passage
d'un sac au suivant, pas de doublon consécutif ; catalogue d'un élément ; catalogue vide
refusé explicitement.

**Hors périmètre** — Mémoriser le sac entre deux ouvertures de l'app.

**Dépend de** — T5.

---

## T7 — Choisir le thème selon le moment

Labels : `logique`

**Objectif** — Savoir, pour une date et une heure, quel bandeau afficher.

**Critères d'acceptation**
- [ ] Fonction pure `themeDuMoment(date)` qui renvoie `nuit`, `hiver`, `automne` ou
      `beauTemps`.
- [ ] Règle proposée, à confirmer en relecture : **nuit** de 20 h à 7 h, prioritaire ;
      sinon **hiver** de décembre à février, **automne** de septembre à novembre,
      **beau temps** le reste de l'année.
- [ ] La salutation associée : « Bonsoir » pour la nuit, « Bonjour » sinon.

**Tests attendus** — Les bornes : 19 h 59 et 20 h 00, 6 h 59 et 7 h 00, 30 novembre et
1er décembre, 28 février et 1er mars, une nuit d'été.

**Hors périmètre** — Météo réelle, fuseaux horaires autres que celui du téléphone.

**Dépend de** — T1.

---

## T8 — Porter les palettes et les quatre bandeaux

Labels : `écran`

**Objectif** — Les quatre thèmes prêts à l'emploi : couleurs et scène du bandeau.

**Contexte** — Tableau des palettes dans [`design/design-system.md`](../../design/design-system.md),
section « Écrans du MVP » ; valeurs complètes (hachures, ficelle, œillet, boutons, liens)
dans le dictionnaire `THEMES` de [`design/outils/generer_ecrans_mvp.py`](../../design/outils/generer_ecrans_mvp.py) ;
scènes dans `VentBeauTemps`, `NuitAnimee`, `HiverNeige`, `AutomneLac` de `design/canvas/`.

**Critères d'acceptation**
- [ ] Objet typé des quatre palettes, une entrée par thème, valeurs reprises à
      l'identique.
- [ ] Un composant `react-native-svg` par bandeau, **statique** (sans animation), qui
      reproduit la scène et s'adapte à la largeur de l'écran en gardant ses proportions.
- [ ] Une route de développement affiche les quatre bandeaux l'un sous l'autre.

**Tests attendus** — Chaque thème a toutes ses clés ; chaque bandeau se rend sans erreur.
Captures (T3) comparées aux planches d'étude.

**Hors périmètre** — Animation des bandeaux (vent, étoiles, neige, feuilles) : tâche
ultérieure.

**Dépend de** — T1.

---

## T9 — Construire l'écran d'énigme, sans animation

Labels : `écran`

**Objectif** — L'écran du MVP en thème beau temps, recto et verso, avec un changement
instantané. Les animations viennent en T10 et T11.

**Contexte** — Maquettes `MvpVentEnigme.dc.html` (recto) et `MvpVentReponse.dc.html`
(verso) ; règles de la section « Écrans du MVP » du design system.

**Critères d'acceptation**
- [ ] Route d'accueil : bandeau en haut, feuille relevée à 85 % de la hauteur, sans
      poignée.
- [ ] Dans la feuille : « Bonjour » (le prénom viendra en T13), la date du jour en
      français (« Mercredi 15 avril »), sans météo. Engrenage masqué.
- [ ] Étiquette à œillet suspendue à sa ficelle. **Recto** incliné de −2° : « Énigme »,
      pastille d'âge (« 7 – 10 ans »), question. **Verso** incliné de +2°, en aplat :
      « Réponse », réponse, explication.
- [ ] Recto : bouton « Voir la réponse », lien « Une autre énigme ». Verso : bouton
      « Une autre énigme », lien « Revoir l'énigme ».
- [ ] « Voir la réponse » montre le verso, « Revoir l'énigme » le recto, « Une autre
      énigme » affiche le recto d'une nouvelle énigme tirée par T6.
- [ ] Polices Fraunces et Nunito Sans chargées ; zones protégées respectées.
- [ ] Une énigme de 140 caractères tient dans l'étiquette sans être coupée.

**Tests attendus** — Les trois actions changent ce qui est affiché comme décrit ; chaque
bouton a un rôle et un libellé accessibles ; la date est formatée en français.

**À vérifier sur téléphone** — Zones protégées (encoche, barre système), lisibilité au
soleil, cibles à portée du pouce.

**Hors périmètre** — Animations, autres thèmes, prénom.

**Dépend de** — T5, T6, T8.

---

## T10 — Retourner l'étiquette

Labels : `animation`

**Objectif** — « Voir la réponse » retourne l'étiquette pour montrer le verso ; « Revoir
l'énigme » la remet à l'endroit.

**Critères d'acceptation**
- [ ] Rotation autour de l'axe vertical avec Reanimated, avec perspective, environ
      500 ms, accélération douce en entrée et en sortie.
- [ ] L'inclinaison passe de −2° à +2° pendant le retournement, et inversement.
- [ ] La face cachée n'est jamais visible en miroir.
- [ ] Les boutons changent quand l'étiquette a tourné ; un appui pendant l'animation est
      ignoré.
- [ ] Animations réduites dans le système : fondu court à la place de la rotation.
- [ ] Lecteur d'écran : la réponse est annoncée après le retournement.

**Tests attendus** — État affiché et boutons après chaque action ; appui ignoré pendant
l'animation ; chemin « animations réduites ».

**À vérifier sur téléphone** — Fluidité, absence de clignotement à mi-rotation, fondu
quand les animations sont réduites dans les réglages Android.

**Hors périmètre** — Retournement au geste.

**Dépend de** — T9.

---

## T11 — Faire glisser vers l'énigme suivante

Labels : `animation`

**Objectif** — « Une autre énigme » fait sortir l'étiquette par la gauche et entrer la
suivante par la droite, comme un carrousel.

**Critères d'acceptation**
- [ ] Glissement horizontal avec Reanimated, environ 350 ms : l'étiquette actuelle sort à
      gauche, la nouvelle entre par la droite, au recto.
- [ ] Fonctionne depuis le recto (lien) et depuis le verso (bouton) ; depuis le verso,
      l'étiquette sort telle quelle, sans se retourner d'abord.
- [ ] L'étiquette glisse avec sa ficelle.
- [ ] Un appui pendant l'animation est ignoré.
- [ ] Animations réduites : fondu enchaîné à la place du glissement.

**Tests attendus** — Nouvelle énigme au recto après l'action, depuis chaque face ; appui
ignoré pendant l'animation ; chemin « animations réduites ».

**À vérifier sur téléphone** — Fluidité, enchaînement rapide de plusieurs « Une autre
énigme ».

**Hors périmètre** — Balayage au doigt, retour à l'énigme précédente.

**Dépend de** — T10 (même composant : à faire après).

---

## T12 — Appliquer le thème du moment à l'écran

Labels : `écran`

**Objectif** — L'écran prend le bandeau et la palette du moment.

**Contexte** — Maquettes `Mvp<Nuit|Hiver|Automne><Enigme|Reponse>.dc.html`.

**Critères d'acceptation**
- [ ] Bandeau, feuille, recto, verso, boutons et liens suivent la palette de
      `themeDuMoment` (T7).
- [ ] Le thème est recalculé à l'ouverture et au retour de l'app au premier plan.
- [ ] « Bonsoir » avec le thème nuit.
- [ ] Une route de développement force chacun des quatre thèmes, pour la recette.

**Tests attendus** — Pour une date injectée, l'écran utilise la bonne palette et la bonne
salutation. Captures des quatre thèmes comparées aux huit maquettes.

**À vérifier sur téléphone** — Les quatre thèmes via la route de développement, contrastes
au soleil, thème nuit dans le noir.

**Hors périmètre** — Météo, mode sombre lié au réglage du système.

**Dépend de** — T7, T8, T9.

---

## T13 — Saluer par le prénom

Labels : `écran`

**Objectif** — « Bonjour, Camille » avec le vrai prénom.

**Critères d'acceptation**
- [ ] À la première ouverture, avant l'écran d'énigme : un champ « Ton prénom » et un
      bouton de validation. Pas de maquette : appliquer le design system (champ rayon 12,
      bouton pastille, cibles de 48 px, palette du thème du moment).
- [ ] Un lien « Plus tard » passe sans prénom ; la salutation reste alors « Bonjour ».
- [ ] Prénom nettoyé des espaces, 30 caractères au plus, gardé **sur le téléphone
      seulement** (AsyncStorage).
- [ ] Salutation : « Bonjour, <prénom> » ou « Bonsoir, <prénom> ».

**Tests attendus** — Première ouverture puis ouverture suivante ; « Plus tard » ; prénom
vide refusé ; prénom trop long tronqué ou refusé.

**À vérifier sur téléphone** — Le clavier ne recouvre pas le champ ; le prénom survit à la
fermeture de l'app.

**Hors périmètre** — Modifier le prénom ensuite (viendra avec l'écran des paramètres).

**Dépend de** — T12.

---

## Après cette spec

Pas encore rédigées, à spécifier le moment venu :

- Animer les quatre bandeaux (vent, étoiles, neige, feuilles qui tombent).
- Schéma Drizzle et API Worker, puis brancher l'app sur l'API avec TanStack Query à la
  place du catalogue local.
- Écran d'admin de validation des `draft`, protégé par jeton.
- Job de génération des énigmes.
- Build de l'APK déclenché par une release.
- Écran des paramètres derrière l'engrenage (prénom, et plus tard la météo).
