# Thème 02 — Jour de l'an

## Intention
Une nuit du 31 décembre festive et laïque : ciel indigo, feux d'artifice rose, or et turquoise,
toits de la ville avec leurs fenêtres allumées, clocher dont l'horloge marque minuit, ballons,
guirlande de lumières et confettis. Distinct de Noël (rouge/vert, journée) et de la Nuit
(calme). La feuille reste claire (crème) pour la lisibilité ; le verso est indigo, le bouton
framboise.

## Recherche
Accès web non utilisé : travail à partir de références connues (feux d'artifice en étoiles
vus de loin, silhouettes de toits de villages, horloges de gare). Aucune illustration
existante recopiée ; la géométrie des toits et du ciel hachuré reprend le style de `NuitAnimee`
et de `HiverNeige`, avec des formes propres.

## Choix
- Aucun symbole religieux : feux d'artifice, horloge, ballons, lumières, confettis.
- Bandeau SVG en ligne, sans ressource externe ; transformations et opacité seulement :
  3 feux d'artifice (apparition/éclat/fondu, 5 s), 5 scintillements, 4 ballons (balancement),
  1 horloge (pulsation), 1 couche de confettis = 14 éléments animés.
  `prefers-reduced-motion` arrête tout.
- Les ballons sont en partie masqués par la feuille : volontaire, ils « dépassent » derrière.
- Polices comme les maquettes existantes (repli Georgia / system-ui hors ligne).
- Fichiers d'écran produits avec le générateur existant (`design/outils/`, non modifié) ;
  `palette.json` reprend toutes les clés d'une entrée de `THEMES`.
- Captures prises avec Playwright (la commande `npm run capture` n'était pas utilisable :
  dépendances non installées dans l'environnement).

## Contrastes (WCAG, rapport de luminance)
| Texte / fond | Rapport |
| --- | --- |
| Énigme `#23201E` sur recto `#FFFFFF` | 16,19 |
| Étiquette « Énigme » `#B0155A` sur `#FFFFFF` | 6,77 |
| Puce d'âge `#80103F` sur `#F9DCE8` | 7,96 |
| Réponse `#FFFFFF` sur verso `#2A2D62` | 12,73 |
| Kicker `#F6E3A8` sur `#2A2D62` | 9,98 |
| Explication `#E8E9FA` sur `#2A2D62` | 10,59 |
| Bouton `#FFFFFF` sur `#B0155A` | 6,77 |
| Lien `#80103F` sur feuille `#FBF1E0` | 9,09 |
| Salutation `#23201E` sur feuille | 14,47 |
| Date/météo `#5E4F63` sur feuille | 6,76 |

## À valider
- Bandeau sombre sous une feuille claire : la nuit du 31 décembre, sans reprendre la palette
  du thème Nuit.
- Texte d'exemple : « Mercredi 31 décembre · Froid sec, 2 °C » (contenu d'exemple).
