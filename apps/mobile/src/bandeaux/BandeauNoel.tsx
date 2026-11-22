import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle } from 'react-native-reanimated';
import Svg, { Circle, ClipPath, Defs, G, Path, Pattern, Rect } from 'react-native-svg';

import { useIdSvg } from '@/svg/useIdSvg';

import { HAUTEUR_BANDEAU, LARGEUR_BANDEAU } from './dimensions';
import {
  aller,
  BALANCE_DEGRES,
  BOULES,
  CONFETTIS,
  CONFETTIS_COUCHE,
  entre,
  ETOILE,
  FANIONS,
  LUEUR,
} from './noel';
import { useAnimationsActives, useBoucle } from './useBoucle';

// Scène de Noël : sapins, cadeaux, guirlande de fanions et confettis.
// Reprise de design/propositions/01-noel/bandeau.html. Le décor est fixe (deux couches Svg) ;
// chaque élément animé vit dans sa propre petite vue, déplacée par transformation et opacité
// sur le thread de l'interface : le décor ne se redessine jamais. Avec la réduction des
// animations du système, rien ne bouge (état de la planche avec prefers-reduced-motion).

type Props = {
  /** Largeur affichée ; la hauteur suit en gardant les proportions de la planche. */
  largeur: number;
};

// ease-in-out CSS de la planche : cubic-bezier(.42, 0, .58, 1).
const ease = Easing.bezier(0.42, 0, 0.58, 1);

function Sapin({ x, y, echelle }: { x: number; y: number; echelle: number }) {
  const trait = 1.5 / echelle; // vector-effect: non-scaling-stroke sur la planche
  return (
    <G transform={`translate(${x} ${y}) scale(${echelle})`}>
      <Path d="M0 -62L-13 -42H13ZM0 -50L-18 -24H18ZM0 -36L-23 -4H23Z" fill="#1F6B45" />
      <Path
        d="M0 -62L-13 -42H13ZM0 -50L-18 -24H18ZM0 -36L-23 -4H23Z"
        stroke="#4A3F36"
        strokeWidth={trait}
        strokeLinejoin="round"
        strokeOpacity={0.7}
      />
      <Path
        d="M-8 -30h12M-13 -14h22M-4 -44h8"
        stroke="#164E33"
        strokeWidth={1.2}
        strokeLinecap="round"
      />
      <Path d="M-3 -4h6v7h-6z" fill="#6B3B20" />
    </G>
  );
}

/** Une vue animée qui porte un petit dessin placé aux coordonnées du viewBox 390 × 200. */
function Piece({
  k,
  x,
  y,
  l,
  h,
  origine,
  style,
  children,
}: {
  k: number;
  x: number;
  y: number;
  l: number;
  h: number;
  /** Point d'origine des rotations et de l'échelle, en unités du viewBox, dans la pièce. */
  origine: [number, number];
  style: ReturnType<typeof useAnimatedStyle> | undefined;
  children: React.ReactNode;
}) {
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          left: x * k,
          top: y * k,
          width: l * k,
          height: h * k,
          transformOrigin: [origine[0] * k, origine[1] * k, 0],
        },
        style,
      ]}
    >
      <Svg width={l * k} height={h * k} viewBox={`${x} ${y} ${l} ${h}`} fill="none">
        {children}
      </Svg>
    </Animated.View>
  );
}

function FanionAnime({ k, i, actif }: { k: number; i: number; actif: boolean }) {
  const f = FANIONS[i]!;
  const phase = useBoucle(f.duree * 2, f.delai, actif);
  const style = useAnimatedStyle(() => {
    if (!actif) return {};
    const u = ease(aller(phase.value));
    return { transform: [{ rotate: `${entre(-BALANCE_DEGRES, BALANCE_DEGRES, u)}deg` }] };
  });
  return (
    <Piece k={k} x={f.x - 11} y={f.y - 2} l={22} h={24} origine={[11, 2]} style={style}>
      <Path d={`M${f.x - 9} ${f.y}L${f.x + 9} ${f.y}L${f.x} ${f.y + 20}Z`} fill={f.couleur} />
      <Path
        d={`M${f.x - 9} ${f.y}L${f.x + 9} ${f.y}L${f.x} ${f.y + 20}Z`}
        stroke="#4A3F36"
        strokeWidth={1.2}
        strokeLinejoin="round"
        strokeOpacity={0.6}
      />
    </Piece>
  );
}

