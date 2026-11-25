# Critères de design — les thèmes de l'écran d'énigmes

> Fixés le 11 novembre 2026 par le porteur du projet. Lus par l'agent designer à chaque
> itération (voir [`designer.md`](designer.md)). Le porteur modifie ce fichier pour
> changer la direction ; l'agent ne le modifie jamais.

## Ce qu'est un thème

Un thème, c'est **un bandeau animé et les couleurs de l'écran qui vont avec**, sur le
modèle des quatre thèmes existants (beau temps, nuit, hiver, automne). L'écran lui-même
ne change pas : feuille relevée à 85 %, salutation, étiquette à œillet, boutons.

Références à étudier avant chaque itération :

- les quatre paires d'écrans `design/canvas/Mvp<Bandeau><Face>.dc.html` ;
- les planches d'étude des bandeaux : `VentBeauTemps`, `NuitAnimee`, `HiverNeige`,
  `AutomneLac` ;
- la section « Écrans du MVP — énigmes » de [`design/design-system.md`](../../design/design-system.md) ;
- le dictionnaire `THEMES` de [`design/outils/generer_ecrans_mvp.py`](../../design/outils/generer_ecrans_mvp.py),
  qui liste **toutes** les couleurs d'un thème.

## Le calendrier des itérations

Une itération par semaine, le lundi. Dix-neuf itérations : six fêtes, un écran de
paramètres, six paysages, six pays. L'agent prend la première ligne qui n'est pas encore
faite.

