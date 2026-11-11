# Les agents planifiés

> Mis en place le 11 novembre 2026. Trois agents Claude Code tournent dans le cloud, à
> jour fixe, sous forme de **routines** (<https://claude.ai/code/routines>). Chaque routine
> porte un message court qui renvoie à la fiche de son agent : pour changer le
> comportement d'un agent, on modifie sa fiche, pas la routine.

## La semaine

| Jour | Le matin (7 h, heure de Paris) | Le soir, le porteur |
| --- | --- | --- |
| Lundi | **Designer** : un nouveau thème, en PR | Relit les captures ; fusionne ou commente |
| Mardi | **Énigmes** : trois énigmes, en PR | Retire celles qu'il refuse ; fusionne |
| Mercredi | — (la fusion de mardi suffit : la CI copiera les énigmes dans Neon) | — |
| Jeudi | **Codeur** : une issue, en PR | Recette sur Expo Go ; fusionne ou commente |
| Vendredi | **Codeur** : une autre issue, en PR | Recette ; fusionne ou commente |

Fiches : [`designer.md`](designer.md), [`enigmes.md`](enigmes.md), [`codeur.md`](codeur.md).
Critères du designer : [`criteres-design.md`](criteres-design.md).

Les crons des routines sont en UTC : 7 h à Paris l'hiver, 8 h l'été.

## Les agents regardent l'état, pas la date

Chaque agent se lance à son heure, mais **n'agit que si l'état le permet**, et sinon
s'arrête en le disant. Une soirée sans validation décale la chaîne sans la casser.

- **Fusionner une PR vaut validation.** Une PR non fusionnée n'existe pas pour les
  agents suivants.
- **Commenter une PR** demande une reprise : l'agent concerné la traite à son prochain
  passage, avant tout nouveau travail.
- **Fermer une PR sans la fusionner** vaut refus. Pour un design, fermer aussi l'issue
  de code qui en serait née.
- Un agent n'empile pas : tant que sa PR précédente attend, il ne produit rien de neuf.

## Du design au code, sans écrire d'issue

L'agent designer rédige lui-même l'issue de code, dans `issue.md` à côté du design. À la
fusion de la PR de design, le workflow `.github/workflows/issues-depuis-design.yml` crée
l'issue sur GitHub. Le codeur la prend ensuite comme les autres.

## Les labels

| Label | Sens |
| --- | --- |
| `priorité` | Le codeur la prend avant les autres (les fêtes, pour être prêtes à leur date) |
| `thème` | Issue née d'un design de thème |
| `bloqué` | L'agent attend une réponse du porteur en commentaire |
| `attend le porteur` | Une action du porteur est nécessaire avant de commencer |

## Les énigmes : le dépôt est la source

Les énigmes validées vivent dans le dépôt, dans le catalogue défini par l'issue #5.
L'historique Git dit qui a proposé quoi et quand il a été validé. Neon n'en est qu'une
copie publiée, mise à jour par la CI à chaque fusion sur `main` (à mettre en place avec
les issues de l'API). Aucun agent n'écrit dans la base de production.
