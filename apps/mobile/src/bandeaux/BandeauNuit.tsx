import Svg, { Circle, ClipPath, Defs, G, Path, Pattern, Rect } from 'react-native-svg';

import { useIdSvg } from '@/svg/useIdSvg';

import { HAUTEUR_BANDEAU, LARGEUR_BANDEAU } from './dimensions';

// Scène « nuit » : ciel étoilé, lune, oiseaux, sapins et ombre d'un loup entre les deux rangées.
// Reprise de la planche NuitAnimee (design/canvas/), dans l'état fixe qu'elle prend quand les
// animations sont coupées : étoiles à leur place, oiseaux et loup à leur point de départ,
// étoiles filantes absentes (invisibles hors de leur passage). L'animation viendra dans une
// tâche à part.

type Props = {
  /** Largeur affichée ; la hauteur suit en gardant les proportions de la planche. */
  largeur: number;
};

export function BandeauNuit({ largeur }: Props) {
  const p = useIdSvg('nuit');

  return (
    <Svg
      width={largeur}
      height={(largeur * HAUTEUR_BANDEAU) / LARGEUR_BANDEAU}
      viewBox={`0 0 ${LARGEUR_BANDEAU} ${HAUTEUR_BANDEAU}`}
      fill="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      testID="bandeau-nuit"
    >
      <Defs>
        <Pattern id={`${p}-ciel-h`} width={10} height={3.6} patternUnits="userSpaceOnUse">
          <Path d="M-1 1.8h12" stroke="#39406B" strokeWidth={1.7} strokeLinecap="round" />
        </Pattern>
        <Pattern id={`${p}-ciel-v`} width={3.6} height={10} patternUnits="userSpaceOnUse">
          <Path d="M1.8-1v12" stroke="#2B3155" strokeWidth={1.5} strokeLinecap="round" />
        </Pattern>
        <Pattern
          id={`${p}-ciel-d1`}
          width={10}
          height={3.8}
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(38)"
        >
          <Path d="M-1 1.9h12" stroke="#4A5490" strokeWidth={1.6} strokeLinecap="round" />
        </Pattern>
        <Pattern
          id={`${p}-ciel-d2`}
          width={10}
          height={4}
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-42)"
        >
          <Path d="M-1 2h12" stroke="#3B4477" strokeWidth={1.5} strokeLinecap="round" />
        </Pattern>
        <Pattern id={`${p}-sol-h`} width={10} height={3.6} patternUnits="userSpaceOnUse">
          <Path d="M-1 1.8h12" stroke="#2F6B4E" strokeWidth={1.7} strokeLinecap="round" />
        </Pattern>
        <Pattern id={`${p}-sol-v`} width={3.6} height={10} patternUnits="userSpaceOnUse">
          <Path d="M1.8-1v12" stroke="#14301F" strokeWidth={1.5} strokeLinecap="round" />
        </Pattern>
        <Pattern
          id={`${p}-sol-d1`}
          width={10}
          height={3.8}
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-40)"
        >
          <Path d="M-1 1.9h12" stroke="#224C37" strokeWidth={1.6} strokeLinecap="round" />
        </Pattern>
        <Pattern
          id={`${p}-sol-d2`}
          width={10}
          height={4}
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(36)"
        >
          <Path d="M-1 2h12" stroke="#3C7F58" strokeWidth={1.5} strokeLinecap="round" />
        </Pattern>
        <Pattern id={`${p}-lune-h`} width={7} height={3.2} patternUnits="userSpaceOnUse">
          <Path d="M-1 1.6h9" stroke="#D9C89A" strokeWidth={1.4} strokeLinecap="round" />
        </Pattern>
        <Pattern
          id={`${p}-lune-d`}
          width={7}
          height={3.2}
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(34)"
        >
          <Path d="M-1 1.6h9" stroke="#C7B382" strokeWidth={1.5} strokeLinecap="round" />
        </Pattern>
        <ClipPath id={`${p}-zone-sol`}>
          <Path d="M0 105c34-4 64 2 100-1 36-3 66 3 104 1 38-2 74 3 112 0 30-2 56 2 74 1v94H0z" />
        </ClipPath>
        <ClipPath id={`${p}-zone-lune`}>
          <Circle cx={318} cy={42} r={20} />
        </ClipPath>
      </Defs>
      <Rect width={390} height={200} fill="#1F2340" />
      <Rect width={390} height={200} fill={`url(#${p}-ciel-h)`} opacity={0.5} />
      <Rect width={390} height={200} fill={`url(#${p}-ciel-d1)`} opacity={0.34} />
      <Rect width={390} height={100} fill={`url(#${p}-ciel-v)`} opacity={0.45} />
      <Rect width={390} height={56} fill={`url(#${p}-ciel-d2)`} opacity={0.4} />
      <Rect width={390} height={28} fill={`url(#${p}-ciel-h)`} opacity={0.4} />
      <Circle cx={36} cy={26} r={1.9} fill="#E8E4D0" />
      <Circle cx={88} cy={16} r={1.4} fill="#E8E4D0" fillOpacity={0.8} />
      <Circle cx={132} cy={34} r={1.7} fill="#E8E4D0" />
      <Circle cx={168} cy={14} r={1.2} fill="#E8E4D0" fillOpacity={0.7} />
      <Circle cx={212} cy={30} r={1.9} fill="#E8E4D0" />
      <Circle cx={246} cy={12} r={1.3} fill="#E8E4D0" fillOpacity={0.75} />
      <Circle cx={268} cy={52} r={1.5} fill="#E8E4D0" fillOpacity={0.65} />
      <Circle cx={364} cy={22} r={1.6} fill="#E8E4D0" fillOpacity={0.8} />
      <Path
        d="M108 44v7M104.5 47.5h7"
        stroke="#E8E4D0"
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeOpacity={0.85}
      />
      <Path
        d="M192 54v6M189 57h6"
        stroke="#E8E4D0"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeOpacity={0.7}
      />
      <Circle cx={318} cy={42} r={32} fill="#2C3158" fillOpacity={0.75} />
      <Circle cx={318} cy={42} r={20} fill="#F3E7C4" />
      <G clipPath={`url(#${p}-zone-lune)`}>
        <Rect x={296} y={20} width={44} height={44} fill={`url(#${p}-lune-h)`} opacity={0.45} />
        <Rect x={296} y={20} width={44} height={44} fill={`url(#${p}-lune-d)`} opacity={0.35} />
        <Circle cx={310} cy={36} r={4.5} fill="#D7C593" fillOpacity={0.75} />
        <Circle cx={325} cy={50} r={3.2} fill="#D7C593" fillOpacity={0.65} />
        <Circle cx={327} cy={33} r={2.2} fill="#D7C593" fillOpacity={0.6} />
      </G>
      <Path
        d="M318 22c11 0 20 9 20 20s-9 20-20 20-20-9-20-20 9-20 20-20z"
        stroke="#F6EDD4"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeOpacity={0.9}
      />
      <Path
        d="M319 21c11.5 1 19.5 10 19 21s-10 19.5-21 19-19.5-10-19-21 9.5-19.5 21-19z"
        stroke="#F6EDD4"
        strokeWidth={1}
        strokeLinecap="round"
        strokeOpacity={0.4}
      />
      <Path d="M18 62l-9 18h18zM18 72l-12 17h24zM18 82l-15 24h30z" fill="#232A4A" />
      <Path d="M64 56l-10 19h20zM64 67l-13 18h26zM64 78l-16 28h32z" fill="#232A4A" />
      <Path d="M112 66l-8 16h16zM112 76l-11 15h22zM112 86l-14 20h28z" fill="#232A4A" />
      <Path d="M160 58l-10 18h20zM160 69l-12 17h24zM160 80l-15 26h30z" fill="#232A4A" />
      <Path d="M214 70l-8 15h16zM214 80l-11 14h22zM214 89l-13 17h26z" fill="#232A4A" />
      <Path d="M262 60l-9 18h18zM262 71l-12 16h24zM262 82l-15 24h30z" fill="#232A4A" />
      <Path d="M352 64l-9 17h18zM352 75l-12 16h24zM352 85l-15 21h30z" fill="#232A4A" />
      <G transform="translate(214 106)">
        <G>
          <G>
            <Path d="M-7.6 -6.2v6.4" stroke="#0F1322" strokeWidth={1.7} strokeLinecap="round" />
            <Path d="M-5.4 -6.2v6.4" stroke="#0F1322" strokeWidth={1.7} strokeLinecap="round" />
            <Path d="M6.2 -6v6.2" stroke="#0F1322" strokeWidth={1.8} strokeLinecap="round" />
            <Path d="M8.4 -6v6.2" stroke="#0F1322" strokeWidth={1.8} strokeLinecap="round" />
            <Path
              d="M-9 -5.5C-10.5 -8 -11.5 -9.5 -13 -10L-18.5 -10.2Q-19.6 -11 -18.8 -11.9L-15 -13.6L-13.6 -18.4L-11.6 -15.2L-10.6 -18L-9.6 -14.2C-7 -12.6 -2 -12 4 -12C8 -12 10.5 -11.6 11.5 -10.5Q16 -10 19.5 -5.5Q15.5 -7 11.5 -7.6C11 -6 10 -5 8.5 -5Z"
              fill="#0F1322"
              fillOpacity={0.92}
            />
            <Circle cx={-14.4} cy={-12.6} r={0.6} fill="#E0CE92" />
          </G>
        </G>
      </G>
      <Path d="M40 74l-11 22h22zM40 86l-14 20h28zM40 96l-17 10h34z" fill="#141A2B" />
      <Path d="M90 68l-12 23h24zM90 81l-15 21h30zM90 92l-18 14h36z" fill="#141A2B" />
      <Path d="M140 78l-10 20h20zM140 89l-13 17h26zM140 97l-16 9h32z" fill="#141A2B" />
      <Path d="M188 70l-12 23h24zM188 83l-15 20h30zM188 93l-18 13h36z" fill="#141A2B" />
      <Path d="M238 80l-10 19h20zM238 90l-13 16h26zM238 98l-15 8h30z" fill="#141A2B" />
      <Path d="M290 72l-12 22h24zM290 85l-15 20h30zM290 95l-18 11h36z" fill="#141A2B" />
      <Path d="M336 82l-10 18h20zM336 92l-13 14h26zM336 99l-15 7h30z" fill="#141A2B" />
      <Path d="M378 76l-11 21h22zM378 88l-14 18h28z" fill="#141A2B" />
      <Path
        d="M40 74l-11 22h22M40 86l-14 20h28M90 68l-12 23h24M90 81l-15 21h30M188 70l-12 23h24M290 72l-12 22h24M290 85l-15 20h30"
        stroke="#4A5490"
        strokeWidth={1.1}
        strokeLinejoin="round"
        strokeOpacity={0.5}
      />
      <G transform="translate(150 72)">
        <G>
          <G>
            <Path
              d="M-7 0Q-3.5-4.5 0 0Q3.5-4.5 7 0"
              stroke="#C9CEE6"
              strokeWidth={1.7}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </G>
          <G transform="translate(-18 -8)">
            <G>
              <Path
                d="M-6 0Q-3-4 0 0Q3-4 6 0"
                stroke="#C9CEE6"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeOpacity={0.9}
              />
            </G>
          </G>
          <G transform="translate(-15 10)">
            <G>
              <Path
                d="M-5.5 0Q-2.75-3.6 0 0Q2.75-3.6 5.5 0"
                stroke="#C9CEE6"
                strokeWidth={1.4}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeOpacity={0.85}
              />
            </G>
          </G>
        </G>
      </G>
      <G transform="translate(232 40)">
        <G>
          <G>
            <Path
              d="M-5 0Q-2.5-3.4 0 0Q2.5-3.4 5 0"
              stroke="#C9CEE6"
              strokeWidth={1.3}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity={0.75}
            />
          </G>
        </G>
      </G>
      <Path
        d="M0 105c34-4 64 2 100-1 36-3 66 3 104 1 38-2 74 3 112 0 30-2 56 2 74 1v94H0z"
        fill="#16251F"
      />
      <G clipPath={`url(#${p}-zone-sol)`}>
        <Rect y={98} width={390} height={102} fill={`url(#${p}-sol-h)`} opacity={0.4} />
        <Rect y={98} width={390} height={102} fill={`url(#${p}-sol-d1)`} opacity={0.4} />
        <Rect y={124} width={390} height={76} fill={`url(#${p}-sol-v)`} opacity={0.45} />
        <Rect y={150} width={390} height={50} fill={`url(#${p}-sol-d2)`} opacity={0.3} />
      </G>
      <Path
        d="M0 105c34-4 64 2 100-1 36-3 66 3 104 1 38-2 74 3 112 0 30-2 56 2 74 1"
        stroke="#8A93B8"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeOpacity={0.65}
      />
      <Path
        d="M0 107c36-4 60 2 102-1 36-3 62 3 104 1 38-2 70 3 110 0 30-2 54 2 74 1"
        stroke="#8A93B8"
        strokeWidth={1}
        strokeLinecap="round"
        strokeOpacity={0.3}
      />
      <Path
        d="M10 105l-2-8M18 105l2-9M27 104l4-7M52 104l-2-9M62 104l2-9M88 103l-2-7M98 103l2-9M124 104l-2-8M134 104l3-7M160 105l-2-9M170 105l3-7M196 105l-2-8M206 105l2-9M232 104l-2-8M242 104l3-7M268 105l-2-9M278 105l3-7M304 104l-2-8M314 104l2-9M340 104l-2-8M350 104l3-7M376 103l-2-9"
        stroke="#3C7F58"
        strokeWidth={1.7}
        strokeLinecap="round"
      />
    </Svg>
  );
}
