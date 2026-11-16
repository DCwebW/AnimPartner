# Thème 01 — Noël

## Intention
Un Noël festif et laïque, chaud et lisible en plein jour : fanions en guirlande, grand sapin
décoré, cadeaux, petits sapins en fond, confettis qui tombent doucement. Fond crème-rosé,
rouge et vert profonds, or pour les accents. L'écran garde la structure des quatre thèmes
existants ; seuls le bandeau, les couleurs et les textes d'exemple changent.

## Recherche
Accès web non utilisé pour cette itération : travail à partir de ce que je sais des
références classiques (fanions de fêtes de village, papier d'emballage kraft et rouge,
étiquettes-cadeaux). Aucune illustration existante recopiée ; les sapins reprennent la
géométrie des sapins de `HiverNeige` (coloris et décorations propres).
Sources à compléter par le porteur s'il le souhaite : néant.

## Choix
- Aucun symbole religieux : sapin, cadeaux, fanions, confettis.
- Bandeau SVG en ligne, sans ressource externe ; animations uniquement en transform et
  opacité : 6 fanions (balancement), 7 boules du sapin (lueur), 1 étoile (pulsation),
  1 couche de confettis (chute en boucle) = 15 éléments animés. `prefers-reduced-motion`
  arrête tout.
- Verso vert sapin / recto blanc : distinction nette. Bouton rouge `#B0302A`.
- Les polices (Fraunces, Nunito Sans) sont chargées comme dans les maquettes existantes ;
  repli Georgia / system-ui hors ligne.
- Les fichiers sont générés avec le générateur existant (`design/outils/`, non modifié)
  pour garantir la même structure ; `palette.json` reprend toutes les clés d'une entrée de
  `THEMES` (`key`, `src` inclus).

## Contrastes (WCAG, rapport de luminance)
| Texte / fond | Rapport |
| --- | --- |
| Énigme `#23201E` sur recto `#FFFFFF` | 16,19 |
| Étiquette « Énigme » `#B0302A` sur `#FFFFFF` | 6,36 |
| Puce d'âge `#8E2420` sur `#FBE0DA` | 6,92 |
| Réponse `#FFFFFF` sur verso `#1F6B45` | 6,47 |
| Kicker `#F6E3A8` sur `#1F6B45` | 5,07 |
| Explication `#EAF5EE` sur `#1F6B45` | 5,79 |
| Bouton `#FFFFFF` sur `#B0302A` | 6,36 |
| Lien `#8E2420` sur feuille `#FDF1E3` | 7,79 |
| Salutation `#23201E` sur feuille | 14,55 |
| Date/météo `#6B4F47` sur feuille | 6,66 |

## À valider
- Étoile du sapin proche du dernier fanion à droite : volontairement écarté.
- Texte d'exemple : « Mardi 15 décembre · Givre, 1 °C » (contenu d'exemple).
