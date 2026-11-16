import donnees from './catalogue.json';
import { CatalogueSchema, type Enigme } from './schema';

/** Ne garde que les énigmes validées : une énigme `draft` n'est jamais affichée. */
export function enigmesAffichables(enigmes: readonly Enigme[]): Enigme[] {
  return enigmes.filter((enigme) => enigme.statut === 'validee');
}

/**
 * Le catalogue embarqué dans l'application, vérifié par le schéma. Une énigme mal
 * formée lève une erreur : les tests du dépôt l'attrapent avant la fusion.
 */
export const CATALOGUE: readonly Enigme[] = CatalogueSchema.parse(donnees);
