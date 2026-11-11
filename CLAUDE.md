# AnimPartner — consignes pour Claude Code

Application mobile pour les animateurs et animatrices d'enfants. **Nom de travail.**
Ce fichier est lu par chaque agent au démarrage. Il dit où en est le projet, avec quoi on
le construit, comment on travaille et ce qu'on ne fait jamais.

## Où en est le projet

- **MVP en cours : un fournisseur d'énigmes et devinettes.** Un seul écran : une étiquette
  porte une énigme, se retourne pour montrer la réponse, et glisse pour laisser place à la
  suivante. Bibliothèque de jeux, planning et groupes viendront après.
- Le design des écrans du MVP est terminé. **Le code applicatif n'existe pas encore** :
  la première issue pose le squelette du projet.
- Utilisateur unique pour l'instant (le porteur du projet), ouverture progressive à
  d'autres animateurs ensuite. Le schéma doit savoir qui a créé, généré ou validé quoi,
  sans construire de comptes.
- **Aucune donnée sur les enfants**, jamais.

Documents de référence, à lire selon la tâche :

| Document | Contenu |
| --- | --- |
| [`docs/brief-produit.md`](docs/brief-produit.md) | Intention, contexte d'usage, piliers |
| [`docs/decisions-mvp.md`](docs/decisions-mvp.md) | Périmètre du MVP, ordre de développement, vigilance |
| [`docs/stack-technique.md`](docs/stack-technique.md) | Stack détaillée et raisons des choix |
| [`design/design-system.md`](design/design-system.md) | Couleurs, typo, rythme, règles d'interface, **écrans du MVP** |
| [`design/assets.md`](design/assets.md) | Pictogrammes, bandeaux, illustrations |

## Stack

- **Application** : Expo (dernier SDK), React Native, TypeScript strict, Expo Router.
  Animations avec `react-native-reanimated`, dessin avec `react-native-svg`, données
  distantes avec TanStack Query (cache persisté pour le hors-ligne).
- **API** : Hono sur Cloudflare Workers. Accès à la base par `@neondatabase/serverless`
  et Drizzle ORM.
- **Base** : Neon (Postgres). Migrations versionnées par `drizzle-kit`.
- **Partagé** : schémas Zod et types dans `packages/shared`, utilisés par l'app, l'API et
  le job de génération.
- **Tests** : Jest avec `jest-expo` et React Native Testing Library ; Playwright pour les
  captures sur Expo Web.
- **Livrable** : APK Android par EAS Build. Prévisualisation sur Expo Go.

### Structure prévue

```
apps/mobile      application Expo
apps/api         Worker Cloudflare, schéma Drizzle
packages/shared  schémas Zod, types, logique pure partagée
design/          maquettes et design system (lecture seule pour les agents)
docs/            brief, décisions, stack, backlog
```

### Commandes

> À confirmer par l'issue de squelette, qui doit mettre ce tableau à jour.

| Commande | Rôle |
| --- | --- |
| `npm install` | Installe les espaces de travail |
| `npm run typecheck` | `tsc --noEmit` sur tout le dépôt |
| `npm run lint` | ESLint et Prettier |
| `npm test` | Jest |
| `npm run web:export` | `npx expo export --platform web` dans `apps/mobile` |
| `npx expo start` | Serveur de développement, QR code pour Expo Go |

## Comment on travaille : des agents, une issue à la fois

Le code est écrit par des agents Claude Code lancés dans le cloud d'Anthropic. Le porteur
du projet écrit les issues, fait la recette sur son téléphone et fusionne.

1. **Une issue GitHub = une spec = une branche = une PR.** Branche nommée
   `feat/<numéro>-<court-libellé>` (ou `fix/…`). Ne jamais travailler sur `main` ni y
   pousser.
2. **Lire avant d'écrire** : ce fichier, l'issue, les documents qu'elle cite et la
   maquette visée.
3. **Spec ambiguë → s'arrêter et poser la question** en commentaire de l'issue. Ne pas
   deviner un comportement que la spec ne dit pas. Ne pas élargir le périmètre.
4. **Tests d'abord** : écrire les tests à partir des critères d'acceptation, vérifier
   qu'ils échouent, puis coder jusqu'à ce qu'ils passent.
5. **Vérifier avant d'ouvrir la PR** : `typecheck`, `lint`, `test` et `web:export` passent.
   Pour une tâche d'interface, capture Expo Web en 390 × 844 comparée à la maquette.
6. **Relecture** par un sous-agent relecteur : conformité à la spec, au design system,
   aux règles ci-dessous. Deux ou trois allers-retours au plus ; au-delà, ouvrir la PR en
   écrivant les réserves.
7. **La PR** porte `Closes #<numéro>`, un résumé, les captures, et une liste
   **« À vérifier sur téléphone »** pour tout ce que le web ne prouve pas : gestes,
   animations, clavier, zones protégées, stockage, fluidité.
8. Un commentaire de recette sur la PR relance le travail sur la même branche.

Il n'y a **pas d'émulateur** : la vérification native se fait uniquement sur le téléphone
du porteur, via Expo Go. D'où l'importance de la liste de la PR.

### Les agents planifiés

