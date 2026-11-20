import Svg, { Circle, ClipPath, Defs, G, Path, Pattern, Rect } from 'react-native-svg';

import { useIdSvg } from '@/svg/useIdSvg';

import { HAUTEUR_BANDEAU, LARGEUR_BANDEAU } from './dimensions';

// Scène « automne » : lac, passerelle, arbres roux et feuilles.
// Reprise de la planche AutomneLac (design/canvas/), dans l'état fixe qu'elle prend quand les
// animations sont coupées : feuilles à leur point de départ, nuages à leur place.
// L'animation viendra dans une tâche à part.

type Props = {
  /** Largeur affichée ; la hauteur suit en gardant les proportions de la planche. */
  largeur: number;
};

export function BandeauAutomne({ largeur }: Props) {
  const p = useIdSvg('automne');

  return (
    <Svg
      width={largeur}
      height={(largeur * HAUTEUR_BANDEAU) / LARGEUR_BANDEAU}
      viewBox={`0 0 ${LARGEUR_BANDEAU} ${HAUTEUR_BANDEAU}`}
      fill="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      testID="bandeau-automne"
    >
      <Defs>
        <Pattern id={`${p}-ciel-h`} width={10} height={3.6} patternUnits="userSpaceOnUse">
          <Path d="M-1 1.8h12" stroke="#8DB8CA" strokeWidth={1.7} strokeLinecap="round" />
        </Pattern>
        <Pattern id={`${p}-ciel-v`} width={3.6} height={10} patternUnits="userSpaceOnUse">
          <Path d="M1.8-1v12" stroke="#6F9FB5" strokeWidth={1.5} strokeLinecap="round" />
        </Pattern>
        <Pattern
          id={`${p}-ciel-d1`}
          width={10}
          height={3.8}
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(38)"
        >
          <Path d="M-1 1.9h12" stroke="#A7CAD6" strokeWidth={1.6} strokeLinecap="round" />
        </Pattern>
        <Pattern
          id={`${p}-ciel-d2`}
          width={10}
          height={4}
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-42)"
        >
          <Path d="M-1 2h12" stroke="#86B1C4" strokeWidth={1.5} strokeLinecap="round" />
        </Pattern>
        <Pattern id={`${p}-lueur`} width={10} height={3.6} patternUnits="userSpaceOnUse">
          <Path d="M-1 1.8h12" stroke="#EFA95A" strokeWidth={1.7} strokeLinecap="round" />
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
        <Pattern id={`${p}-colline-h`} width={10} height={3.6} patternUnits="userSpaceOnUse">
          <Path d="M-1 1.8h12" stroke="#C17A45" strokeWidth={1.5} strokeLinecap="round" />
        </Pattern>
        <Pattern
          id={`${p}-colline-d`}
          width={10}
          height={3.8}
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(36)"
        >
          <Path d="M-1 1.9h12" stroke="#D39A5E" strokeWidth={1.4} strokeLinecap="round" />
        </Pattern>
        <Pattern id={`${p}-eau-h`} width={10} height={3.4} patternUnits="userSpaceOnUse">
          <Path d="M-1 1.7h12" stroke="#4F8FA8" strokeWidth={1.5} strokeLinecap="round" />
        </Pattern>
        <Pattern id={`${p}-eau-h2`} width={14} height={5} patternUnits="userSpaceOnUse">
          <Path d="M-1 2.5h9" stroke="#7DB8CA" strokeWidth={1.4} strokeLinecap="round" />
        </Pattern>
        <Pattern id={`${p}-sol-h`} width={10} height={3.6} patternUnits="userSpaceOnUse">
          <Path d="M-1 1.8h12" stroke="#B79A45" strokeWidth={1.7} strokeLinecap="round" />
        </Pattern>
        <Pattern id={`${p}-sol-v`} width={3.6} height={10} patternUnits="userSpaceOnUse">
          <Path d="M1.8-1v12" stroke="#9C7330" strokeWidth={1.5} strokeLinecap="round" />
        </Pattern>
        <Pattern
          id={`${p}-sol-d1`}
          width={10}
          height={3.8}
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-40)"
        >
          <Path d="M-1 1.9h12" stroke="#8F9A3E" strokeWidth={1.6} strokeLinecap="round" />
        </Pattern>
        <Pattern
          id={`${p}-sol-d2`}
          width={10}
          height={4}
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(36)"
        >
          <Path d="M-1 2h12" stroke="#CB8B3C" strokeWidth={1.5} strokeLinecap="round" />
        </Pattern>
        <Pattern id={`${p}-houp-h`} width={8} height={3.4} patternUnits="userSpaceOnUse">
          <Path d="M-1 1.7h10" stroke="#7A2A14" strokeWidth={1.4} strokeLinecap="round" />
        </Pattern>
        <Pattern
          id={`${p}-houp-d1`}
          width={8}
          height={3.6}
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(38)"
        >
          <Path d="M-1 1.8h10" stroke="#A33A1C" strokeWidth={1.4} strokeLinecap="round" />
        </Pattern>
        <Pattern
          id={`${p}-houp-d2`}
          width={8}
          height={3.6}
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-42)"
        >
          <Path d="M-1 1.8h10" stroke="#FFD45C" strokeWidth={1.4} strokeLinecap="round" />
        </Pattern>
        <ClipPath id={`${p}-zone-soleil`}>
          <Circle cx={252} cy={38} r={17} />
        </ClipPath>
        <ClipPath id={`${p}-zone-colline`}>
          <Path d="M0 100V86C30 78 64 72 104 80C138 87 168 90 196 82C226 74 262 70 300 78C336 85 362 80 390 76V100Z" />
        </ClipPath>
        <ClipPath id={`${p}-zone-sol`}>
          <Path d="M0 128C40 131 100 127 158 124C164 132 168 146 182 151C206 156 246 156 268 151C284 146 288 132 296 124C330 127 362 130 390 127V200H0Z" />
        </ClipPath>
        <ClipPath id={`${p}-zone-houppier`}>
          <Path d="M-26 10Q-36 4-31-6Q-36-20-22-24Q-18-36-4-33Q6-42 17-32Q31-32 30-18Q40-8 31 4Q33 16 20 17Q12 25 0 20Q-10 26-18 18Q-30 20-26 10Z" />
        </ClipPath>
        <ClipPath id={`${p}-zone-nuage`}>
          <Path d="M40 78c-10 0-12-10-2-12 0-10 12-15 20-8 8-10 25-8 27 4 10-2 15 8 8 14-5 4-43 4-53 2z" />
        </ClipPath>
      </Defs>
      <Rect width={390} height={200} fill="#E6EEEE" />
      <Rect width={390} height={200} fill={`url(#${p}-ciel-h)`} opacity={0.42} />
      <Rect width={390} height={200} fill={`url(#${p}-ciel-d1)`} opacity={0.32} />
      <Rect width={390} height={70} fill={`url(#${p}-ciel-v)`} opacity={0.32} />
      <Rect width={390} height={40} fill={`url(#${p}-ciel-d2)`} opacity={0.32} />
      <Rect y={46} width={390} height={54} fill={`url(#${p}-lueur)`} opacity={0.3} />
      <Rect y={72} width={390} height={28} fill={`url(#${p}-lueur)`} opacity={0.28} />
      <Circle cx={252} cy={38} r={17} fill="#F8C94A" />
      <G clipPath={`url(#${p}-zone-soleil)`}>
        <Rect x={234} y={20} width={36} height={36} fill={`url(#${p}-soleil-h)`} opacity={0.55} />
        <Rect x={234} y={20} width={36} height={36} fill={`url(#${p}-soleil-d)`} opacity={0.4} />
      </G>
      <Path
        d="M252 21c9.4 0 17 7.6 17 17s-7.6 17-17 17-17-7.6-17-17 7.6-17 17-17z"
        stroke="#4A3F36"
        strokeWidth={1.7}
        strokeLinecap="round"
      />
      <Path
        d="M253 20c9.8 0.8 16.6 8.6 16.2 18s-8.4 16.4-18 16-16.4-8.6-16-18S243.4 19.4 253 20z"
        stroke="#4A3F36"
        strokeWidth={1}
        strokeLinecap="round"
        strokeOpacity={0.45}
      />
      <Path
        d="M275 38h6M268.3 54.3l4.2 4.2M252 61v6M235.7 54.3l-4.2 4.2M229 38h-6M235.7 21.7l-4.2-4.2M252 15V9M268.3 21.7l4.2-4.2"
        stroke="#E0961A"
        strokeWidth={2.1}
        strokeLinecap="round"
      />
      <G>
        <Path
          d="M40 78c-10 0-12-10-2-12 0-10 12-15 20-8 8-10 25-8 27 4 10-2 15 8 8 14-5 4-43 4-53 2z"
          fill="#FCFDFB"
          fillOpacity={0.95}
        />
        <G clipPath={`url(#${p}-zone-nuage)`}>
          <Rect x={26} y={70} width={80} height={11} fill={`url(#${p}-lueur)`} opacity={0.3} />
        </G>
        <Path
          d="M40 78c-10 0-12-10-2-12 0-10 12-15 20-8 8-10 25-8 27 4 10-2 15 8 8 14-5 4-43 4-53 2z"
          stroke="#4A3F36"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M41.5 79.5c-11-.5-13-11-3-13.5.5-10 13-14.5 21-7.5 8-10 25-7 27 5"
          stroke="#4A3F36"
          strokeWidth={1}
          strokeLinecap="round"
          strokeOpacity={0.45}
        />
      </G>
      <G>
        <Path
          d="M150 40c-8 0-9-8-2-9 0-8 10-12 16-6 6-8 20-5 22 4 8 0 10 8 4 11-5 2-34 2-40 0z"
          fill="#FCFDFB"
          fillOpacity={0.95}
        />
        <Path
          d="M150 40c-8 0-9-8-2-9 0-8 10-12 16-6 6-8 20-5 22 4 8 0 10 8 4 11-5 2-34 2-40 0z"
          stroke="#4A3F36"
          strokeWidth={1.4}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Path
        d="M0 100V86C30 78 64 72 104 80C138 87 168 90 196 82C226 74 262 70 300 78C336 85 362 80 390 76V100Z"
        fill="#E7C49A"
      />
      <G clipPath={`url(#${p}-zone-colline)`}>
        <Rect y={70} width={390} height={30} fill={`url(#${p}-colline-h)`} opacity={0.4} />
        <Rect y={70} width={390} height={30} fill={`url(#${p}-colline-d)`} opacity={0.35} />
      </G>
      <Path
        d="M0 86C30 78 64 72 104 80C138 87 168 90 196 82C226 74 262 70 300 78C336 85 362 80 390 76"
        stroke="#4A3F36"
        strokeWidth={1.3}
        strokeLinecap="round"
        strokeOpacity={0.45}
      />
      <G opacity={0.88}>
        <G transform="translate(18 83.2) scale(0.28)">
          <Path d="M-3.5 60L-2.6 12h5.2l1.4 48z" fill="#6B3B20" />
          <Path
            d="M-26 10Q-36 4-31-6Q-36-20-22-24Q-18-36-4-33Q6-42 17-32Q31-32 30-18Q40-8 31 4Q33 16 20 17Q12 25 0 20Q-10 26-18 18Q-30 20-26 10Z"
            fill="#D9622B"
          />
        </G>
        <G transform="translate(40 85.6) scale(0.24)">
          <Path d="M-3.5 60L-2.6 12h5.2l1.4 48z" fill="#6B3B20" />
          <Path
            d="M-26 10Q-36 4-31-6Q-36-20-22-24Q-18-36-4-33Q6-42 17-32Q31-32 30-18Q40-8 31 4Q33 16 20 17Q12 25 0 20Q-10 26-18 18Q-30 20-26 10Z"
            fill="#F0B232"
          />
        </G>
        <G transform="translate(62 82) scale(0.3)">
          <Path d="M-3.5 60L-2.6 12h5.2l1.4 48z" fill="#6B3B20" />
          <Path
            d="M-26 10Q-36 4-31-6Q-36-20-22-24Q-18-36-4-33Q6-42 17-32Q31-32 30-18Q40-8 31 4Q33 16 20 17Q12 25 0 20Q-10 26-18 18Q-30 20-26 10Z"
            fill="#C8432B"
          />
        </G>
        <G transform="translate(92 85.6) scale(0.24)">
          <Path d="M-3.5 60L-2.6 12h5.2l1.4 48z" fill="#6B3B20" />
          <Path
            d="M-26 10Q-36 4-31-6Q-36-20-22-24Q-18-36-4-33Q6-42 17-32Q31-32 30-18Q40-8 31 4Q33 16 20 17Q12 25 0 20Q-10 26-18 18Q-30 20-26 10Z"
            fill="#E68A2E"
          />
        </G>
        <G transform="translate(166 84.4) scale(0.26)">
          <Path d="M-3.5 60L-2.6 12h5.2l1.4 48z" fill="#6B3B20" />
          <Path
            d="M-26 10Q-36 4-31-6Q-36-20-22-24Q-18-36-4-33Q6-42 17-32Q31-32 30-18Q40-8 31 4Q33 16 20 17Q12 25 0 20Q-10 26-18 18Q-30 20-26 10Z"
            fill="#F2C230"
          />
        </G>
        <G transform="translate(190 82) scale(0.3)">
          <Path d="M-3.5 60L-2.6 12h5.2l1.4 48z" fill="#6B3B20" />
          <Path
            d="M-26 10Q-36 4-31-6Q-36-20-22-24Q-18-36-4-33Q6-42 17-32Q31-32 30-18Q40-8 31 4Q33 16 20 17Q12 25 0 20Q-10 26-18 18Q-30 20-26 10Z"
            fill="#D24E2A"
          />
        </G>
        <G transform="translate(214 86.8) scale(0.22)">
          <Path d="M-3.5 60L-2.6 12h5.2l1.4 48z" fill="#6B3B20" />
          <Path
            d="M-26 10Q-36 4-31-6Q-36-20-22-24Q-18-36-4-33Q6-42 17-32Q31-32 30-18Q40-8 31 4Q33 16 20 17Q12 25 0 20Q-10 26-18 18Q-30 20-26 10Z"
            fill="#EBA032"
          />
        </G>
        <G transform="translate(238 83.8) scale(0.27)">
          <Path d="M-3.5 60L-2.6 12h5.2l1.4 48z" fill="#6B3B20" />
          <Path
            d="M-26 10Q-36 4-31-6Q-36-20-22-24Q-18-36-4-33Q6-42 17-32Q31-32 30-18Q40-8 31 4Q33 16 20 17Q12 25 0 20Q-10 26-18 18Q-30 20-26 10Z"
            fill="#C8432B"
          />
        </G>
        <G transform="translate(282 82.6) scale(0.29)">
          <Path d="M-3.5 60L-2.6 12h5.2l1.4 48z" fill="#6B3B20" />
          <Path
            d="M-26 10Q-36 4-31-6Q-36-20-22-24Q-18-36-4-33Q6-42 17-32Q31-32 30-18Q40-8 31 4Q33 16 20 17Q12 25 0 20Q-10 26-18 18Q-30 20-26 10Z"
            fill="#F0B232"
          />
        </G>
        <G transform="translate(368 85) scale(0.25)">
          <Path d="M-3.5 60L-2.6 12h5.2l1.4 48z" fill="#6B3B20" />
          <Path
            d="M-26 10Q-36 4-31-6Q-36-20-22-24Q-18-36-4-33Q6-42 17-32Q31-32 30-18Q40-8 31 4Q33 16 20 17Q12 25 0 20Q-10 26-18 18Q-30 20-26 10Z"
            fill="#E0712A"
          />
        </G>
      </G>
      <Rect y={100} width={390} height={60} fill="#A9CFD8" />
      <Rect y={100} width={390} height={60} fill={`url(#${p}-eau-h)`} opacity={0.45} />
      <Rect y={100} width={390} height={60} fill={`url(#${p}-eau-h2)`} opacity={0.35} />
      <Path
        d="M0 100h390"
        stroke="#4A3F36"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeOpacity={0.35}
      />
      <G strokeWidth={1.6} strokeLinecap="round" strokeOpacity={0.45}>
        <Path d="M12 103h12M13.5 106.5h9M15.5 110h5" stroke="#D9622B" />
        <Path d="M35 103h10M36.5 106.5h7" stroke="#F0B232" />
        <Path d="M56 103h12M57.5 106.5h9M59.5 110h5" stroke="#C8432B" />
        <Path d="M87 103h10M88.5 106.5h7" stroke="#E68A2E" />
        <Path d="M160 103h12M161.5 106.5h9" stroke="#F2C230" />
        <Path d="M184 103h12M185.5 106.5h9M187.5 110h5" stroke="#D24E2A" />
        <Path d="M209 103h10M210.5 106.5h7" stroke="#EBA032" />
        <Path d="M232 103h12M233.5 106.5h9M235.5 110h5" stroke="#C8432B" />
        <Path d="M276 103h12M277.5 106.5h9M279.5 110h5" stroke="#F0B232" />
        <Path d="M362 103h12M363.5 106.5h9" stroke="#E0712A" />
      </G>
      <Path
        d="M30 117h22M118 113h14M310 116h24M338 109h16M100 121h12"
        stroke="#FFFFFF"
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeOpacity={0.7}
      />
      <Path
        d="M154 129Q227 161 300 129"
        stroke="#8A4F2D"
        strokeWidth={5}
        strokeLinecap="round"
        strokeOpacity={0.3}
      />
      <Path
        d="M154 146Q227 174 300 146"
        stroke="#8A4F2D"
        strokeWidth={2}
        strokeLinecap="round"
        strokeOpacity={0.22}
      />
      <Path
        d="M190 135h16M238 139h12M212 149h18"
        stroke="#FFFFFF"
        strokeWidth={1.3}
        strokeLinecap="round"
        strokeOpacity={0.6}
      />
      <Path
        d="M0 128C40 131 100 127 158 124C164 132 168 146 182 151C206 156 246 156 268 151C284 146 288 132 296 124C330 127 362 130 390 127V200H0Z"
        fill="#E9DDB0"
      />
      <G clipPath={`url(#${p}-zone-sol)`}>
        <Rect y={120} width={390} height={80} fill={`url(#${p}-sol-h)`} opacity={0.45} />
        <Rect y={120} width={390} height={80} fill={`url(#${p}-sol-d1)`} opacity={0.36} />
        <Rect y={146} width={390} height={54} fill={`url(#${p}-sol-v)`} opacity={0.4} />
        <Rect y={166} width={390} height={34} fill={`url(#${p}-sol-d2)`} opacity={0.35} />
        <Rect y={184} width={390} height={16} fill={`url(#${p}-sol-h)`} opacity={0.35} />
      </G>
      <Path
        d="M0 128C40 131 100 127 158 124C164 132 168 146 182 151C206 156 246 156 268 151C284 146 288 132 296 124C330 127 362 130 390 127"
        stroke="#4A3F36"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M0 130C42 133 98 129 157 126.5C164 135 170 148 184 153C208 158 244 158 267 153C285 148 289 134 297 126.5C332 129 360 132 390 129"
        stroke="#4A3F36"
        strokeWidth={1}
        strokeLinecap="round"
        strokeOpacity={0.4}
      />
      <Path
        d="M10 130l-2-7M18 130l2-8M44 130l-2-8M52 130l3-7M84 129l-2-8M96 129l2-7M118 127l-2-8M140 126l2-7M310 126l-2-8M322 127l2-7M356 129l-2-8M368 129l3-7M384 128l-2-7"
        stroke="#9A7B2E"
        strokeWidth={1.6}
        strokeLinecap="round"
      />
      <G transform="translate(198 142)">
        <G>
          <Path
            d="M0-4.5C2.8-2.6 2.8 2.2 0 4.5C-2.8 2.2-2.8-2.6 0-4.5Z"
            transform="rotate(70)"
            fill="#E0712A"
            stroke="#4A3F36"
            strokeWidth={0.6}
            strokeOpacity={0.5}
          />
        </G>
      </G>
      <G transform="translate(248 146)">
        <G>
          <Path
            d="M0 5L0.6 2.6L3.8 3.6L3 1.8L5.6 -0.4L4.2 -0.8L4.8 -3.4L2.6 -2.6L2.2 -3.8L0.9 -1.8L0 -5.4L-0.9 -1.8L-2.2 -3.8L-2.6 -2.6L-4.8 -3.4L-4.2 -0.8L-5.6 -0.4L-3 1.8L-3.8 3.6L-0.6 2.6Z"
            transform="rotate(-20) scale(0.9)"
            fill="#C8432B"
            stroke="#4A3F36"
            strokeWidth={0.6}
            strokeOpacity={0.5}
          />
        </G>
      </G>
      <G transform="translate(124 92) scale(0.55)">
        <Path d="M-3.5 60L-2.6 12h5.2l1.4 48z" fill="#6B3B20" />
        <Path
          d="M-3.5 60L-2.6 12M2.6 12L3.9 60"
          stroke="#4A3F36"
          strokeWidth={2.182}
          strokeLinecap="round"
          strokeOpacity={0.7}
        />
        <Path
          d="M-26 10Q-36 4-31-6Q-36-20-22-24Q-18-36-4-33Q6-42 17-32Q31-32 30-18Q40-8 31 4Q33 16 20 17Q12 25 0 20Q-10 26-18 18Q-30 20-26 10Z"
          fill="#F0B232"
        />
        <G clipPath={`url(#${p}-zone-houppier)`}>
          <Circle cx={-14} cy={-16} r={16} fill="#F8D660" fillOpacity={0.6} />
          <Circle cx={16} cy={10} r={15} fill="#E07A26" fillOpacity={0.55} />
          <Rect x={-40} y={-45} width={80} height={72} fill={`url(#${p}-houp-h)`} opacity={0.22} />
          <Rect x={-40} y={-45} width={80} height={72} fill={`url(#${p}-houp-d1)`} opacity={0.22} />
          <Rect x={-40} y={-45} width={80} height={36} fill={`url(#${p}-houp-d2)`} opacity={0.4} />
        </G>
        <Path
          d="M-26 10Q-36 4-31-6Q-36-20-22-24Q-18-36-4-33Q6-42 17-32Q31-32 30-18Q40-8 31 4Q33 16 20 17Q12 25 0 20Q-10 26-18 18Q-30 20-26 10Z"
          stroke="#4A3F36"
          strokeWidth={2.364}
          strokeLinejoin="round"
          strokeOpacity={0.8}
        />
      </G>
      <Path d="M146 128c0-6 5-10 11-10s12 4 12 10z" fill="#B5AA98" />
      <Path
        d="M146 128c0-6 5-10 11-10s12 4 12 10z"
        stroke="#4A3F36"
        strokeWidth={1.3}
        strokeLinejoin="round"
      />
      <Path d="M285 128c0-6 5-10 11-10s12 4 12 10z" fill="#B5AA98" />
      <Path
        d="M285 128c0-6 5-10 11-10s12 4 12 10z"
        stroke="#4A3F36"
        strokeWidth={1.3}
        strokeLinejoin="round"
      />
      <Path d="M160 128Q227 102 294 128" stroke="#6B3B20" strokeWidth={3.2} strokeLinecap="round" />
      <Path d="M154 124Q227 96 300 124L300 129Q227 101 154 129Z" fill="#9A5A32" />
      <Path
        d="M154 124Q227 96 300 124L300 129Q227 101 154 129Z"
        stroke="#4A3F36"
        strokeWidth={1.4}
        strokeLinejoin="round"
      />
      <Path
        d="M155 123Q227 95.5 299 123"
        stroke="#4A3F36"
        strokeWidth={1}
        strokeLinecap="round"
        strokeOpacity={0.4}
      />
      <Path
        d="M154 124V110M172.3 117.9V103.9M190.5 113.5V99.5M208.8 110.9V96.9M227 110V96M245.3 110.9V96.9M263.5 113.5V99.5M281.8 117.9V103.9M300 124V110"
        stroke="#6B3B20"
        strokeWidth={2.4}
        strokeLinecap="round"
      />
      <Path d="M154 117Q227 89 300 117" stroke="#8A4F2D" strokeWidth={1.6} strokeLinecap="round" />
      <Path d="M154 110Q227 82 300 110" stroke="#8A4F2D" strokeWidth={2.6} strokeLinecap="round" />
      <Path
        d="M154.5 109Q227 81 299.5 109"
        stroke="#4A3F36"
        strokeWidth={1}
        strokeLinecap="round"
        strokeOpacity={0.5}
      />
      <G transform="translate(52 120) scale(1.15)">
        <Path d="M-3.5 60L-2.6 12h5.2l1.4 48z" fill="#6B3B20" />
        <Path
          d="M-3.5 60L-2.6 12M2.6 12L3.9 60"
          stroke="#4A3F36"
          strokeWidth={1.217}
          strokeLinecap="round"
          strokeOpacity={0.7}
        />
        <Path
          d="M-26 10Q-36 4-31-6Q-36-20-22-24Q-18-36-4-33Q6-42 17-32Q31-32 30-18Q40-8 31 4Q33 16 20 17Q12 25 0 20Q-10 26-18 18Q-30 20-26 10Z"
          fill="#E0712A"
        />
        <G clipPath={`url(#${p}-zone-houppier)`}>
          <Circle cx={-14} cy={-16} r={16} fill="#F2B437" fillOpacity={0.6} />
          <Circle cx={16} cy={10} r={15} fill="#B8361F" fillOpacity={0.55} />
          <Rect x={-40} y={-45} width={80} height={72} fill={`url(#${p}-houp-h)`} opacity={0.26} />
          <Rect x={-40} y={-45} width={80} height={72} fill={`url(#${p}-houp-d1)`} opacity={0.26} />
          <Rect x={-40} y={-45} width={80} height={36} fill={`url(#${p}-houp-d2)`} opacity={0.38} />
        </G>
        <Path
          d="M0 18L-11 4M0 12L10-2M0 6V-8"
          stroke="#5A311B"
          strokeWidth={1.391}
          strokeLinecap="round"
          strokeOpacity={0.6}
        />
        <Path
          d="M-26 10Q-36 4-31-6Q-36-20-22-24Q-18-36-4-33Q6-42 17-32Q31-32 30-18Q40-8 31 4Q33 16 20 17Q12 25 0 20Q-10 26-18 18Q-30 20-26 10Z"
          stroke="#4A3F36"
          strokeWidth={1.391}
          strokeLinejoin="round"
          strokeOpacity={0.85}
        />
        <Path
          d="M-26 10Q-36 4-31-6Q-36-20-22-24Q-18-36-4-33Q6-42 17-32Q31-32 30-18Q40-8 31 4Q33 16 20 17Q12 25 0 20Q-10 26-18 18Q-30 20-26 10Z"
          transform="translate(0.8 0.6)"
          stroke="#4A3F36"
          strokeWidth={0.783}
          strokeLinejoin="round"
          strokeOpacity={0.35}
        />
      </G>
      <G transform="translate(342 122) scale(1.2)">
        <Path d="M-3.5 60L-2.6 12h5.2l1.4 48z" fill="#6B3B20" />
        <Path
          d="M-3.5 60L-2.6 12M2.6 12L3.9 60"
          stroke="#4A3F36"
          strokeWidth={1.167}
          strokeLinecap="round"
          strokeOpacity={0.7}
        />
        <Path
          d="M-26 10Q-36 4-31-6Q-36-20-22-24Q-18-36-4-33Q6-42 17-32Q31-32 30-18Q40-8 31 4Q33 16 20 17Q12 25 0 20Q-10 26-18 18Q-30 20-26 10Z"
          fill="#C8432B"
        />
        <G clipPath={`url(#${p}-zone-houppier)`}>
          <Circle cx={-14} cy={-16} r={16} fill="#E8862C" fillOpacity={0.6} />
          <Circle cx={16} cy={10} r={15} fill="#8E2716" fillOpacity={0.55} />
          <Rect x={-40} y={-45} width={80} height={72} fill={`url(#${p}-houp-h)`} opacity={0.24} />
          <Rect x={-40} y={-45} width={80} height={72} fill={`url(#${p}-houp-d1)`} opacity={0.24} />
          <Rect x={-40} y={-45} width={80} height={36} fill={`url(#${p}-houp-d2)`} opacity={0.34} />
        </G>
        <Path
          d="M0 18L-11 4M0 12L10-2M0 6V-8"
          stroke="#5A311B"
          strokeWidth={1.333}
          strokeLinecap="round"
          strokeOpacity={0.6}
        />
        <Path
          d="M-26 10Q-36 4-31-6Q-36-20-22-24Q-18-36-4-33Q6-42 17-32Q31-32 30-18Q40-8 31 4Q33 16 20 17Q12 25 0 20Q-10 26-18 18Q-30 20-26 10Z"
          stroke="#4A3F36"
          strokeWidth={1.333}
          strokeLinejoin="round"
          strokeOpacity={0.85}
        />
        <Path
          d="M-26 10Q-36 4-31-6Q-36-20-22-24Q-18-36-4-33Q6-42 17-32Q31-32 30-18Q40-8 31 4Q33 16 20 17Q12 25 0 20Q-10 26-18 18Q-30 20-26 10Z"
          transform="translate(0.8 0.6)"
          stroke="#4A3F36"
          strokeWidth={0.75}
          strokeLinejoin="round"
          strokeOpacity={0.35}
        />
      </G>
      <G stroke="#4A3F36" strokeWidth={0.5} strokeOpacity={0.45}>
        <Path
          transform="translate(30 190) rotate(20)"
          d="M0 5L0.6 2.6L3.8 3.6L3 1.8L5.6 -0.4L4.2 -0.8L4.8 -3.4L2.6 -2.6L2.2 -3.8L0.9 -1.8L0 -5.4L-0.9 -1.8L-2.2 -3.8L-2.6 -2.6L-4.8 -3.4L-4.2 -0.8L-5.6 -0.4L-3 1.8L-3.8 3.6L-0.6 2.6Z"
          fill="#C8432B"
        />
        <Path
          transform="translate(44 194) rotate(-30) scale(0.9)"
          d="M0-4.5C2.8-2.6 2.8 2.2 0 4.5C-2.8 2.2-2.8-2.6 0-4.5Z"
          fill="#F0B232"
        />
        <Path
          transform="translate(64 192) rotate(60)"
          d="M0 5L0.6 2.6L3.8 3.6L3 1.8L5.6 -0.4L4.2 -0.8L4.8 -3.4L2.6 -2.6L2.2 -3.8L0.9 -1.8L0 -5.4L-0.9 -1.8L-2.2 -3.8L-2.6 -2.6L-4.8 -3.4L-4.2 -0.8L-5.6 -0.4L-3 1.8L-3.8 3.6L-0.6 2.6Z"
          fill="#E0712A"
        />
        <Path
          transform="translate(78 187) rotate(-10) scale(0.8)"
          d="M0-4.5C2.8-2.6 2.8 2.2 0 4.5C-2.8 2.2-2.8-2.6 0-4.5Z"
          fill="#A8321E"
        />
        <Path
          transform="translate(18 183) rotate(45) scale(0.8)"
          d="M0-4.5C2.8-2.6 2.8 2.2 0 4.5C-2.8 2.2-2.8-2.6 0-4.5Z"
          fill="#F2C230"
        />
        <Path
          transform="translate(92 196) rotate(10) scale(0.9)"
          d="M0-4.5C2.8-2.6 2.8 2.2 0 4.5C-2.8 2.2-2.8-2.6 0-4.5Z"
          fill="#E0712A"
        />
        <Path
          transform="translate(120 170) rotate(-25) scale(0.8)"
          d="M0 5L0.6 2.6L3.8 3.6L3 1.8L5.6 -0.4L4.2 -0.8L4.8 -3.4L2.6 -2.6L2.2 -3.8L0.9 -1.8L0 -5.4L-0.9 -1.8L-2.2 -3.8L-2.6 -2.6L-4.8 -3.4L-4.2 -0.8L-5.6 -0.4L-3 1.8L-3.8 3.6L-0.6 2.6Z"
          fill="#F0B232"
        />
        <Path
          transform="translate(140 160) rotate(35) scale(0.7)"
          d="M0-4.5C2.8-2.6 2.8 2.2 0 4.5C-2.8 2.2-2.8-2.6 0-4.5Z"
          fill="#E0712A"
        />
        <Path
          transform="translate(108 148) rotate(0) scale(0.7)"
          d="M0-4.5C2.8-2.6 2.8 2.2 0 4.5C-2.8 2.2-2.8-2.6 0-4.5Z"
          fill="#F2C230"
        />
        <Path
          transform="translate(204 176) rotate(15) scale(0.8)"
          d="M0-4.5C2.8-2.6 2.8 2.2 0 4.5C-2.8 2.2-2.8-2.6 0-4.5Z"
          fill="#C8432B"
        />
        <Path
          transform="translate(232 186) rotate(-40) scale(0.9)"
          d="M0 5L0.6 2.6L3.8 3.6L3 1.8L5.6 -0.4L4.2 -0.8L4.8 -3.4L2.6 -2.6L2.2 -3.8L0.9 -1.8L0 -5.4L-0.9 -1.8L-2.2 -3.8L-2.6 -2.6L-4.8 -3.4L-4.2 -0.8L-5.6 -0.4L-3 1.8L-3.8 3.6L-0.6 2.6Z"
          fill="#F0B232"
        />
        <Path
          transform="translate(264 170) rotate(25) scale(0.7)"
          d="M0-4.5C2.8-2.6 2.8 2.2 0 4.5C-2.8 2.2-2.8-2.6 0-4.5Z"
          fill="#E0712A"
        />
        <Path
          transform="translate(176 192) rotate(-15) scale(0.8)"
          d="M0-4.5C2.8-2.6 2.8 2.2 0 4.5C-2.8 2.2-2.8-2.6 0-4.5Z"
          fill="#F2C230"
        />
        <Path
          transform="translate(322 192) rotate(30)"
          d="M0 5L0.6 2.6L3.8 3.6L3 1.8L5.6 -0.4L4.2 -0.8L4.8 -3.4L2.6 -2.6L2.2 -3.8L0.9 -1.8L0 -5.4L-0.9 -1.8L-2.2 -3.8L-2.6 -2.6L-4.8 -3.4L-4.2 -0.8L-5.6 -0.4L-3 1.8L-3.8 3.6L-0.6 2.6Z"
          fill="#C8432B"
        />
        <Path
          transform="translate(336 197) rotate(-20) scale(0.9)"
          d="M0-4.5C2.8-2.6 2.8 2.2 0 4.5C-2.8 2.2-2.8-2.6 0-4.5Z"
          fill="#F0B232"
        />
        <Path
          transform="translate(358 190) rotate(70)"
          d="M0 5L0.6 2.6L3.8 3.6L3 1.8L5.6 -0.4L4.2 -0.8L4.8 -3.4L2.6 -2.6L2.2 -3.8L0.9 -1.8L0 -5.4L-0.9 -1.8L-2.2 -3.8L-2.6 -2.6L-4.8 -3.4L-4.2 -0.8L-5.6 -0.4L-3 1.8L-3.8 3.6L-0.6 2.6Z"
          fill="#E0712A"
        />
        <Path
          transform="translate(374 195) rotate(-35) scale(0.8)"
          d="M0-4.5C2.8-2.6 2.8 2.2 0 4.5C-2.8 2.2-2.8-2.6 0-4.5Z"
          fill="#A8321E"
        />
        <Path
          transform="translate(306 182) rotate(10) scale(0.8)"
          d="M0-4.5C2.8-2.6 2.8 2.2 0 4.5C-2.8 2.2-2.8-2.6 0-4.5Z"
          fill="#F2C230"
        />
      </G>
      <G stroke="#4A3F36" strokeWidth={0.6} strokeOpacity={0.5}>
        <G transform="translate(30 118)">
          <G>
            <G>
              <G>
                <Path
                  d="M0 5L0.6 2.6L3.8 3.6L3 1.8L5.6 -0.4L4.2 -0.8L4.8 -3.4L2.6 -2.6L2.2 -3.8L0.9 -1.8L0 -5.4L-0.9 -1.8L-2.2 -3.8L-2.6 -2.6L-4.8 -3.4L-4.2 -0.8L-5.6 -0.4L-3 1.8L-3.8 3.6L-0.6 2.6Z"
                  fill="#C8432B"
                />
              </G>
            </G>
          </G>
        </G>
        <G transform="translate(70 104)">
          <G>
            <G>
              <G>
                <Path
                  d="M0 5L0.6 2.6L3.8 3.6L3 1.8L5.6 -0.4L4.2 -0.8L4.8 -3.4L2.6 -2.6L2.2 -3.8L0.9 -1.8L0 -5.4L-0.9 -1.8L-2.2 -3.8L-2.6 -2.6L-4.8 -3.4L-4.2 -0.8L-5.6 -0.4L-3 1.8L-3.8 3.6L-0.6 2.6Z"
                  fill="#E0712A"
                />
              </G>
            </G>
          </G>
        </G>
        <G transform="translate(52 130)">
          <G>
            <G>
              <G>
                <Path d="M0-4.5C2.8-2.6 2.8 2.2 0 4.5C-2.8 2.2-2.8-2.6 0-4.5Z" fill="#F2C230" />
              </G>
            </G>
          </G>
        </G>
        <G transform="translate(86 122)">
          <G>
            <G>
              <G>
                <Path
                  d="M0 5L0.6 2.6L3.8 3.6L3 1.8L5.6 -0.4L4.2 -0.8L4.8 -3.4L2.6 -2.6L2.2 -3.8L0.9 -1.8L0 -5.4L-0.9 -1.8L-2.2 -3.8L-2.6 -2.6L-4.8 -3.4L-4.2 -0.8L-5.6 -0.4L-3 1.8L-3.8 3.6L-0.6 2.6Z"
                  fill="#F0B232"
                />
              </G>
            </G>
          </G>
        </G>
        <G transform="translate(318 128)">
          <G>
            <G>
              <G>
                <Path
                  d="M0 5L0.6 2.6L3.8 3.6L3 1.8L5.6 -0.4L4.2 -0.8L4.8 -3.4L2.6 -2.6L2.2 -3.8L0.9 -1.8L0 -5.4L-0.9 -1.8L-2.2 -3.8L-2.6 -2.6L-4.8 -3.4L-4.2 -0.8L-5.6 -0.4L-3 1.8L-3.8 3.6L-0.6 2.6Z"
                  fill="#A8321E"
                />
              </G>
            </G>
          </G>
        </G>
        <G transform="translate(350 108)">
          <G>
            <G>
              <G>
                <Path d="M0-4.5C2.8-2.6 2.8 2.2 0 4.5C-2.8 2.2-2.8-2.6 0-4.5Z" fill="#E0712A" />
              </G>
            </G>
          </G>
        </G>
        <G transform="translate(372 134)">
          <G>
            <G>
              <G>
                <Path
                  d="M0 5L0.6 2.6L3.8 3.6L3 1.8L5.6 -0.4L4.2 -0.8L4.8 -3.4L2.6 -2.6L2.2 -3.8L0.9 -1.8L0 -5.4L-0.9 -1.8L-2.2 -3.8L-2.6 -2.6L-4.8 -3.4L-4.2 -0.8L-5.6 -0.4L-3 1.8L-3.8 3.6L-0.6 2.6Z"
                  fill="#F2C230"
                />
              </G>
            </G>
          </G>
        </G>
        <G transform="translate(336 140)">
          <G>
            <G>
              <G>
                <Path d="M0-4.5C2.8-2.6 2.8 2.2 0 4.5C-2.8 2.2-2.8-2.6 0-4.5Z" fill="#C8432B" />
              </G>
            </G>
          </G>
        </G>
        <G transform="translate(116 100)">
          <G>
            <G>
              <G>
                <Path d="M0-4.5C2.8-2.6 2.8 2.2 0 4.5C-2.8 2.2-2.8-2.6 0-4.5Z" fill="#F2C230" />
              </G>
            </G>
          </G>
        </G>
        <G transform="translate(136 96)">
          <G>
            <G>
              <G>
                <Path
                  d="M0 5L0.6 2.6L3.8 3.6L3 1.8L5.6 -0.4L4.2 -0.8L4.8 -3.4L2.6 -2.6L2.2 -3.8L0.9 -1.8L0 -5.4L-0.9 -1.8L-2.2 -3.8L-2.6 -2.6L-4.8 -3.4L-4.2 -0.8L-5.6 -0.4L-3 1.8L-3.8 3.6L-0.6 2.6Z"
                  fill="#EBA032"
                />
              </G>
            </G>
          </G>
        </G>
        <G transform="translate(88 100)">
          <G>
            <G>
              <G>
                <Path
                  d="M0 5L0.6 2.6L3.8 3.6L3 1.8L5.6 -0.4L4.2 -0.8L4.8 -3.4L2.6 -2.6L2.2 -3.8L0.9 -1.8L0 -5.4L-0.9 -1.8L-2.2 -3.8L-2.6 -2.6L-4.8 -3.4L-4.2 -0.8L-5.6 -0.4L-3 1.8L-3.8 3.6L-0.6 2.6Z"
                  fill="#D24E2A"
                />
              </G>
            </G>
          </G>
        </G>
      </G>
    </Svg>
  );
}
