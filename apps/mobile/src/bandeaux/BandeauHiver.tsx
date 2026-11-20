import Svg, { Circle, ClipPath, Defs, G, Path, Pattern, Rect } from 'react-native-svg';

import { useIdSvg } from '@/svg/useIdSvg';

import { HAUTEUR_BANDEAU, LARGEUR_BANDEAU } from './dimensions';

// Scène « hiver » : village sous la neige, chalet, sapins givrés et flocons.
// Reprise de la planche HiverNeige (design/canvas/), dans l'état fixe qu'elle prend quand les
// animations sont coupées : flocons à leur position de départ, sans chute ni dérive.
// L'animation viendra dans une tâche à part.

type Props = {
  /** Largeur affichée ; la hauteur suit en gardant les proportions de la planche. */
  largeur: number;
};

export function BandeauHiver({ largeur }: Props) {
  const p = useIdSvg('hiver');

  return (
    <Svg
      width={largeur}
      height={(largeur * HAUTEUR_BANDEAU) / LARGEUR_BANDEAU}
      viewBox={`0 0 ${LARGEUR_BANDEAU} ${HAUTEUR_BANDEAU}`}
      fill="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      testID="bandeau-hiver"
    >
      <Defs>
        <Pattern id={`${p}-ciel-h`} width={10} height={3.6} patternUnits="userSpaceOnUse">
          <Path d="M-1 1.8h12" stroke="#9DB3C4" strokeWidth={1.7} strokeLinecap="round" />
        </Pattern>
        <Pattern id={`${p}-ciel-v`} width={3.6} height={10} patternUnits="userSpaceOnUse">
          <Path d="M1.8-1v12" stroke="#8299AB" strokeWidth={1.5} strokeLinecap="round" />
        </Pattern>
        <Pattern
          id={`${p}-ciel-d1`}
          width={10}
          height={3.8}
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(38)"
        >
          <Path d="M-1 1.9h12" stroke="#AFC3D1" strokeWidth={1.6} strokeLinecap="round" />
        </Pattern>
        <Pattern
          id={`${p}-ciel-d2`}
          width={10}
          height={4}
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-42)"
        >
          <Path d="M-1 2h12" stroke="#A2B7C7" strokeWidth={1.5} strokeLinecap="round" />
        </Pattern>
        <Pattern id={`${p}-neige-h`} width={11} height={4.2} patternUnits="userSpaceOnUse">
          <Path d="M-1 2.1h13" stroke="#B8C9D6" strokeWidth={1.4} strokeLinecap="round" />
        </Pattern>
        <Pattern
          id={`${p}-neige-d`}
          width={11}
          height={4.4}
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-36)"
        >
          <Path d="M-1 2.2h13" stroke="#C6D4DF" strokeWidth={1.3} strokeLinecap="round" />
        </Pattern>
        <Pattern
          id={`${p}-bois`}
          width={7}
          height={3.2}
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(8)"
        >
          <Path d="M-1 1.6h9" stroke="#8E5330" strokeWidth={1.2} strokeLinecap="round" />
        </Pattern>
        <ClipPath id={`${p}-zone-sol`}>
          <Path d="M0 122c34-4 64 2 100-1 36-3 66 3 104 1 38-2 74 3 112 0 30-2 56 2 74 1v78H0z" />
        </ClipPath>
        <ClipPath id={`${p}-zone-murs`}>
          <Path d="M238 116h52v28h-52z" />
        </ClipPath>
      </Defs>
      <Rect width={390} height={200} fill="#D3DEE7" />
      <Rect width={390} height={200} fill={`url(#${p}-ciel-h)`} opacity={0.45} />
      <Rect width={390} height={200} fill={`url(#${p}-ciel-d1)`} opacity={0.35} />
      <Rect width={390} height={100} fill={`url(#${p}-ciel-v)`} opacity={0.35} />
      <Rect width={390} height={56} fill={`url(#${p}-ciel-d2)`} opacity={0.35} />
      <Circle cx={64} cy={38} r={15} fill="#F6EFD9" fillOpacity={0.9} />
      <Path
        d="M64 23c8.5 0 15 6.5 15 15s-6.5 15-15 15-15-6.5-15-15 6.5-15 15-15z"
        stroke="#4A3F36"
        strokeWidth={1.3}
        strokeLinecap="round"
        strokeOpacity={0.4}
      />
      <Path d="M0 100c40-14 90-18 140-8 40 8 70-10 120-12 50-2 90 10 130 4v40H0z" fill="#E6EEF4" />
      <Path
        d="M0 100c40-14 90-18 140-8 40 8 70-10 120-12 50-2 90 10 130 4"
        stroke="#4A3F36"
        strokeWidth={1.3}
        strokeLinecap="round"
        strokeOpacity={0.4}
      />
      <G opacity={0.55}>
        <G transform="translate(22 100) scale(0.4)">
          <Path d="M0 -54L-11 -36H11ZM0 -44L-15 -22H15ZM0 -32L-19 -6H19Z" fill="#4F7A6B" />
          <Path
            d="M-11 -36Q-7 -40 -3.5 -37.5Q0 -40.5 3.5 -37.5Q7 -40 11 -36ZM-15 -22Q-10 -26.5 -5 -23.5Q0 -27 5 -23.5Q10 -26.5 15 -22ZM-19 -6Q-13 -11 -6.5 -7.5Q0 -11.5 6.5 -7.5Q13 -11 19 -6ZM0 -54L-4 -48Q-2 -49.5 0 -48Q2 -49.5 4 -48Z"
            fill="#FFFFFF"
          />
          <Path d="M-2.5 -6h5v6h-5z" fill="#6B3B20" />
        </G>
        <G transform="translate(122 95) scale(0.42)">
          <Path d="M0 -54L-11 -36H11ZM0 -44L-15 -22H15ZM0 -32L-19 -6H19Z" fill="#4F7A6B" />
          <Path
            d="M-11 -36Q-7 -40 -3.5 -37.5Q0 -40.5 3.5 -37.5Q7 -40 11 -36ZM-15 -22Q-10 -26.5 -5 -23.5Q0 -27 5 -23.5Q10 -26.5 15 -22ZM-19 -6Q-13 -11 -6.5 -7.5Q0 -11.5 6.5 -7.5Q13 -11 19 -6ZM0 -54L-4 -48Q-2 -49.5 0 -48Q2 -49.5 4 -48Z"
            fill="#FFFFFF"
          />
          <Path d="M-2.5 -6h5v6h-5z" fill="#6B3B20" />
        </G>
        <G transform="translate(146 96) scale(0.36)">
          <Path d="M0 -54L-11 -36H11ZM0 -44L-15 -22H15ZM0 -32L-19 -6H19Z" fill="#4F7A6B" />
          <Path
            d="M-11 -36Q-7 -40 -3.5 -37.5Q0 -40.5 3.5 -37.5Q7 -40 11 -36ZM-15 -22Q-10 -26.5 -5 -23.5Q0 -27 5 -23.5Q10 -26.5 15 -22ZM-19 -6Q-13 -11 -6.5 -7.5Q0 -11.5 6.5 -7.5Q13 -11 19 -6ZM0 -54L-4 -48Q-2 -49.5 0 -48Q2 -49.5 4 -48Z"
            fill="#FFFFFF"
          />
          <Path d="M-2.5 -6h5v6h-5z" fill="#6B3B20" />
        </G>
        <G transform="translate(172 97) scale(0.44)">
          <Path d="M0 -54L-11 -36H11ZM0 -44L-15 -22H15ZM0 -32L-19 -6H19Z" fill="#4F7A6B" />
          <Path
            d="M-11 -36Q-7 -40 -3.5 -37.5Q0 -40.5 3.5 -37.5Q7 -40 11 -36ZM-15 -22Q-10 -26.5 -5 -23.5Q0 -27 5 -23.5Q10 -26.5 15 -22ZM-19 -6Q-13 -11 -6.5 -7.5Q0 -11.5 6.5 -7.5Q13 -11 19 -6ZM0 -54L-4 -48Q-2 -49.5 0 -48Q2 -49.5 4 -48Z"
            fill="#FFFFFF"
          />
          <Path d="M-2.5 -6h5v6h-5z" fill="#6B3B20" />
        </G>
        <G transform="translate(352 90) scale(0.4)">
          <Path d="M0 -54L-11 -36H11ZM0 -44L-15 -22H15ZM0 -32L-19 -6H19Z" fill="#4F7A6B" />
          <Path
            d="M-11 -36Q-7 -40 -3.5 -37.5Q0 -40.5 3.5 -37.5Q7 -40 11 -36ZM-15 -22Q-10 -26.5 -5 -23.5Q0 -27 5 -23.5Q10 -26.5 15 -22ZM-19 -6Q-13 -11 -6.5 -7.5Q0 -11.5 6.5 -7.5Q13 -11 19 -6ZM0 -54L-4 -48Q-2 -49.5 0 -48Q2 -49.5 4 -48Z"
            fill="#FFFFFF"
          />
          <Path d="M-2.5 -6h5v6h-5z" fill="#6B3B20" />
        </G>
      </G>
      <Path
        d="M0 122c34-4 64 2 100-1 36-3 66 3 104 1 38-2 74 3 112 0 30-2 56 2 74 1v78H0z"
        fill="#F8FBFD"
      />
      <G clipPath={`url(#${p}-zone-sol)`}>
        <Rect y={118} width={390} height={82} fill={`url(#${p}-neige-h)`} opacity={0.35} />
        <Rect y={150} width={390} height={50} fill={`url(#${p}-neige-d)`} opacity={0.4} />
        <Rect y={178} width={390} height={22} fill={`url(#${p}-neige-h)`} opacity={0.35} />
      </G>
      <Path
        d="M0 122c34-4 64 2 100-1 36-3 66 3 104 1 38-2 74 3 112 0 30-2 56 2 74 1"
        stroke="#4A3F36"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeOpacity={0.5}
      />
      <Path
        d="M0 124c36-4 60 2 102-1 36-3 62 3 104 1 38-2 70 3 110 0 30-2 54 2 74 1"
        stroke="#4A3F36"
        strokeWidth={1}
        strokeLinecap="round"
        strokeOpacity={0.22}
      />
      <G transform="translate(212 132) scale(0.62)">
        <Path d="M0 -54L-11 -36H11ZM0 -44L-15 -22H15ZM0 -32L-19 -6H19Z" fill="#3A6A55" />
        <Path
          d="M0 -54L-11 -36H11ZM0 -44L-15 -22H15ZM0 -32L-19 -6H19Z"
          stroke="#4A3F36"
          strokeWidth={1.935}
          strokeLinejoin="round"
          strokeOpacity={0.55}
        />
        <Path
          d="M-11 -36Q-7 -40 -3.5 -37.5Q0 -40.5 3.5 -37.5Q7 -40 11 -36ZM-15 -22Q-10 -26.5 -5 -23.5Q0 -27 5 -23.5Q10 -26.5 15 -22ZM-19 -6Q-13 -11 -6.5 -7.5Q0 -11.5 6.5 -7.5Q13 -11 19 -6ZM0 -54L-4 -48Q-2 -49.5 0 -48Q2 -49.5 4 -48Z"
          fill="#FFFFFF"
        />
        <Path d="M-2.5 -6h5v6h-5z" fill="#6B3B20" />
      </G>
      <G transform="translate(318 134) scale(0.7)">
        <Path d="M0 -54L-11 -36H11ZM0 -44L-15 -22H15ZM0 -32L-19 -6H19Z" fill="#3A6A55" />
        <Path
          d="M0 -54L-11 -36H11ZM0 -44L-15 -22H15ZM0 -32L-19 -6H19Z"
          stroke="#4A3F36"
          strokeWidth={1.714}
          strokeLinejoin="round"
          strokeOpacity={0.55}
        />
        <Path
          d="M-11 -36Q-7 -40 -3.5 -37.5Q0 -40.5 3.5 -37.5Q7 -40 11 -36ZM-15 -22Q-10 -26.5 -5 -23.5Q0 -27 5 -23.5Q10 -26.5 15 -22ZM-19 -6Q-13 -11 -6.5 -7.5Q0 -11.5 6.5 -7.5Q13 -11 19 -6ZM0 -54L-4 -48Q-2 -49.5 0 -48Q2 -49.5 4 -48Z"
          fill="#FFFFFF"
        />
        <Path d="M-2.5 -6h5v6h-5z" fill="#6B3B20" />
      </G>
      <Path d="M278 92h8v16h-8z" fill="#8A4F2D" />
      <Path d="M278 92h8v16h-8z" stroke="#4A3F36" strokeWidth={1.3} strokeLinejoin="round" />
      <Path
        d="M276.5 92.5Q282 87.5 287.5 92.5Z"
        fill="#FFFFFF"
        stroke="#4A3F36"
        strokeWidth={1}
        strokeOpacity={0.5}
        strokeLinejoin="round"
      />
      <Path d="M238 116h52v28h-52z" fill="#A8683D" />
      <G clipPath={`url(#${p}-zone-murs)`}>
        <Rect x={238} y={116} width={52} height={28} fill={`url(#${p}-bois)`} opacity={0.45} />
      </G>
      <Path
        d="M238 122h52M238 128h52M238 134h52M238 140h52"
        stroke="#7A4524"
        strokeWidth={1}
        strokeLinecap="round"
        strokeOpacity={0.75}
      />
      <Path d="M238 116h52v28h-52z" stroke="#4A3F36" strokeWidth={1.5} strokeLinejoin="round" />
      <Path d="M243 125h10v9h-10z" fill="#F6C75A" />
      <Path d="M277 125h10v9h-10z" fill="#F6C75A" />
      <Path d="M248 125v9M243 129.5h10M282 125v9M277 129.5h10" stroke="#6B3B20" strokeWidth={1} />
      <Path
        d="M243 125h10v9h-10zM277 125h10v9h-10z"
        stroke="#4A3F36"
        strokeWidth={1.3}
        strokeLinejoin="round"
      />
      <Path
        d="M242 134.5h12M276 134.5h12"
        stroke="#FFFFFF"
        strokeWidth={2.2}
        strokeLinecap="round"
      />
      <Path d="M259 128h11v16h-11z" fill="#5C3219" />
      <Path d="M259 128h11v16h-11z" stroke="#4A3F36" strokeWidth={1.3} strokeLinejoin="round" />
      <Circle cx={267.2} cy={136.5} r={0.9} fill="#E0B45A" />
      <Path d="M226 118L302 118L300 123L228 123Z" fill="#6B3B20" />
      <Path
        d="M226 118L302 118L300 123L228 123Z"
        stroke="#4A3F36"
        strokeWidth={1.2}
        strokeLinejoin="round"
      />
      <Path
        d="M224 118L264 86L304 118Q299 123.5 293 120Q288 125 282 121Q276 126 270 121Q264 125.5 258 121Q252 126 246 121Q240 125 235 120.5Q229 123.5 224 118Z"
        fill="#FFFFFF"
      />
      <Path
        d="M224 118L264 86L304 118Q299 123.5 293 120Q288 125 282 121Q276 126 270 121Q264 125.5 258 121Q252 126 246 121Q240 125 235 120.5Q229 123.5 224 118Z"
        stroke="#4A3F36"
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <Path
        d="M226 116.5L264 87.5L302 116.5"
        stroke="#4A3F36"
        strokeWidth={1}
        strokeLinecap="round"
        strokeOpacity={0.35}
      />
      <Path
        d="M244 110q8-4 14-2M270 100q8 1 12 6"
        stroke="#B8C9D6"
        strokeWidth={1.3}
        strokeLinecap="round"
      />
      <Path d="M230 146c6-5 16-5 26-3 10 2 22-3 32-1 6 1 12 2 16 4z" fill="#F8FBFD" />
      <Path
        d="M230 146c6-5 16-5 26-3 10 2 22-3 32-1 6 1 12 2 16 4"
        stroke="#4A3F36"
        strokeWidth={1.1}
        strokeLinecap="round"
        strokeOpacity={0.4}
      />
      <G transform="translate(34 170) scale(1.15)">
        <Path d="M0 -54L-11 -36H11ZM0 -44L-15 -22H15ZM0 -32L-19 -6H19Z" fill="#2F5D46" />
        <Path
          d="M0 -54L-11 -36H11ZM0 -44L-15 -22H15ZM0 -32L-19 -6H19Z"
          stroke="#4A3F36"
          strokeWidth={1.304}
          strokeLinejoin="round"
          strokeOpacity={0.75}
        />
        <Path
          d="M-11 -36Q-7 -40 -3.5 -37.5Q0 -40.5 3.5 -37.5Q7 -40 11 -36ZM-15 -22Q-10 -26.5 -5 -23.5Q0 -27 5 -23.5Q10 -26.5 15 -22ZM-19 -6Q-13 -11 -6.5 -7.5Q0 -11.5 6.5 -7.5Q13 -11 19 -6ZM0 -54L-4 -48Q-2 -49.5 0 -48Q2 -49.5 4 -48Z"
          fill="#FFFFFF"
        />
        <Path
          d="M-11 -36Q-7 -40 -3.5 -37.5Q0 -40.5 3.5 -37.5Q7 -40 11 -36M-15 -22Q-10 -26.5 -5 -23.5Q0 -27 5 -23.5Q10 -26.5 15 -22M-19 -6Q-13 -11 -6.5 -7.5Q0 -11.5 6.5 -7.5Q13 -11 19 -6"
          stroke="#4A3F36"
          strokeWidth={0.783}
          strokeLinecap="round"
          strokeOpacity={0.4}
        />
        <Path d="M-2.5 -6h5v6h-5z" fill="#6B3B20" />
      </G>
      <G transform="translate(80 160) scale(0.9)">
        <Path d="M0 -54L-11 -36H11ZM0 -44L-15 -22H15ZM0 -32L-19 -6H19Z" fill="#2F5D46" />
        <Path
          d="M0 -54L-11 -36H11ZM0 -44L-15 -22H15ZM0 -32L-19 -6H19Z"
          stroke="#4A3F36"
          strokeWidth={1.667}
          strokeLinejoin="round"
          strokeOpacity={0.75}
        />
        <Path
          d="M-11 -36Q-7 -40 -3.5 -37.5Q0 -40.5 3.5 -37.5Q7 -40 11 -36ZM-15 -22Q-10 -26.5 -5 -23.5Q0 -27 5 -23.5Q10 -26.5 15 -22ZM-19 -6Q-13 -11 -6.5 -7.5Q0 -11.5 6.5 -7.5Q13 -11 19 -6ZM0 -54L-4 -48Q-2 -49.5 0 -48Q2 -49.5 4 -48Z"
          fill="#FFFFFF"
        />
        <Path
          d="M-11 -36Q-7 -40 -3.5 -37.5Q0 -40.5 3.5 -37.5Q7 -40 11 -36M-15 -22Q-10 -26.5 -5 -23.5Q0 -27 5 -23.5Q10 -26.5 15 -22M-19 -6Q-13 -11 -6.5 -7.5Q0 -11.5 6.5 -7.5Q13 -11 19 -6"
          stroke="#4A3F36"
          strokeWidth={1}
          strokeLinecap="round"
          strokeOpacity={0.4}
        />
        <Path d="M-2.5 -6h5v6h-5z" fill="#6B3B20" />
      </G>
      <G transform="translate(342 172) scale(1.2)">
        <Path d="M0 -54L-11 -36H11ZM0 -44L-15 -22H15ZM0 -32L-19 -6H19Z" fill="#2F5D46" />
        <Path
          d="M0 -54L-11 -36H11ZM0 -44L-15 -22H15ZM0 -32L-19 -6H19Z"
          stroke="#4A3F36"
          strokeWidth={1.25}
          strokeLinejoin="round"
          strokeOpacity={0.75}
        />
        <Path
          d="M-11 -36Q-7 -40 -3.5 -37.5Q0 -40.5 3.5 -37.5Q7 -40 11 -36ZM-15 -22Q-10 -26.5 -5 -23.5Q0 -27 5 -23.5Q10 -26.5 15 -22ZM-19 -6Q-13 -11 -6.5 -7.5Q0 -11.5 6.5 -7.5Q13 -11 19 -6ZM0 -54L-4 -48Q-2 -49.5 0 -48Q2 -49.5 4 -48Z"
          fill="#FFFFFF"
        />
        <Path
          d="M-11 -36Q-7 -40 -3.5 -37.5Q0 -40.5 3.5 -37.5Q7 -40 11 -36M-15 -22Q-10 -26.5 -5 -23.5Q0 -27 5 -23.5Q10 -26.5 15 -22M-19 -6Q-13 -11 -6.5 -7.5Q0 -11.5 6.5 -7.5Q13 -11 19 -6"
          stroke="#4A3F36"
          strokeWidth={0.75}
          strokeLinecap="round"
          strokeOpacity={0.4}
        />
        <Path d="M-2.5 -6h5v6h-5z" fill="#6B3B20" />
      </G>
      <G transform="translate(374 158) scale(0.8)">
        <Path d="M0 -54L-11 -36H11ZM0 -44L-15 -22H15ZM0 -32L-19 -6H19Z" fill="#2F5D46" />
        <Path
          d="M0 -54L-11 -36H11ZM0 -44L-15 -22H15ZM0 -32L-19 -6H19Z"
          stroke="#4A3F36"
          strokeWidth={1.875}
          strokeLinejoin="round"
          strokeOpacity={0.75}
        />
        <Path
          d="M-11 -36Q-7 -40 -3.5 -37.5Q0 -40.5 3.5 -37.5Q7 -40 11 -36ZM-15 -22Q-10 -26.5 -5 -23.5Q0 -27 5 -23.5Q10 -26.5 15 -22ZM-19 -6Q-13 -11 -6.5 -7.5Q0 -11.5 6.5 -7.5Q13 -11 19 -6ZM0 -54L-4 -48Q-2 -49.5 0 -48Q2 -49.5 4 -48Z"
          fill="#FFFFFF"
        />
        <Path
          d="M-11 -36Q-7 -40 -3.5 -37.5Q0 -40.5 3.5 -37.5Q7 -40 11 -36M-15 -22Q-10 -26.5 -5 -23.5Q0 -27 5 -23.5Q10 -26.5 15 -22M-19 -6Q-13 -11 -6.5 -7.5Q0 -11.5 6.5 -7.5Q13 -11 19 -6"
          stroke="#4A3F36"
          strokeWidth={1.125}
          strokeLinecap="round"
          strokeOpacity={0.4}
        />
        <Path d="M-2.5 -6h5v6h-5z" fill="#6B3B20" />
      </G>
      <G>
        <G>
          <G fill="#FFFFFF" fillOpacity={0.75}>
            <Circle cx={12} cy={18} r={1.1} />
            <Circle cx={48} cy={64} r={1} />
            <Circle cx={83} cy={140} r={1.2} />
            <Circle cx={110} cy={30} r={1} />
            <Circle cx={141} cy={96} r={1.1} />
            <Circle cx={176} cy={170} r={1} />
            <Circle cx={205} cy={52} r={1.2} />
            <Circle cx={232} cy={122} r={1} />
            <Circle cx={262} cy={12} r={1.1} />
            <Circle cx={290} cy={84} r={1} />
            <Circle cx={318} cy={154} r={1.2} />
            <Circle cx={347} cy={40} r={1} />
            <Circle cx={372} cy={110} r={1.1} />
            <Circle cx={28} cy={182} r={1} />
            <Circle cx={156} cy={8} r={1.2} />
            <Circle cx={242} cy={190} r={1} />
          </G>
        </G>
      </G>
      <G>
        <G>
          <G fill="#FFFFFF" stroke="#9FB3C2" strokeWidth={0.5} strokeOpacity={0.6}>
            <Circle cx={22} cy={48} r={1.8} />
            <Circle cx={66} cy={118} r={1.6} />
            <Circle cx={98} cy={190} r={2} />
            <Circle cx={130} cy={70} r={1.7} />
            <Circle cx={168} cy={138} r={1.9} />
            <Circle cx={198} cy={22} r={1.6} />
            <Circle cx={226} cy={92} r={2} />
            <Circle cx={258} cy={164} r={1.7} />
            <Circle cx={296} cy={46} r={1.8} />
            <Circle cx={330} cy={124} r={1.6} />
            <Circle cx={362} cy={184} r={1.9} />
            <Circle cx={380} cy={62} r={1.7} />
          </G>
        </G>
      </G>
      <G>
        <G>
          <G fill="#FFFFFF" stroke="#8FA6B8" strokeWidth={0.7} strokeOpacity={0.7}>
            <Circle cx={40} cy={96} r={2.7} />
            <Circle cx={92} cy={22} r={2.4} />
            <Circle cx={150} cy={160} r={3} />
            <Circle cx={214} cy={64} r={2.5} />
            <Circle cx={270} cy={130} r={2.8} />
            <Circle cx={320} cy={14} r={2.4} />
            <Circle cx={358} cy={92} r={2.9} />
            <Circle cx={8} cy={150} r={2.5} />
          </G>
        </G>
      </G>
    </Svg>
  );
}
