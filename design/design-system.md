# AnimPartner — fondations de design

Direction retenue : **ludique et chaleureux**, mais lisible dehors et utilisable d'une main.
Un fond crème plutôt que blanc, un corail franc pour l'action, des coins largement arrondis.
Pas de dégradés décoratifs, pas d'emoji dans l'interface : les pictogrammes sont des SVG
au trait.

## Couleurs

| Jeton | Hex | Rôle |
| --- | --- | --- |
| Crème | `#FFF9F2` | fond de l'application |
| Surface | `#FFFFFF` | cartes, barres, champs |
| Encre | `#23201E` | texte principal |
| Ardoise | `#6B625B` | texte secondaire, icônes inactives |
| Bordure | `#EDE2D6` | contours de cartes et de champs |
| Corail | `#C94722` | action principale, « en cours », défoulement |
| Corail clair | `#FDEDE7` | fond de badge corail |
| Lagune | `#0E7C86` | planning, actions secondaires, jeux calmes |
| Lagune clair | `#E3F3F4` | fond de badge lagune |
| Soleil | `#F2B705` | favoris, alertes météo |
| Soleil clair | `#FEF3D4` | fond de badge soleil (texte `#8A6500`) |
| Prairie | `#2F7A3E` | extérieur, nature |
| Prairie clair | `#E6F2E7` | fond de badge prairie |
| Sable | `#F3EADF` | boutons tertiaires, badges neutres |

Contrastes : corail, lagune et prairie passent 4,5:1 avec du blanc, et servent donc de
fond de bouton à texte blanc. Les teintes claires ne portent jamais de texte clair —
toujours la version foncée de la même famille. Les états se distinguent aussi par la
clarté, pas seulement par la teinte.

## Typographie

- **Fraunces** (serif doux) pour les titres — 700 en 28/34, 600 en 20/26.
- **Nunito Sans** pour le reste — corps 16/24, secondaire 14/20,
  étiquette 12/16 en 700 capitales avec +8 % d'interlettrage.

## Rythme

- Espacement sur une base de 4 : 4, 8, 12, 16, 24, 32.
- Rayons : 12 (champ), 14–16 (carte), 20–28 (feuille modale), 999 (pastille, bouton).
- Élévation : plat (bordure seule) → carte (`0 2px 10px rgba(35,32,30,.08)`) →
  panneau (`0 10px 28px rgba(35,32,30,.16)`).

## Règles d'interface

- Cible tactile minimale **48 px** ; 44 px toléré pour les icônes dans un en-tête.
- L'action principale d'un écran est en bas, à portée du pouce, sur une barre blanche.
- La navigation est une barre basse à cinq entrées : Accueil, Jeux, Planning, Groupes, Profil.
- Les filtres s'ouvrent en feuille modale, avec un bouton de validation qui annonce le
  nombre de résultats.
- Éléments réellement interactifs : `button`, `a`, `input` associés à un `label` —
  y compris dans les maquettes, pour que la navigation clavier tienne dès le prototype.

## Crayonné léger sur les éléments d'interface

Validé le 6 novembre 2026, sur la planche « Accueil — crayonné ». L'interface porte
l'écho du paysage dessiné, à environ un cinquième de son intensité : au-delà, le texte
devient pénible à lire sur fond hachuré.

- Bordures en graphite `#4A3F36` à 32 % d'opacité, 1,4 px, à la place du beige `#EDE2D6`.
- Deuxième passe de trait : ombre dure décalée de 1 à 1,5 px, sans flou
  (`box-shadow: 1px 1.5px 0 rgba(74, 63, 54, 0.1)`).
- Rayons de coins irréguliers, quatre valeurs proches par carte (15 / 13 / 16 / 14 px) :
  plus aucun angle identique à son voisin.
- Fond de panneau hachuré en ocre, deux directions à 13 % et 10 % d'opacité.
- Filets et barres de progression tracés en SVG légèrement ondulé, plus en rectangles.

## Mode sombre

Première déclinaison sur la planche « Accueil — nuit ».

**Déclenchement : le réglage du téléphone** (décision du 6 novembre 2026), via
`prefers-color-scheme`. Pas d'heure de bascule, pas de bouton dans l'application.

