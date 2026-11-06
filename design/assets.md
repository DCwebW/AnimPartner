# AnimPartner — assets

Planche **Assets** du canevas : <https://claude.ai/artifact/6LBaunrVpa19L14r38n6Sv>
(à droite des Fondations).

Tout y est en **SVG en ligne**, aucun fichier image à charger. Conséquence directe :
rien à télécharger pour un usage hors ligne, et les pictogrammes héritent de la couleur
du texte qui les entoure.

## Pictogrammes d'interface

24 pictogrammes sur une grille de 24, trait 2 px, bouts et jointures arrondis,
`stroke="currentColor"` pour suivre la couleur du contexte.

Navigation : accueil, jeux, planning, groupes, profil.
Actions : recherche, filtres, trier, retour, fermer, ajouter, validé, favori, partager,
modifier, déplacer.
Métadonnées de jeu : minuteur, durée, lieu, âge, matériel.
États : météo, alerte, hors ligne.

## Familles de jeux

Huit familles, chacune avec son pictogramme dans une tuile de 48 px au fond pâle :
Poursuite (corail), Coopération et Retour au calme (lagune), Observation (soleil),
Grand jeu et Nature (prairie), Chant et Création (sable).

La famille sert de repère visuel dans les listes : c'est elle qui donne la couleur de la
vignette d'une carte de jeu.

## Niveau d'énergie

Trois barres, lues d'un coup d'œil : Calme (1 barre lagune), Moyen (2 barres soleil),
Défoulement (3 barres corail). La teinte **et** le nombre de barres changent, pour que
l'information passe sans dépendre de la couleur seule.

## Pastilles de groupe

Deux lettres du nom, fond pâle et texte foncé de la même famille. La couleur se déduit du
nom du groupe pour qu'il garde la sienne d'un écran à l'autre.

## Points de vigilance

Trois étiquettes récurrentes, à placer sur une fiche enfant comme sur un créneau :
Allergie (corail), Besoin particulier (lagune), Repli météo (soleil).

## Illustrations d'état

Trois scènes plates, 200 × 120 : *Aucun jeu ne correspond*, *Hors ligne*,
*Journée terminée*. Règle : une illustration d'état est toujours accompagnée d'une sortie
(relâcher un filtre, consulter les fiches téléchargées, préparer demain) — jamais d'une
impasse.

## Bandeaux de fiche jeu

Six décors pour l'en-tête d'une fiche, choisis selon le lieu ou le moment. Ils remplacent
la photo, qu'on n'aura pas pour la plupart des jeux.

- **Extérieur · cour** (lagune), **Intérieur · salle** (corail), **Nature · forêt**
  (prairie) : aplats de couleur, formes géométriques simples.
- **Eau · piscine** : bandes d'eau et écume dans la famille lagune (`#17919B`, `#0A6670`,
  écume `#7FD0D6`), ballon et soleil en accents.
- **Veillée · soir** : fond `#3A2E26`, lune et étoiles en crème `#FEF3D4`, collines
  `#2A211B`, feu de camp corail et soleil. Le seul bandeau sombre — c'est voulu, la
  veillée doit se repérer d'un coup d'œil dans une liste.
- **Beau temps · croquis** : ciel ensoleillé sur sol herbeux, crayon de couleur en
  *layering*. Voir la technique plus bas.

Les deux registres (aplats et croquis) cohabitent pour l'instant, décision du
24 octobre 2026. À reprendre une fois qu'on aura vu le rendu dans une vraie liste de jeux.

### Le crayonné en *layering* — validé le 24 octobre 2026

Le bandeau « Beau temps » reproduit la superposition de couches du crayon de couleur :
plusieurs balayages dans des directions différentes, chacun densifiant la couleur.

En SVG, chaque couche est un `<pattern>` de traits parallèles (espacement 3,2 à 4 px,
trait de 1,4 à 1,7 px, bouts arrondis), appliqué en `<rect>` à opacité partielle. Les
directions s'empilent : horizontal, oblique à +38°, vertical, oblique à −42°, puis
un dernier passage horizontal. Les couches hautes sont limitées en hauteur, ce qui
densifie le haut du ciel — l'équivalent du dégradé obtenu au crayon en repassant.

Même principe pour l'herbe (horizontal, oblique −40°, vertical, oblique +36°, puis
horizontal, en densifiant vers le bas) et pour le soleil (deux directions). Un
`<clipPath>` par zone empêche les hachures de déborder.

Couleurs renforcées par rapport à la première version : ciel `#1F86B5` / `#0E6E99` /
`#36A6CC` sur fond `#CFE9F4`, herbe `#74B32E` / `#27702F` / `#8CC63F` sur fond
`#DCEFBC`, soleil `#FBD23E` hachuré `#EFA81A` et `#E08A0B`. Graphite des contours :
`#4A3F36`, toujours en double passe pour le tremblé.

### Le vent — validé le 6 novembre 2026

Planche « Vent — beau temps », la scène isolée à sa taille réelle. Deux mouvements, en
CSS, sans script.

**Rafales.** Trois tracés blancs traversant le ciel, chacun avec une boucle. Le trait ne
se déplace pas : il est découpé en `stroke-dasharray: 90 610` et c'est le
`stroke-dashoffset` qui parcourt les 700 unités du cycle. Le segment visible se dessine
donc en avançant et s'efface derrière lui. Le vide de 610 crée les temps morts entre
deux bourrasques. Durées 6 / 7,5 / 8,5 s avec départs décalés : comme elles ne sont pas
multiples entre elles, les rafales ne se resynchronisent jamais.

**Herbe.** Un seul `skewX` animé sur le groupe des touffes, avec
`transform-box: view-box` et `transform-origin` posé sur la ligne d'horizon. Ce qui
touche le sol reste fixe, ce qui dépasse se couche — proportionnellement à sa hauteur.
Jusqu'à 9°, avec une reprise à mi-course pour donner deux temps à la bourrasque.

**Nuages.** Dérive lente en `translateX`, une vitesse par nuage. Sans elle, un ciel
immobile sous un vent visible sonne faux.

Tout est coupé sous `prefers-reduced-motion: reduce`.

## À faire

- Décider si le vent anime le paysage des écrans d'accueil ou reste une étude. S'il
  passe sur les écrans : est-il permanent, ou ne se déclenche-t-il qu'au-delà d'une
  certaine vitesse de vent réelle ?
- Trancher le registre des bandeaux une fois qu'on les aura vus en situation.
- Décider si le choix du bandeau est automatique (déduit du lieu et du moment du jeu) ou
  laissé à l'animateur.
- Décider si les familles de jeux restent huit ou si elles fusionnent avec les filtres
  d'énergie, qui se recoupent en partie (Retour au calme / Calme).
