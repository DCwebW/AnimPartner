# AnimPartner

Application d'aide aux animateurs et animatrices d'enfants : mise en place d'animations,
bibliothèque de jeux et planning. **Nom de travail.**

Phase en cours : **design**. Pas encore de code applicatif.

Dépôt : <https://github.com/DCwebW/AnimPartner> (privé)

## Contenu du dépôt

- [`docs/brief-produit.md`](docs/brief-produit.md) — intention, contexte d'usage, piliers
  fonctionnels, périmètre et questions ouvertes.
- [`docs/decisions-mvp.md`](docs/decisions-mvp.md) — cadrage du MVP (énigmes et
  devinettes), ordre de développement, méthode et points de vigilance.
- [`design/design-system.md`](design/design-system.md) — couleurs, typographie, rythme,
  règles d'interface, crayonné et mode sombre.
- [`design/assets.md`](design/assets.md) — pictogrammes, familles de jeux, indicateurs,
  illustrations, bandeaux et animation du vent.
- [`design/canvas/`](design/canvas) — **les sources des maquettes**, une par planche.

## Les maquettes

Elles se travaillent sur un canevas en ligne, privé :
<https://claude.ai/artifact/6LBaunrVpa19L14r38n6Sv>

Douze planches : Fondations, Assets, trois bandeaux animés (Vent — beau temps, Nuit — ciel
animé, Hiver — neige), et sept écrans mobiles 390 × 844
(trois variantes d'accueil, un accueil de nuit, Bibliothèque, Filtres, Fiche jeu).

### Rapatrier les sources après une séance

Le dossier `design/canvas/` est une **copie**, pas une synchronisation. Le canevas reste
l'endroit où l'on dessine ; le dépôt est l'endroit où l'on conserve et où l'on compare.
Après chaque séance de design, il faut donc redescendre les fichiers modifiés.

`canvas.json` est l'index du canevas : il donne la liste des planches, leur position et
leur taille. Chaque `<Nom>.dc.html` est une planche entière, autonome et lisible en diff.

Ne pas éditer ces fichiers à la main en espérant que le canevas se mette à jour : le flux
va du canevas vers le dépôt, et une modification locale doit être republiée pour exister
en ligne.
