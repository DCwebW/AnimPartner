import Svg, { Circle, ClipPath, Defs, G, Path, Pattern, Rect } from 'react-native-svg';

import { useIdSvg } from '@/svg/useIdSvg';

import { HAUTEUR_BANDEAU, LARGEUR_BANDEAU } from './dimensions';

// Scène « beau temps » : ciel venteux, soleil, deux nuages, rafales et prairie.
// Reprise de la planche VentBeauTemps (design/canvas/), dans l'état fixe qu'elle prend
// quand les animations sont coupées : rafales à leur point de départ, herbe droite,
// nuages à leur place. L'animation viendra dans une tâche à part.

const PRAIRIE = 'M0 105c34-4 64 2 100-1 36-3 66 3 104 1 38-2 74 3 112 0 30-2 56 2 74 1v94H0z';
const NUAGE =
  'M40 78c-10 0-12-10-2-12 0-10 12-15 20-8 8-10 25-8 27 4 10-2 15 8 8 14-5 4-43 4-53 2z';
const PETIT_NUAGE =
  'M173 46c-8 0-9-8-2-9 0-8 10-12 16-6 6-8 20-5 22 4 8 0 10 8 4 11-5 2-34 2-40 0z';
const TRAIT = '#4A3F36';

// Rafales : un tiret de 90 sur 700, à sa position de départ.
const RAFALE = {
  strokeDasharray: '90 610',
  strokeDashoffset: 700,
  strokeLinecap: 'round',
} as const;

type Props = {
  /** Largeur affichée ; la hauteur suit en gardant les proportions de la planche. */
  largeur: number;
};

