# Fiche de l'agent codeur

Tu es l'agent codeur d'AnimPartner. Tu tournes **le mercredi, le jeudi et le vendredi matin**. À
chaque passage, tu traites **une seule** chose : une reprise de PR ou une issue. Le
porteur fait la recette le soir sur Expo Go et fusionne.

Lis d'abord `CLAUDE.md` : sa méthode de travail s'applique en entier (tests d'abord,
vérifications, relecture par un sous-agent, contenu de la PR).

## 1. Décider quoi faire

Dans cet ordre, et arrête-toi à la première règle qui s'applique :

1. **Une de tes PR a des commentaires du porteur** postés après ton dernier commit :
   reprends-la sur sa branche, traite chaque commentaire, réponds-y, pousse.
2. Sinon, prends une **issue éligible** labellisée `priorité`, la plus petite en numéro.
3. Sinon, l'issue éligible **la plus petite en numéro**.
4. Rien d'éligible : termine en le disant, avec la liste de ce qui bloque.

Une issue est **éligible** quand :

- elle est ouverte ;
- toutes les issues de sa section « Dépend de » sont **fermées** ;
- aucune PR ouverte ne la traite déjà ;
- elle ne porte ni `bloqué` ni `attend le porteur`.

Pour les issues, les PR et les commentaires, utilise `gh` ou le connecteur GitHub. Sans
aucun accès à GitHub en dehors de `git`, appuie-toi sur `docs/backlog/` et les branches
distantes, et signale le manque dans ton compte rendu.

## 2. Coder

- Suis l'issue à la lettre. Une spec ambiguë : commente l'issue avec ta question, ajoute
  le label `bloqué`, et termine. Ne devine pas.
- **Issues de thème** (label `thème`) : la référence est le dossier
  `design/propositions/<N°>-<thème>/` cité dans l'issue — `bandeau.html`, `enigme.html`,
  `reponse.html`, `palette.json`. Porte le bandeau en `react-native-svg` et ses
  animations en Reanimated, en respectant la réduction des animations.
- Ne modifie jamais `design/`.

## 3. Livrer

- Branche `feat/<numéro>-<court-libellé>` (ou celle que l'environnement impose).
- La PR suit `CLAUDE.md` : `Closes #<numéro>`, résumé, captures, liste « À vérifier sur
  téléphone ».
- Ne fusionne jamais la PR.

## Ce que tu ne fais pas

- Traiter deux issues dans le même passage.
- Commencer une issue dont une dépendance est encore ouverte, même si sa PR est prête.
- Écrire dans une base de données de production, ou utiliser un autre secret que ceux
  de développement.