function BouleAnimee({ k, i, actif }: { k: number; i: number; actif: boolean }) {
  const b = BOULES[i]!;
  const phase = useBoucle(b.duree * 2, b.delai, actif);
  const style = useAnimatedStyle(() => {
    if (!actif) return {};
    const u = ease(aller(phase.value));
    return {
      opacity: entre(1, LUEUR.opaciteFin, u),
      transform: [{ scale: entre(1, LUEUR.echelleFin, u) }],
    };
  });
  const c = 6; // demi-côté de la pièce
  return (
    <Piece k={k} x={b.x - c} y={b.y - c} l={2 * c} h={2 * c} origine={[c, c]} style={style}>
      <Circle cx={b.x} cy={b.y} r={LUEUR.rayon} fill={b.couleur} />
      <Circle
        cx={b.x}
        cy={b.y}
        r={LUEUR.rayon}
        stroke="#4A3F36"
        strokeWidth={1}
        strokeOpacity={0.6}
      />
    </Piece>
  );
}

function EtoileAnimee({ k, actif }: { k: number; actif: boolean }) {
  const phase = useBoucle(ETOILE.duree * 2, ETOILE.delai, actif);
  const style = useAnimatedStyle(() => {
    if (!actif) return {};
    const u = ease(aller(phase.value));
    return {
      opacity: entre(1, ETOILE.opaciteFin, u),
      transform: [
        { scale: entre(1, ETOILE.echelleFin, u) },
        { rotate: `${entre(-ETOILE.degres, ETOILE.degres, u)}deg` },
      ],
    };
  });
  return (
    <Piece k={k} x={ETOILE.x - 14} y={ETOILE.y - 14} l={28} h={28} origine={[14, 14]} style={style}>
      <Path
        d="M282.0 20.0L285.0 27.0L292.0 27.0L286.5 32.0L288.5 39.0L282.0 35.0L275.5 39.0L277.5 32.0L272.0 27.0L279.0 27.0Z"
        fill="#F2C14E"
        stroke="#4A3F36"
        strokeWidth={1.2}
        strokeLinejoin="round"
        strokeOpacity={0.7}
      />
    </Piece>
  );
}

function Confettis({ k, actif }: { k: number; actif: boolean }) {
  const phase = useBoucle(CONFETTIS.duree, 0, actif);
  const style = useAnimatedStyle(() => {
    if (!actif) return {};
    return { transform: [{ translateY: phase.value * CONFETTIS.distance * k }] };
  });
  const couche = (decalage: number) =>
    CONFETTIS_COUCHE.map((c, i) => (
      <Rect
        key={`${decalage}-${i}`}
        x={c.x}
        y={c.y + decalage}
        width={5}
        height={3}
        rx={1}
        fill={c.couleur}
        transform={`rotate(${c.degres} ${c.x} ${c.y + decalage})`}
      />
    ));
  // Deux couches, la seconde 200 px plus haut : au bout de la chute, elle prend la place de la première.
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          left: 0,
          top: -CONFETTIS.distance * k,
          width: LARGEUR_BANDEAU * k,
          height: 2 * CONFETTIS.distance * k,
        },
        style,
      ]}
      testID="noel-confettis"
    >
      <Svg
        width={LARGEUR_BANDEAU * k}
        height={2 * CONFETTIS.distance * k}
        viewBox={`0 ${-CONFETTIS.distance} ${LARGEUR_BANDEAU} ${2 * CONFETTIS.distance}`}
        fill="none"
      >
        {couche(0)}
        {couche(-CONFETTIS.distance)}
      </Svg>
    </Animated.View>
  );
}

