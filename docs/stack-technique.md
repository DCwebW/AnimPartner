# AnimPartner — stack technique

> Tranchée le 8 novembre 2026. Complète les [décisions de cadrage du MVP](decisions-mvp.md) :
> elle dit avec quoi on construit le premier pas qu'elles décrivent.

## Vue d'ensemble

```
Téléphone (APK, Expo Go en développement)
   │  HTTPS
   ▼
API Hono sur Cloudflare Workers
   │  @neondatabase/serverless
   ▼
Neon (Postgres) ◄── CI à chaque fusion ── catalogue d'énigmes dans le dépôt
                                               ▲
                                   PR de l'agent des énigmes, validée par fusion
```

*Révisé le 11 novembre 2026 : le dépôt est la source des énigmes validées, Neon en est une
copie publiée. Le job de génération sur le Worker est abandonné au profit d'une routine
Claude Code (voir [`docs/agents/`](agents/README.md)).*

L'application ne parle **jamais** directement à Neon. La chaîne de connexion dans un APK
serait lisible par quiconque le décompile : elle reste côté Worker, en secret.

## Application mobile

| Brique | Choix | Rôle |
| --- | --- | --- |
| Socle | Expo (dernier SDK), React Native, TypeScript | Application et build |
| Navigation | Expo Router | Écrans, barre basse à cinq entrées |
| Données distantes | TanStack Query, persistance sur AsyncStorage | Appels à l'API, cache hors-ligne |
| Secrets locaux | `expo-secure-store` | Jeton d'admin sur mon téléphone |
| Animations | `react-native-reanimated` | Micro-animations, feuilles, transitions |
| Dessin | `react-native-svg` | Pictogrammes et paysages, tous en SVG |
| Particules | `@shopify/react-native-skia` | Neige, étoiles — seulement si les bandeaux animés sont retenus |
| Polices | `@expo-google-fonts` | Fraunces et Nunito Sans |

**Règle Expo Go** : je prévisualise dans Expo Go, donc seules les librairies incluses dans
le SDK Expo sont permises. Une librairie native hors SDK imposerait un development build.
Expo Go ne suit que le dernier SDK : le projet doit suivre les montées de version.

**Pas de GSAP.** Il anime le DOM du navigateur ; en React Native il n'animerait que des
valeurs JavaScript recopiées à chaque image, sur le thread JS, et saccaderait dès que l'app
travaille. Reanimated fait tourner les animations sur le thread de l'interface et fonctionne
aussi sur le web.

**Hors-ligne** : les énigmes déjà chargées restent lisibles sans réseau grâce au cache
persisté. Pas de base locale tant que le contenu reste du texte léger en lecture.

**Livrable** : un APK, produit par EAS Build (profil `preview`, `buildType: "apk"`) aux
jalons.

## API

- **Hono** sur **Cloudflare Workers**, en TypeScript.
- Accès à Neon par `@neondatabase/serverless` (pilote HTTP, adapté aux Workers) et
  **Drizzle ORM**.
- **Zod** valide chaque entrée et chaque sortie.
- Secrets posés avec `wrangler secret put` : chaîne Neon.
- **Pas de route d'admin dans le MVP** : la validation se fait par la fusion des PR.
  L'API n'expose que la lecture du catalogue publié.

## Base de données

- **Neon** (Postgres). Schéma en TypeScript avec Drizzle, migrations versionnées par
  `drizzle-kit` — jamais de modification à la main.
- **Branches Neon** : `main` pour la production, une branche de développement pour moi et
  pour les agents. Les agents ne voient jamais la production.
- Schéma pensé multi-utilisateurs dès le départ (qui a créé, généré, validé quoi), sans
  comptes pour l'instant.

## Code partagé

Un seul dépôt, organisé en espaces de travail :

- `apps/mobile` — l'application Expo ;
- `apps/api` — le Worker, avec le schéma Drizzle ;
- `packages/shared` — les schémas Zod et les types, communs à l'app, à l'API et à la CI.

Un même schéma Zod décrit une énigme partout : dans l'écran, dans l'API, dans le
catalogue du dépôt et dans la copie vers Neon.

## Génération des énigmes

*Révisé le 11 novembre 2026.*

- **Routine Claude Code** du mardi, sur l'abonnement : pas de clé d'API Anthropic, pas de
  coût à l'usage. Fiche : [`docs/agents/enigmes.md`](agents/enigmes.md).
- Trois énigmes par semaine, proposées en PR dans le catalogue du dépôt, validées par
  le schéma Zod dans les tests. **La fusion vaut validation.**
- **Dédoublonnage** : l'agent lit tout le catalogue avant d'écrire. Tant que le catalogue
  tient dans un fichier, ni embeddings ni pgvector ne sont nécessaires.
- **Publication** : un workflow GitHub Actions copie le catalogue dans Neon à chaque
  fusion sur `main`. À mettre en place avec les issues de l'API ; c'est le seul accès en
  écriture à la base de production.

## Qualité et vérification

Pas d'émulateur Android : mon PC n'est pas assez puissant. Trois niveaux de vérification :

| Niveau | Outils | Quand |
| --- | --- | --- |
| 1. Logique | `tsc --noEmit`, ESLint (`npx expo lint`), Prettier, Jest avec `jest-expo` et React Native Testing Library | À chaque tâche |
| 2. Visuel | Expo Web en 390 × 844, captures Playwright comparées aux maquettes de `design/canvas/` | À chaque tâche d'interface |
| 4. Terrain | Expo Go sur mon téléphone, APK aux jalons | Recette de chaque PR, jalons |

- **Le web compile toujours** : la CI échoue si `npx expo export --platform web` casse.
  Une librairie sans support web s'isole derrière une interface avec un fichier `.web.ts`.
- Chaque PR qui touche aux gestes, au clavier, aux zones protégées, au stockage ou à la
  fluidité porte une liste **« à vérifier sur téléphone »**, que je coche en recette.
- **CI GitHub Actions** : typage, lint, tests, export web.

## Agents de développement

- Claude Code, dans le cloud d'Anthropic, sur `DCwebW/AnimPartner`.
- Environnement : version de Node fixée, installation des dépendances, accès réseau au
  registre npm et à Neon, **secrets de développement uniquement**.
- Les agents dans le cloud couvrent les niveaux 1 et 2. Le niveau 4 reste le mien.
- **Voir le travail d'un agent** : une préversion EAS Update par PR, ouverte dans Expo Go
  depuis le lien du commentaire (issue #4). À défaut, je récupère la branche et je lance
  `npx expo start` sur mon PC.
- **Agents planifiés** : designer le lundi, énigmes le mardi, codeur le jeudi et le
  vendredi, en routines Claude Code. Voir [`docs/agents/`](agents/README.md).

## Déploiement

- **API** : `wrangler deploy` depuis GitHub Actions à chaque fusion sur `main`.
- **Application** : APK par EAS Build aux jalons.

## Encore à trancher

- ~~Le gestionnaire de paquets~~ : espaces de travail npm, tranché par l'issue #1.
- ~~Le forfait Workers~~ et ~~le service d'embeddings~~ : sans objet depuis l'abandon du
  job de génération sur le Worker (11 novembre 2026).
