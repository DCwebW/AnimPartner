# Identité — logo, icône et écran de chargement

Proposition hors calendrier des itérations (numéro 00 : elle précède les thèmes). Elle
part du logo et de l'icône fournis par le porteur le 15 novembre 2026, nettoyés et
déclinés pour l'application.

## Ce que contient le dossier

| Fichier | Rôle |
| --- | --- |
| `sources/logo-source.webp`, `sources/icone-source.webp` | Images d'origine, telles que reçues |
| `icone-ap.png` | Icône « AP » détourée, référence haute définition |
| `app/` | Fichiers prêts à copier dans `apps/mobile/assets/` (mêmes noms que les actuels, plus `logo.png`) |
| `splash.html` | Simulation du splash natif Android 12+ (`?theme=sombre` pour la version sombre) |
| `chargement.html` | Écran de chargement en React, avec le logotype |
| `icones.html` | Icône dans les masques Android, monochrome, iOS, favicon |
| `capture-*.png` | Captures des trois pages |
| `fabrication/` | Scripts qui produisent `icone-ap.png` et `app/` depuis `sources/` (Pillow, NumPy, SciPy) |
| `issue.md` | Issue de code créée à la fusion |

## Retouches faites sur les sources

Les deux images viennent d'un générateur d'images et portaient des défauts.

- **Icône « AP »** : le fond transparent était un **faux damier peint dans l'image**
  (aucune couche alpha). Détourage par reconstitution de la grille du damier (50 × 50
  cases) : seuls les gris qui correspondent à la case attendue et touchent le bord sont
  retirés. Le contour bleu marine de l'autocollant était **interrompu sous le « A »** (le
  crème débordait sur le fond) : un trait bleu marine de 8 px a été ajouté sous toute la
  silhouette pour le refermer. Le contour extérieur est donc un peu plus épais que dans
  l'original.
- **Logotype** : la transparence était réelle. Il y avait trois **trous transparents**
  entre « Anim » et « Partner », bordés d'éclats bleu marine. Ils sont bouchés en crème
  et leurs liserés effacés : les deux lignes forment maintenant un seul autocollant.
- Les images reçues sont des WebP passés par la conversation, peut-être recompressés. Si
  des fichiers d'origine en meilleure qualité (ou vectoriels) existent, il suffit de les
  mettre dans `sources/` et de relancer `python3 fabrication/generer.py`.

## Choix

- **Fond de l'icône** : Soleil clair `#FEF3D4`, hachuré en ocre dans deux directions
  (13 % et 10 %), comme le fond de panneau du crayonné. À 48 px, les hachures se fondent
  en un aplat crème, sans bruit.
- **Zone sûre Android** : l'« AP » et ses éclats tiennent dans un cercle de 300 px de
  rayon sur 1024 (zone sûre : 313 px, soit 66 dp sur 108). Aucun masque ne les coupe.
- **Icône à thème (Android 13+)** : silhouette des deux lettres et des éclats, sans
  l'anneau crème, pour que le système puisse la teinter.
- **Splash natif** : fond uni `#FEF3D4` en clair, `#262231` en sombre (fond de panneau
  du mode sombre), icône « AP » au centre. Android 12+ impose ce format : une icône
  dans un cercle, pas de logotype large.
- **Écran de chargement** : le logotype complet, 280 px de large, remonté de 24 px pour
  le centre optique, sur le même fond uni que le splash. Le passage du splash à cet
  écran est un fondu de l'« AP » vers le logotype, puis un fondu vers l'énigme.
- Le logotype garde son contour d'autocollant : il se lit sur la crème comme sur le fond
  sombre, sans variante.

## Contrastes

Le logo n'est pas du texte d'interface : il porte un libellé d'accessibilité
« AnimPartner ». Le contour bleu marine (`#101834` environ) sur `#FEF3D4` dépasse 15:1,
et l'anneau crème sur `#262231` environ 14:1 : la silhouette se détache dans les deux
thèmes.

## Couleurs de marque à ajouter au design system

Le logo introduit deux teintes qui ne sont pas dans la palette : un **vert** proche de
Prairie (`#2F7A3E`), et un **bleu marine** (`#26477B` environ pour le remplissage,
`#101834` pour le contour). Elles restent propres au logo : ne pas les utiliser dans
l'interface sans décision.

## Points à valider

1. **Durée minimale de l'écran de chargement.** Sans minimum, sur un téléphone rapide,
   le logotype n'apparaît qu'un instant. L'issue propose 800 ms au plus tôt après
   l'affichage de l'écran, sauté si le système demande moins d'animations. Zéro est
   aussi un choix défendable : l'animateur veut son énigme vite.
2. **Mode sombre** : `app.json` force aujourd'hui `"userInterfaceStyle": "light"`. Le
   splash sombre est prêt, mais il ne s'affichera que lorsque l'application suivra le
   réglage du téléphone, ce qui sort de cette proposition.