**Le paysage s'assombrit avec le thème**, quelle que soit l'heure (décision du
6 novembre 2026). Un téléphone en mode sombre à 14 h affiche donc la scène du jour en
version nocturne.

Règle qui en découle, et qui limite le travail : **une scène = une géométrie, deux jeux
de couleurs**. Les tracés — horizon, nuages, astre, arbres, touffes — ne changent pas
d'un thème à l'autre. Seules changent les couleurs des motifs de hachures, les aplats de
fond et la couleur du trait de contour (graphite `#4A3F36` en clair, crème `#F6EDD4` ou
bleu `#8A93B8` en sombre). Une déclinaison sombre est un changement de palette, pas un
nouveau dessin.

L'astre suit le thème : soleil en clair, lune à la même position et au même diamètre en
sombre.

| Rôle | Clair | Sombre |
| --- | --- | --- |
| Fond de panneau | `#FEF3D4` | `#262231` |
| Surface de carte | `#FFFFFF` | `#322C3E` |
| Texte principal | `#23201E` | `#F4EFE6` |
| Texte secondaire | `#6B625B` | `#B3AAB8` |
| Bordure crayon | graphite à 32 % | crème à 22 % |
| Deuxième passe | ombre dure claire | ombre dure noire à 30 % |
| Lien, accent chaud | `#C94722` | `#FF9A74` |
| Accent planning | `#0E7C86` | `#4FC2CC` |
| Accent nature | `#2F7A3E` | `#7FC98A` |

Le corail `#C94722` reste tel quel en fond de carte : il passe 4,5:1 avec du blanc dans
les deux thèmes. Ce sont les accents **sur fond sombre** qui doivent être éclaircis, pas
les aplats.

Les hachures de fond passent de l'ocre à 13 % à un mélange ocre et parme à 7 % : sur
fond sombre, la même intensité produirait un bruit visible.

## Maquettes

Canevas Figma-like publié comme artifact privé :
<https://claude.ai/artifact/6LBaunrVpa19L14r38n6Sv>

Planches : Fondations, Accueil, Bibliothèque, Filtres, Fiche jeu.
Les écrans sont reliés entre eux : en mode lecture, on navigue de la bibliothèque à la
fiche, aux filtres et retour.

## Écrans du MVP — énigmes

Proposés le 8 novembre 2026, rangée « MVP — énigmes » du canevas. Huit écrans : une paire
énigme / réponse par bandeau animé (beau temps, nuit, hiver, automne).

- Même cadre que l'accueil crayonné : le bandeau animé en haut, la feuille relevée à 85 %
  (717 px sur 844), sans poignée : elle ne se déplace pas.
- Dans la feuille, seulement la salutation (« Bonsoir » la nuit), la date et la météo, un
  **engrenage** en haut à droite pour les paramètres (pastille de 46 px), puis une
  **étiquette à œillet** suspendue à sa ficelle. Pas de barre de navigation : le MVP n'a
  qu'un écran.
- Recto incliné de −2° : l'énigme et une pastille d'âge. Verso incliné de +2°, en aplat
  de couleur : la réponse et une phrase d'explication.
- Action principale en bas : « Voir la réponse » sur le recto, « Une autre énigme » sur le
  verso ; l'action secondaire est un lien texte en dessous.
- Chaque bandeau donne sa palette à la feuille, à l'étiquette et au bouton :

| Bandeau | Feuille | Recto | Verso | Bouton |
| --- | --- | --- | --- | --- |
| Beau temps | `#FEF3D4` | blanc, hachures ciel | soleil `#FBD23E`, texte encre | `#0E6E99` |
| Nuit | `#262231` | `#322C3E`, texte crème | lune `#F3E7C4`, texte `#1F2340` | `#F3E7C4`, texte `#1F2340` |
| Hiver | `#EEF3F7` | blanc, hachures givre | sapin `#3A6A55`, texte blanc | `#3A6A55` |
| Automne | `#FBEAD5` | `#FFFBF3`, hachures ambre | rouge `#C8432B`, texte blanc | `#B8461F` |

Les écrans sont générés par `design/outils/generer_ecrans_mvp.py`, qui recopie la scène
de chaque planche d'étude : une scène modifiée se propage en relançant le script.
