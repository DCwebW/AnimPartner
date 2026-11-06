# AnimPartner — brief produit

> Nom de travail. Projet démarré le 24 octobre 2026. Phase en cours : **design**, pas de code.

## Intention

Outiller les animateurs et animatrices d'enfants (centres de loisirs, périscolaire, colos,
accueils de jeunes) dans leur travail quotidien : préparer et dérouler des animations,
piocher un jeu adapté au moment, et tenir un planning.

## Contexte d'usage (ce qui dicte le design)

- On s'en sert **debout, dehors, souvent d'une seule main**, parfois en plein soleil,
  parfois avec vingt enfants autour. D'où : contrastes élevés, cibles tactiles ≥ 48 px,
  actions principales en bas de l'écran.
- Le besoin le plus fréquent est **urgent et court** : « il me faut un jeu, maintenant,
  pour ce groupe, dans ce lieu, avec ce qu'on a sous la main ». Le chemin vers un jeu
  jouable doit tenir en deux écrans.
- La préparation, elle, se fait **au calme la veille** : c'est le moment du planning.

## Piliers fonctionnels

1. **Bibliothèque de jeux** — catalogue filtrable (âge, durée, lieu, matériel, énergie,
   nombre d'enfants) et fiche jeu avec règles, variantes et points de sécurité.
2. **Planning** — construction d'une journée ou d'une semaine, créneaux, repli météo.
3. **Accueil / tableau de bord** — ce qui se passe maintenant, ce qui suit, les alertes.
4. **Groupes** — effectifs, âges, allergies, besoins particuliers. *(hors périmètre des
   premières maquettes)*

## Périmètre des maquettes du 24 octobre 2026

Mobile d'abord, 390 × 844.

| Écran | État |
| --- | --- |
| Fondations (couleurs, typo, composants) | maquetté |
| Accueil / tableau de bord | maquetté |
| Accueil — variante bandeau + bottom sheet | maquetté |
| Accueil — variante crayonnée | maquetté |
| Accueil — nuit, mode sombre | maquetté |
| Bibliothèque de jeux | maquetté |
| Filtres (feuille modale) | maquetté |
| Fiche jeu (règles / variantes / sécurité) | maquetté |
| Planning | à faire |
| Groupes | à faire |
| Onboarding, compte, hors-ligne | à faire |

Trois accueils coexistent volontairement : le tableau de bord classique, la variante
paysage + bottom sheet fixe à 85 %, et la même avec l'interface en crayonné léger
(dosage validé le 6 novembre 2026). À départager plus tard.

Dans la variante bandeau, le paysage **est** l'affichage météo du jour (le bandeau
d'alerte y a été supprimé). Si cette piste est retenue, il faudra dessiner les autres
temps : couvert, pluie, et sans doute neige — chacun en version claire et sombre, le
paysage suivant le thème. Soit six scènes restantes, mais les versions sombres sont des
changements de palette sur la même géométrie, pas de nouveaux dessins.

## Questions encore ouvertes

- Usage **hors ligne** : un centre a rarement du réseau dans la cour. À trancher tôt,
  cela pèse sur l'architecture.
- **Contenu** des jeux : base fournie, contributions des utilisateurs, ou les deux ?
- **Équipe** : un animateur seul, ou un planning partagé entre collègues d'un même centre ?
- Modèle économique et cadre RGPD (données d'enfants : allergies, besoins particuliers).

## Contenu des maquettes

Les noms, groupes et chiffres (« Camille », « groupe Koalas », « 24 jeux ») sont du
contenu d'exemple destiné à rendre les écrans lisibles, pas des données réelles.
