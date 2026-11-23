// Code partagé par l'application, l'API et le job de génération :
// schémas Zod, types et logique pure, sans React.
export { CATALOGUE, enigmesAffichables } from './enigmes/catalogue';
export { creerTirage, melanger, type Aleatoire } from './enigmes/tirage';
export {
  HISTORIQUE_MAX,
  avancer,
  courant,
  creerHistorique,
  peutReculer,
  reculer,
  type Historique,
} from './enigmes/historique';
export { CatalogueSchema, EnigmeSchema, QUESTION_MAX, type Enigme } from './enigmes/schema';
export { CLES_PALETTE, PALETTES, type CleTheme, type Palette } from './themes/palettes';
export { formaterDateDuJour, formaterTrancheAge } from './formatage/date';
export { salutationDuMoment, themeDuMoment } from './themes/themeDuMoment';
