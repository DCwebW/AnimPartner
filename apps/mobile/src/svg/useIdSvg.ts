import { useId } from 'react';

/**
 * Préfixe unique pour les `id` d'un dessin SVG (motifs, découpes). Sur le web, ces `id`
 * sont globaux à la page : deux dessins montés en même temps ne doivent pas les partager.
 */
export function useIdSvg(nom: string): string {
  return `${nom}-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
}
