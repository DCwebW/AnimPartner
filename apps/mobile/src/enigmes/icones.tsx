import Svg, { Circle, Path, Rect } from 'react-native-svg';

// Pictogrammes des boutons, repris des maquettes du MVP. Décoratifs : le libellé du
// bouton porte le sens.

type Props = { taille: number; couleur: string };

/** Deux flèches en cercle : retourner l'étiquette. */
export function IconeRetourner({ taille, couleur }: Props) {
  return (
    <Svg
      width={taille}
      height={taille}
      viewBox="0 0 24 24"
      fill="none"
      stroke={couleur}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Path d="M4.5 11.5a7.5 7.5 0 0 1 13-4.6l2 2" />
      <Path d="M19.5 4.5v4.4h-4.4" />
      <Path d="M19.5 12.5a7.5 7.5 0 0 1-13 4.6l-2-2" />
      <Path d="M4.5 19.5v-4.4h4.4" />
    </Svg>
  );
}

/** Un dé : tirer une autre énigme. */
export function IconeDe({ taille, couleur }: Props) {
  return (
    <Svg
      width={taille}
      height={taille}
      viewBox="0 0 24 24"
      fill="none"
      stroke={couleur}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Rect x={4} y={4} width={16} height={16} rx={4.5} />
      <Circle cx={9} cy={9} r={1.3} fill={couleur} stroke="none" />
      <Circle cx={15} cy={9} r={1.3} fill={couleur} stroke="none" />
      <Circle cx={9} cy={15} r={1.3} fill={couleur} stroke="none" />
      <Circle cx={15} cy={15} r={1.3} fill={couleur} stroke="none" />
    </Svg>
  );
}