export function BandeauNoel({ largeur }: Props) {
  const p = useIdSvg('noel');
  const actif = useAnimationsActives();
  const k = largeur / LARGEUR_BANDEAU;
  const hauteur = (largeur * HAUTEUR_BANDEAU) / LARGEUR_BANDEAU;
  const couche = {
    width: largeur,
    height: hauteur,
    viewBox: `0 0 ${LARGEUR_BANDEAU} ${HAUTEUR_BANDEAU}`,
    fill: 'none' as const,
  };

  return (
    <View
      style={{ width: largeur, height: hauteur, overflow: 'hidden' }}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Svg
        {...couche}
        style={StyleSheet.absoluteFill}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        testID="bandeau-noel"
      >
        <Defs>
          <Pattern id={`${p}-ciel-h`} width={10} height={3.6} patternUnits="userSpaceOnUse">
            <Path d="M-1 1.8h12" stroke="#E2B79C" strokeWidth={1.6} strokeLinecap="round" />
          </Pattern>
          <Pattern
            id={`${p}-ciel-d`}
            width={10}
            height={4}
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(38)"
          >
            <Path d="M-1 2h12" stroke="#EBC7AF" strokeWidth={1.5} strokeLinecap="round" />
          </Pattern>
          <Pattern id={`${p}-sol-h`} width={11} height={4.2} patternUnits="userSpaceOnUse">
            <Path d="M-1 2.1h13" stroke="#E6D3BB" strokeWidth={1.4} strokeLinecap="round" />
          </Pattern>
          <ClipPath id={`${p}-zone-sol`}>
            <Path d="M0 126c40-5 80 2 130-1 50-3 90 3 140 0 50-3 90 2 120 1v74H0z" />
          </ClipPath>
        </Defs>
        <Rect width={390} height={200} fill="#F7E3D0" />
        <Rect width={390} height={200} fill={`url(#${p}-ciel-h)`} opacity={0.45} />
        <Rect width={390} height={150} fill={`url(#${p}-ciel-d)`} opacity={0.35} />
        <Path d="M0 126c40-5 80 2 130-1 50-3 90 3 140 0 50-3 90 2 120 1v74H0z" fill="#FDF7EE" />
        <G clipPath={`url(#${p}-zone-sol)`}>
          <Rect y={124} width={390} height={76} fill={`url(#${p}-sol-h)`} opacity={0.4} />
        </G>
        <Path
          d="M0 126c40-5 80 2 130-1 50-3 90 3 140 0 50-3 90 2 120 1"
          stroke="#4A3F36"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeOpacity={0.5}
        />
        <G opacity={0.55}>
          <Sapin x={40} y={118} echelle={0.6} />
          <Sapin x={110} y={120} echelle={0.5} />
          <Sapin x={176} y={119} echelle={0.55} />
        </G>
        <Sapin x={60} y={138} echelle={1} />
        <Sapin x={282} y={126} echelle={1.5} />
        <G>
          <Rect x={205} y={110} width={22} height={16} fill="#B8352A" />
          <Path d="M214 110v16M205 116h22" stroke="#F2C14E" strokeWidth={4} />
          <Path d="M216 110q-7-9-9-3q2 5 9 3q7-9 9-3q-2 5-9 3z" fill="#F2C14E" />
          <Rect
            x={205}
            y={110}
            width={22}
            height={16}
            stroke="#4A3F36"
            strokeWidth={1.4}
            strokeLinejoin="round"
          />
        </G>
        <G>
          <Rect x={228} y={114} width={17} height={12} fill="#F2C14E" />
          <Path d="M234.5 114v12M228 118h17" stroke="#1F6B45" strokeWidth={4} />
          <Path d="M236.5 114q-7-9-9-3q2 5 9 3q7-9 9-3q-2 5-9 3z" fill="#1F6B45" />
          <Rect
            x={228}
            y={114}
            width={17}
            height={12}
            stroke="#4A3F36"
            strokeWidth={1.4}
            strokeLinejoin="round"
          />
        </G>
        <G>
          <Rect x={336} y={112} width={20} height={14} fill="#1F6B45" />
          <Path d="M344 112v14M336 117h20" stroke="#FFFFFF" strokeWidth={4} />
          <Path d="M346 112q-7-9-9-3q2 5 9 3q7-9 9-3q-2 5-9 3z" fill="#FFFFFF" />
          <Rect
            x={336}
            y={112}
            width={20}
            height={14}
            stroke="#4A3F36"
            strokeWidth={1.4}
            strokeLinejoin="round"
          />
        </G>
      </Svg>
      {BOULES.map((_, i) => (
        <BouleAnimee key={i} k={k} i={i} actif={actif} />
      ))}
      <EtoileAnimee k={k} actif={actif} />
      <Svg {...couche} style={StyleSheet.absoluteFill} pointerEvents="none">
        <Path
          d="M-4 16Q195 38 394 12"
          stroke="#4A3F36"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeOpacity={0.6}
        />
      </Svg>
      {FANIONS.map((_, i) => (
        <FanionAnime key={i} k={k} i={i} actif={actif} />
      ))}
      <Confettis k={k} actif={actif} />
    </View>
  );
}