Trois routines Claude Code tournent chaque semaine. Chacune suit sa fiche dans
[`docs/agents/`](docs/agents/README.md), qui fait foi sur ce fichier pour son rôle.

| Agent | Quand | Produit | Fiche |
| --- | --- | --- | --- |
| Designer | Lundi | Un thème (bandeau et couleurs) ou un écran, en PR, avec l'issue de code qui va avec | [`designer.md`](docs/agents/designer.md) |
| Énigmes | Mardi | Trois énigmes, en PR | [`enigmes.md`](docs/agents/enigmes.md) |
| Codeur | Jeudi, vendredi | Une issue ou une reprise de PR | [`codeur.md`](docs/agents/codeur.md) |

**Fusionner une PR vaut validation.** Les agents regardent l'état du dépôt, pas la date :
tant que leur PR précédente attend, ils ne produisent rien de neuf.

**Les énigmes validées vivent dans le dépôt**, qui en est la source. Neon n'en est
qu'une copie publiée par la CI.

### Commits

En français, au présent de l'indicatif, une ligne de titre qui dit ce que fait le commit :
« Ajoute le tirage des énigmes sans répétition ». Petits commits cohérents.

## Les maquettes sont la référence visuelle

Les agents construisent les écrans **à partir des maquettes du MVP**, pas d'après leur
propre idée de l'interface.

- **Écrans du MVP** : `design/canvas/Mvp<Bandeau><Face>.dc.html`, avec `<Bandeau>` parmi
  `Vent` (beau temps), `Nuit`, `Hiver`, `Automne`, et `<Face>` parmi `Enigme` (recto) et
  `Reponse` (verso). Chaque fichier est une page HTML autonome de 390 × 844 : on l'ouvre
  dans un navigateur à cette taille pour comparer.
- **Règles et palettes** : section « Écrans du MVP — énigmes » de
  [`design/design-system.md`](design/design-system.md). Le tableau des palettes par
  bandeau fait foi pour les couleurs.
- **Bandeaux** : la scène SVG en haut de chaque écran vient des planches d'étude
  (`VentBeauTemps`, `NuitAnimee`, `HiverNeige`, `AutomneLac`).
- Reprendre les valeurs (couleurs, tailles, rayons, espacements, libellés) depuis les
  maquettes. Un écart volontaire se justifie dans la PR.
- Les textes des maquettes (« Camille », les dates, les énigmes) sont du **contenu
  d'exemple**, pas des données.
- **Ne jamais modifier `design/`.** Le flux va du canevas en ligne vers le dépôt, pas
  l'inverse. Une maquette qui semble fausse se signale dans la PR ou l'issue.
  **Seule exception** : l'agent designer écrit ses propositions dans
  `design/propositions/<N°>-<thème>/`, et nulle part ailleurs.
- **Thèmes validés** : un dossier de `design/propositions/` présent sur `main` est un
  design validé. Pour une issue de thème, c'est lui la référence (`bandeau.html`,
  `enigme.html`, `reponse.html`, `palette.json`).

## Règles techniques

- **Expo Go d'abord** : seules les librairies incluses dans le SDK Expo sont permises. Une
  librairie native hors SDK casserait la prévisualisation ; la proposer dans l'issue
  plutôt que l'installer.
- **Le web compile toujours** : `web:export` doit passer. Une librairie sans support web
  s'isole derrière une interface avec une variante `.web.ts`.
- **Animations** : Reanimated, sur le thread de l'interface. Pas de GSAP, pas d'animation
  pilotée par `setState` à chaque image. Respecter la réduction des animations du système
  (`useReducedMotion`) : remplacer le mouvement par un fondu.
- **Accessibilité** : cibles tactiles de 48 px minimum, éléments réellement interactifs
  (`Pressable` avec `accessibilityRole` et libellé), contrastes du design system.
- **Textes de l'interface en français**, avec les espaces insécables avant `? ! : ;` et à
  l'intérieur des guillemets « ».
- **Logique pure dans `packages/shared`** ou dans des modules sans React, testée à part.
  Les composants restent minces.
- TypeScript strict, pas de `any` sans commentaire qui le justifie.

## Sécurité

- L'application ne parle **jamais** directement à Neon. Aucune chaîne de connexion, clé
  d'API ou jeton dans le code de l'app ni dans le dépôt.
- Secrets dans `.env` (ignoré par git) en local, dans Cloudflare et GitHub en ligne. Seul
  `.env.example` est versionné, sans valeur réelle.
- Les agents n'utilisent que la **branche Neon de développement**, jamais la production.
  Seule la CI écrit dans la base de production, en copiant le catalogue validé.
- Si des routes d'admin apparaissent un jour, elles exigent un jeton vérifié par l'API.

## Ce que les agents ne font pas sans le demander

- Modifier `design/` (hors `design/propositions/` pour le designer),
  `docs/decisions-mvp.md`, `docs/brief-produit.md` ou les fiches de `docs/agents/`.
- Ajouter une dépendance qui n'est pas dans la stack.
- Changer la configuration de la CI, d'EAS ou de Cloudflare hors d'une issue qui le prévoit.
- Fusionner une PR.
