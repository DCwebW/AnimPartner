import { z } from 'zod';

/** Longueurs maximales : chaque texte doit tenir dans l'étiquette, au recto ou au verso. */
export const QUESTION_MAX = 140;
export const REPONSE_MAX = 30;
export const EXPLICATION_MAX = 140;

/**
 * Une énigme, telle qu'elle vit dans le catalogue du dépôt et, plus tard, dans la base.
 * Les champs de suivi disent qui l'a créée et qui l'a validée, sans comptes.
 */
export const EnigmeSchema = z
  .object({
    /** Identifiant stable, en minuscules et tirets : il ne change jamais. */
    id: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'id en minuscules et tirets'),
    question: z.string().max(QUESTION_MAX).trim().min(1),
    reponse: z.string().max(REPONSE_MAX).trim().min(1),
    /** Une phrase, que l'animateur peut lire aux enfants. */
    explication: z.string().max(EXPLICATION_MAX).trim().min(1),
    ageMin: z.number().int().min(3).max(18),
    ageMax: z.number().int().min(3).max(18),
    /** `draft` : proposée, jamais affichée. `validee` : relue par le porteur. */
    statut: z.enum(['draft', 'validee']),
    source: z.enum(['manuelle', 'generee']),
    creeePar: z.string().trim().min(1),
    valideePar: z.string().trim().min(1).optional(),
  })
  .strict()
  .refine((e) => e.ageMin <= e.ageMax, {
    message: 'ageMin ne peut pas dépasser ageMax',
    path: ['ageMax'],
  });

export type Enigme = z.infer<typeof EnigmeSchema>;

/** Le catalogue entier : une liste d'énigmes. */
export const CatalogueSchema = z.array(EnigmeSchema);
