# AnimPartner — décisions de cadrage du MVP

> Issues d'une discussion du 7 novembre 2026. Complètent le [brief produit](brief-produit.md)
> sans le remplacer : le brief décrit la cible, ce document décrit le premier pas.

## Le MVP en une phrase

Un catalogue d'**énigmes et devinettes**, alimenté par un agent de génération dont chaque
production passe par ma validation, **sans aucune donnée sur les enfants**.

C'est un resserrement net par rapport aux piliers du brief : la bibliothèque de jeux, le
planning et les groupes restent la cible, mais n'entrent pas dans le MVP.

## Pour qui

- **D'abord moi seul**, sur le terrain, pour valider l'usage réel.
- **Ensuite d'autres animateurs, petit à petit**, pour éprouver la viabilité : est-ce utile,
  est-ce que ça revient dans leur quotidien ?

Conséquence de conception : penser multi-utilisateurs dès le schéma (savoir qui a créé,
validé ou généré quoi), sans construire de comptes tant que je suis le seul utilisateur.

## Contenu et génération

- Les énigmes arrivent en statut `draft`. **Jamais de publication directe** : je les valide
  une à une dans un écran d'admin.
- L'agent de génération est un **job planifié** qui produit du **JSON structuré**, avec
  dédoublonnage sémantique (ne pas reproposer une énigme déjà connue sous une autre forme)
  et vérification des ambiguïtés (une devinette doit n'avoir qu'une bonne réponse).
- La génération en lot coûte quelques centimes par mois via l'API à l'usage.

## Ordre de développement

1. Schéma de base
2. Affichage des énigmes
3. Écran d'admin (validation des `draft`)
4. Job de génération, en dernier

## Méthode de travail

- Claude Code via l'abonnement Pro (coût plafonné), pas de crédits API pour coder. Passage
  à Max seulement si les limites sont atteintes régulièrement.
- Un `CLAUDE.md` à la racine (stack, conventions, commandes), à écrire **dès que la stack
  est choisie**.
- Une spec avant chaque implémentation, des petites tâches vérifiables par des tests.
  L'autonomie de l'agent de code vient plus tard.

## Vision au-delà du MVP

- La vraie valeur : la **génération contextualisée** (âge, thème, durée, lieu, taille du
  groupe).
- L'anticipation des vacances et les templates de planning relèvent du **cron et de règles**,
  pas d'un LLM.

## Points de vigilance pour l'ouverture à d'autres animateurs

- **RGPD** : il s'applique dès qu'on collecte l'usage des animateurs (comptes, favoris,
  historique), même sans aucune donnée d'enfant. Une lecture du catalogue sans compte ni
  suivi garde ce poids au minimum.
- **Quotas** : obligatoires si la génération s'ouvre aux utilisateurs, sinon le coût API
  n'est plus plafonné.
- **Admin protégé** : même seul utilisateur, l'écran de validation doit être inaccessible
  au public dès que l'app est en ligne.

## Encore à trancher

- ~~La **stack**~~ : tranchée le 8 novembre 2026, voir la [stack technique](stack-technique.md).
  Le `CLAUDE.md` peut maintenant s'écrire.
- ~~Le **hors-ligne**~~ : tranché le 8 novembre 2026 — cache des énigmes persisté sur le
  téléphone, pas de base locale tant que le contenu reste du texte en lecture.
- La place des énigmes dans les **maquettes** existantes, dessinées autour de la
  bibliothèque de jeux : nouvelle famille dans la bibliothèque, ou écran à part ?