| N° | Famille | Thème | Semaine prévue | Affichage dans l'app |
| --- | --- | --- | --- | --- |
| 01 | Fêtes | Noël | 16 nov. 2026 | Automatique, du 1er au 26 décembre |
| 02 | Fêtes | Jour de l'an | 23 nov. | Automatique, du 27 décembre au 3 janvier |
| 07 | Écran | Paramètres (derrière l'engrenage) | 30 nov. | Voir plus bas |
| 03 | Fêtes | Épiphanie (galette des rois) | 7 déc. | Automatique, du 4 au 12 janvier |
| 04 | Fêtes | Chandeleur (crêpes) | 14 déc. | Automatique, du 28 janvier au 3 février |
| 05 | Fêtes | Carnaval (Mardi gras) | 21 déc. | Automatique, les 7 jours qui précèdent Mardi gras et Mardi gras (date mobile : Pâques − 47 jours) |
| 06 | Fêtes | Pâques (chasse aux œufs) | 28 déc. | Automatique, du samedi précédant Pâques au lundi de Pâques (date mobile) |
| 08 | Paysages | Montagne | 4 janv. 2027 | Au choix, dans les paramètres |
| 09 | Paysages | Plage | 11 janv. | Au choix |
| 10 | Paysages | Forêt | 18 janv. | Au choix |
| 11 | Paysages | Campagne | 25 janv. | Au choix |
| 12 | Paysages | Cascade | 1er févr. | Au choix |
| 13 | Paysages | Banquise | 8 févr. | Au choix |
| 14 | Pays | France | 15 févr. | Au choix |
| 15 | Pays | Angleterre | 22 févr. | Au choix |
| 16 | Pays | États-Unis | 1er mars | Au choix |
| 17 | Pays | Chine | 8 mars | Au choix |
| 18 | Pays | Maroc | 15 mars | Au choix |
| 19 | Pays | Japon | 22 mars | Au choix |

Les fêtes viennent dans l'ordre du calendrier, pour que chaque thème soit codé avant sa
date. L'itération 07 passe avant l'Épiphanie (décision du 25 novembre 2026) : l'écran
des paramètres est attendu par l'issue #55. Elle garde son numéro : son dossier est
`design/propositions/07-parametres/`. L'ordre des lignes fait foi, pas les numéros.
La liste des paysages est une proposition : le porteur peut la changer ici avant leur
tour.

### Règles d'affichage

- **Mode automatique** (par défaut) : la nuit garde son bandeau ; sinon une fête dans sa
  période passe devant la saison ; sinon la saison (hiver, automne, beau temps).
- **Un thème par jour** dans les paramètres : un thème tiré chaque jour parmi les thèmes
  au choix (saisons, paysages, pays), jamais le même deux jours de suite. Ni la nuit ni
  les fêtes n'en font partie ; la nuit reprend le soir, une fête ne passe pas devant.
- **Choix manuel** dans les paramètres : le thème choisi s'affiche jour et nuit, fêtes
  comprises, jusqu'au retour au mode automatique.
- La salutation suit l'heure, quel que soit le mode.
- Chaque issue de thème dit comment brancher sa règle dans `themeDuMoment` (fêtes) ou
  dans la liste des thèmes au choix (paysages, pays).

## Itération 07 : l'écran des paramètres

Pas de bandeau cette fois : un écran ouvert par l'engrenage, dans le même cadre que
l'écran d'énigme. Il contient :

- le **prénom** (champ modifiable : il change le prénom donné à la première ouverture) ;
- le **thème** : « Automatique » en premier, puis « Un thème par jour », puis chaque
  thème à choisir (fêtes, nuit, saisons, et plus tard paysages et pays), chacun avec
  une vignette fixe de son bandeau ;
- un interrupteur « Garder l'écran allumé » (pendant la lecture des énigmes) ;
- un bouton « Effacer mes données », avec sa confirmation dépliée dans l'écran (pas
  d'alerte système) ;
- une section « À propos » : version, nombre d'énigmes, phrase de confidentialité,
  crédits des polices ;
- un bouton de retour vers l'énigme.

Le comportement est déjà spécifié dans les issues #54 à #58 : la maquette les suit.
L'issue de code existe donc déjà (#55). L'`issue.md` de cette itération, qui devient une
issue à la fusion, ne la répète pas : titre « Écran des paramètres — compléments de la
maquette », une liste des seuls détails visuels que #55 ne dit pas et des écarts de la
maquette avec #54 à #58, et « Dépend de : #55 ».

Le prévoir pour que la liste des thèmes s'allonge sans changer la mise en page : six
paysages et six pays vont s'y ajouter.

## Ce que produit chaque itération

Dans `design/propositions/<N°>-<thème>/` (par exemple `design/propositions/01-noel/`) :

| Fichier | Contenu |
| --- | --- |
| `bandeau.html` | Planche d'étude du bandeau seul, 390 × 200, animée, sur le modèle de `VentBeauTemps.dc.html` |
| `enigme.html` | L'écran recto, 390 × 844, sur le modèle de `MvpVentEnigme.dc.html` |
| `reponse.html` | L'écran verso, 390 × 844, sur le modèle de `MvpVentReponse.dc.html` |
| `palette.json` | Les couleurs du thème, **avec exactement les clés d'une entrée de `THEMES`** |
| `captures/` | `bandeau.png`, `enigme.png`, `reponse.png` |
| `notes.md` | L'intention, la recherche et ses sources, les choix, les contrastes vérifiés |
| `issue.md` | L'issue de code qui portera ce thème dans l'app (format dans [`designer.md`](designer.md)) |

Pour l'itération 07 : `parametres.html`, ses captures, `notes.md` et `issue.md`.

## Contraintes visuelles

- **Direction** : ludique et chaleureux, lisible dehors, en plein soleil. Le crayonné
  léger des écrans existants (hachures, traits) se garde, à la même intensité.
- **Bandeau** : SVG en ligne uniquement — aucune image, aucune police ni ressource
  externe. Il doit fonctionner hors ligne et se porter tel quel en `react-native-svg`.
- **Animation** du bandeau : seulement des transformations (déplacement, rotation,
  échelle) et de l'opacité, en boucles douces de plusieurs secondes. Pas de filtre, pas
  de flou, pas de dégradé animé : ce sont les seules animations que Reanimated portera
  sans peine. Une règle `prefers-reduced-motion` arrête tout.
- **Sobriété** : une vingtaine de formes animées au plus. Le bandeau accompagne
  l'énigme, il ne la concurrence pas.
- **Couleurs** : texte et bouton à **4,5:1** au moins sur leur fond, vérifié et noté dans
  `notes.md`. Le recto et le verso se distinguent nettement. La feuille, l'étiquette et
  le bouton tirent leurs couleurs du bandeau, comme dans les thèmes existants.
- **Textes d'exemple** : une énigme d'exemple adaptée au thème sur `enigme.html`, sa
  réponse sur `reponse.html`. Une date d'exemple dans la période du thème.

## Contraintes de contenu

- **Fêtes : un traitement festif et laïque.** L'application sert dans des accueils de
  loisirs publics. Pas de symbole religieux (crèche, croix, ange) : sapin, cadeaux,
  guirlandes, galette, crêpes, masques et confettis, œufs et lapins conviennent.
- **Pays : des paysages, des monuments, une nature, des objets du quotidien.** Jamais de
  personnes représentées en costume ou en caricature, pas de clichés réducteurs, pas de
  drapeau en guise de décor principal. Le thème doit pouvoir être montré à un enfant
  originaire de ce pays sans le gêner.
- **Recherche** : chercher des références (photos de paysages, motifs, architecture,
  palettes) et les citer dans `notes.md`. S'inspirer, ne jamais recopier une illustration
  existante.