export function BandeauVent({ largeur }: Props) {
  const p = useIdSvg('vent');

  return (
    <Svg
      width={largeur}
      height={(largeur * HAUTEUR_BANDEAU) / LARGEUR_BANDEAU}
      viewBox={`0 0 ${LARGEUR_BANDEAU} ${HAUTEUR_BANDEAU}`}
      fill="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      testID="bandeau-vent"
    >
      <Defs>
        <Pattern id={`${p}-ciel-h`} width={10} height={3.6} patternUnits="userSpaceOnUse">
          <Path d="M-1 1.8h12" stroke="#1F86B5" strokeWidth={1.7} strokeLinecap="round" />
        </Pattern>
        <Pattern id={`${p}-ciel-v`} width={3.6} height={10} patternUnits="userSpaceOnUse">
          <Path d="M1.8-1v12" stroke="#0E6E99" strokeWidth={1.5} strokeLinecap="round" />
        </Pattern>
        <Pattern
          id={`${p}-ciel-d1`}
          width={10}
          height={3.8}
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(38)"
        >
          <Path d="M-1 1.9h12" stroke="#36A6CC" strokeWidth={1.6} strokeLinecap="round" />
        </Pattern>
        <Pattern
          id={`${p}-ciel-d2`}
          width={10}
          height={4}
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-42)"
        >
          <Path d="M-1 2h12" stroke="#2E97C4" strokeWidth={1.5} strokeLinecap="round" />
        </Pattern>
        <Pattern id={`${p}-herbe-h`} width={10} height={3.6} patternUnits="userSpaceOnUse">
          <Path d="M-1 1.8h12" stroke="#74B32E" strokeWidth={1.7} strokeLinecap="round" />
        </Pattern>
        <Pattern id={`${p}-herbe-v`} width={3.6} height={10} patternUnits="userSpaceOnUse">
          <Path d="M1.8-1v12" stroke="#27702F" strokeWidth={1.5} strokeLinecap="round" />
        </Pattern>
        <Pattern
          id={`${p}-herbe-d1`}
          width={10}
          height={3.8}
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-40)"
        >
          <Path d="M-1 1.9h12" stroke="#4C9A35" strokeWidth={1.6} strokeLinecap="round" />
        </Pattern>
        <Pattern
          id={`${p}-herbe-d2`}
          width={10}
          height={4}
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(36)"
        >
          <Path d="M-1 2h12" stroke="#8CC63F" strokeWidth={1.5} strokeLinecap="round" />
        </Pattern>
        <Pattern id={`${p}-soleil-h`} width={7} height={3.2} patternUnits="userSpaceOnUse">
          <Path d="M-1 1.6h9" stroke="#EFA81A" strokeWidth={1.4} strokeLinecap="round" />
        </Pattern>
        <Pattern
          id={`${p}-soleil-d`}
          width={7}
          height={3.2}
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(34)"
        >
          <Path d="M-1 1.6h9" stroke="#E08A0B" strokeWidth={1.5} strokeLinecap="round" />
        </Pattern>
        <ClipPath id={`${p}-zone-herbe`}>
          <Path d={PRAIRIE} />
        </ClipPath>
        <ClipPath id={`${p}-zone-soleil`}>
          <Circle cx={324} cy={40} r={22} />
        </ClipPath>
        <ClipPath id={`${p}-zone-nuage`}>
          <Path d={NUAGE} />
        </ClipPath>
      </Defs>

      {/* Ciel */}
      <Rect width={390} height={200} fill="#CFE9F4" />
      <Rect width={390} height={200} fill={`url(#${p}-ciel-h)`} opacity={0.5} />
      <Rect width={390} height={200} fill={`url(#${p}-ciel-d1)`} opacity={0.4} />
      <Rect width={390} height={100} fill={`url(#${p}-ciel-v)`} opacity={0.45} />
      <Rect width={390} height={60} fill={`url(#${p}-ciel-d2)`} opacity={0.42} />
      <Rect width={390} height={30} fill={`url(#${p}-ciel-h)`} opacity={0.45} />

      {/* Soleil */}
      <Circle cx={324} cy={40} r={22} fill="#FBD23E" />
      <G clipPath={`url(#${p}-zone-soleil)`}>
        <Rect x={300} y={16} width={48} height={48} fill={`url(#${p}-soleil-h)`} opacity={0.55} />
        <Rect x={300} y={16} width={48} height={48} fill={`url(#${p}-soleil-d)`} opacity={0.45} />
      </G>
      <Path
        d="M324 18c12 0 22 10 22 22s-10 22-22 22-22-10-22-22 10-22 22-22z"
        stroke={TRAIT}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <Path
        d="M325 17c12.5 1 21.5 11 21 23s-11 21-23 20.5-21-11-20.5-23S313 16 325 17z"
        stroke={TRAIT}
        strokeWidth={1.1}
        strokeLinecap="round"
        strokeOpacity={0.45}
      />
      <Path
        d="M352 40h10M344 60l7 7M324 68v10M304 60l-7 7M296 40h-10M304 20l-7-7M324 12V2M344 20l7-7"
        stroke="#D98C0E"
        strokeWidth={2.3}
        strokeLinecap="round"
      />
      <Path
        d="M353 38h10M346 62l7 7M322 68v10M302 62l-7 7M295 38h-10M302 18l-7-7M322 12V2M346 18l7-7"
        stroke="#D98C0E"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeOpacity={0.5}
      />

      {/* Nuages */}
      <G>
        <Path d={NUAGE} fill="#FCFEFE" fillOpacity={0.95} />
        <G clipPath={`url(#${p}-zone-nuage)`}>
          <Rect x={26} y={70} width={80} height={11} fill={`url(#${p}-ciel-h)`} opacity={0.3} />
        </G>
        <Path
          d={NUAGE}
          stroke={TRAIT}
          strokeWidth={1.7}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M41.5 79.5c-11-.5-13-11-3-13.5.5-10 13-14.5 21-7.5 8-10 25-7 27 5"
          stroke={TRAIT}
          strokeWidth={1}
          strokeLinecap="round"
          strokeOpacity={0.45}
        />
      </G>
      <G>
        <Path d={PETIT_NUAGE} fill="#FCFEFE" fillOpacity={0.95} />
        <Path
          d={PETIT_NUAGE}
          stroke={TRAIT}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>

      {/* Rafales */}
      <Path
        d="M-50 58C20 44 80 42 124 50c22 4 30 18 18 24-12 6-20-4-10-14 12-12 58-16 118-10 60 6 110-4 190-12"
        stroke="#FFFFFF"
        strokeWidth={2.4}
        strokeOpacity={0.8}
        {...RAFALE}
      />
      <Path
        d="M-50 86C30 76 110 74 170 80c24 2 48-4 62-10 10-4 18 4 10 10-8 6-16-2-6-12 12-12 60-6 184-12"
        stroke="#FFFFFF"
        strokeWidth={2}
        strokeOpacity={0.66}
        {...RAFALE}
      />
      <Path
        d="M-50 98C40 90 120 94 200 90c34-2 56 6 70 10 9 3 16-5 8-10-8-5-15 3-5 11 10 8 60 2 217-6"
        stroke="#FFFFFF"
        strokeWidth={1.7}
        strokeOpacity={0.55}
        {...RAFALE}
      />

      {/* Prairie */}
      <Path d={PRAIRIE} fill="#DCEFBC" />
      <G clipPath={`url(#${p}-zone-herbe)`}>
        <Rect y={98} width={390} height={102} fill={`url(#${p}-herbe-h)`} opacity={0.52} />
        <Rect y={98} width={390} height={102} fill={`url(#${p}-herbe-d1)`} opacity={0.44} />
        <Rect y={124} width={390} height={76} fill={`url(#${p}-herbe-v)`} opacity={0.46} />
        <Rect y={150} width={390} height={50} fill={`url(#${p}-herbe-d2)`} opacity={0.4} />
        <Rect y={176} width={390} height={24} fill={`url(#${p}-herbe-h)`} opacity={0.4} />
      </G>
      <Path
        d="M0 105c34-4 64 2 100-1 36-3 66 3 104 1 38-2 74 3 112 0 30-2 56 2 74 1"
        stroke={TRAIT}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path
        d="M0 107c36-4 60 2 102-1 36-3 62 3 104 1 38-2 70 3 110 0 30-2 54 2 74 1"
        stroke={TRAIT}
        strokeWidth={1.1}
        strokeLinecap="round"
        strokeOpacity={0.4}
      />
      <Path
        d="M10 105l-2-8M18 105l2-9M27 104l4-7M52 104l-2-9M62 104l2-9M88 103l-2-7M98 103l2-9M124 104l-2-8M134 104l3-7M160 105l-2-9M170 105l3-7M196 105l-2-8M206 105l2-9M232 104l-2-8M242 104l3-7M268 105l-2-9M278 105l3-7M304 104l-2-8M314 104l2-9M340 104l-2-8M350 104l3-7M376 103l-2-9"
        stroke="#27702F"
        strokeWidth={1.7}
        strokeLinecap="round"
      />
    </Svg>
  );
}
