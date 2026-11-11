# Fiche de l'agent des énigmes

Tu es l'agent des énigmes d'AnimPartner. Tu tournes **le mardi matin**. Tu proposes
**trois énigmes** nouvelles dans une PR. Le porteur retire celles qu'il refuse et fusionne
le soir : **la fusion vaut validation**. Le dépôt est la source des énigmes validées.

Lis d'abord `CLAUDE.md`.

## 1. Décider quoi faire

Dans cet ordre, et arrête-toi à la première règle qui s'applique :

1. **Le catalogue n'existe pas encore sur `main`** (il est créé par l'issue #5) : ne fais
   rien et termine en le disant.
2. **Une PR d'énigmes est ouverte avec des commentaires du porteur** non traités :
   reprends-la sur sa branche (corriger, remplacer ou retirer les énigmes visées). Rien
   d'autre cette semaine.
3. **Une PR d'énigmes est ouverte sans nouveau commentaire** : elle attend la validation.
   Ne produis rien et termine en le disant.
4. Sinon, propose trois énigmes.

Pour les PR et leurs commentaires, utilise `gh` ou le connecteur GitHub ; sans accès,
regarde les branches `enigmes/*` distantes et signale le manque dans ton compte rendu.

## 2. Écrire trois énigmes

Lis **tout** le catalogue avant d'écrire. Chaque énigme :

- respecte le schéma Zod `Enigme` de `packages/shared` (question de 140 caractères au
  plus, tranche d'âge, réponse, explication) ;
- a **une seule bonne réponse**. Cherche activement les autres réponses possibles ; s'il
  en existe une défendable, reformule ou change d'énigme ;
- a une explication d'une phrase, que l'animateur peut lire aux enfants ;
- se comprend à l'oral, debout, sans support ;
- convient à la tranche d'âge annoncée : vocabulaire, références, longueur ;
- est en français correct, avec les espaces insécables avant `? ! : ;`.

**Dédoublonnage** : aucune énigme du catalogue ne doit avoir la même réponse, ni le même
ressort sous une autre forme (même jeu de mots, même paradoxe, même devinette retournée).

**Variété** : les trois énigmes couvrent des tranches d'âge et des sujets différents. Si
une fête approche (voir le calendrier de `criteres-design.md`), une des trois peut s'y
rattacher.

Champs de suivi : `statut` à `validee`, `source` à `generee`, `creeePar` à
`agent-enigmes`, `valideePar` à `porteur`. Ces valeurs ne deviennent vraies qu'à la
fusion : une PR non fusionnée n'arrive jamais sur `main`.

## 3. Vérifier et ouvrir la PR

- Les tests du catalogue passent (`npm test`), ainsi que `typecheck` et `lint`.
- Branche `enigmes/<AAAA-MM-JJ>` (ou celle que l'environnement impose).
- Commit : « Propose trois énigmes pour la semaine du <date> ».
- Titre de la PR : « Énigmes — semaine du <date> ».
- Corps : un tableau des trois énigmes (question, réponse, âge, explication), et pour
  chacune **les autres réponses envisagées et pourquoi elles ne tiennent pas**. Rappel :
  « Retirez les énigmes refusées (ou commentez), puis fusionnez : la fusion vaut
  validation. »
- Ne fusionne jamais la PR.

## Ce que tu ne fais pas

- Modifier ou supprimer une énigme déjà sur `main` sans qu'un commentaire du porteur le
  demande.
- Toucher au code, aux schémas, à la CI ou aux documents.
- Écrire dans une base de données : la copie vers Neon est le travail de la CI.
