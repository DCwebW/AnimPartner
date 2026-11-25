import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle } from 'react-native-reanimated';
import Svg, { Circle, ClipPath, Defs, Ellipse, G, Path, Pattern, Rect } from 'react-native-svg';

import { useIdSvg } from '@/svg/useIdSvg';

import { HAUTEUR_BANDEAU, LARGEUR_BANDEAU } from './dimensions';
import {
  BALANCE_DEGRES,
  BALLONS,
  CONFETTIS,
  CONFETTIS_COUCHE,
  ETOILES,
  FEU_ETAPES,
  FEUX,
  HORLOGE,
  interpoler,
  SCINTILLEMENT,
} from './jourAn';
import { aller, entre } from './noel';
import { Piece } from './Piece';
import { useAnimationsActives, useBoucle } from './useBoucle';

// Scène du Jour de l'an : toits, clocher, ballons, guirlande, feux d'artifice et confettis.
// Reprise de design/propositions/02-jour-de-l-an/bandeau.html. Le décor est fixe (plusieurs
// couches Svg) ; chaque élément animé vit dans sa propre petite vue, déplacée par
// transformation et opacité sur le thread de l'interface : le décor ne se redessine jamais.
// Avec la réduction des animations du système, rien ne bouge (planche avec prefers-reduced-motion).

type Props = {
  /** Largeur affichée ; la hauteur suit en gardant les proportions de la planche. */
  largeur: number;
};

// ease-in-out CSS : cubic-bezier(.42, 0, .58, 1) ; ease-out CSS : cubic-bezier(0, 0, .58, 1).
const ease = Easing.bezier(0.42, 0, 0.58, 1).factory();
const easeOut = Easing.bezier(0, 0, 0.58, 1).factory();

const ENCRE = '#4A3F36';
const OR = '#F2C14E';
const ROSE = '#E8548C';

function EtoileAnimee({ k, i, actif }: { k: number; i: number; actif: boolean }) {
  const e = ETOILES[i]!;
  const phase = useBoucle(e.duree * 2, e.delai, actif);
  const style = useAnimatedStyle(() => {
    if (!actif) return {};
    const u = ease(aller(phase.value));
    return {
      opacity: entre(1, SCINTILLEMENT.opaciteFin, u),
      transform: [{ scale: entre(1, SCINTILLEMENT.echelleFin, u) }],
    };
  });
  const c = 7;
  return (
    <Piece k={k} x={e.x - c} y={e.y - c} l={2 * c} h={2 * c} origine={[c, c]} style={style}>
      <Path
        d={`M${e.x} ${e.y - 5}L${e.x + 1.5} ${e.y - 1.5}L${e.x + 5} ${e.y}L${e.x + 1.5} ${e.y + 1.5}L${e.x} ${e.y + 5}L${e.x - 1.5} ${e.y + 1.5}L${e.x - 5} ${e.y}L${e.x - 1.5} ${e.y - 1.5}Z`}
        fill="#FFF3C4"
      />
    </Piece>
  );
}

function FeuAnime({ k, i, actif }: { k: number; i: number; actif: boolean }) {
  const f = FEUX[i]!;
  const phase = useBoucle(f.duree, f.delai, actif);
  const style = useAnimatedStyle(() => {
    if (!actif) return {};
    const v = interpoler(FEU_ETAPES, phase.value, easeOut);
    return { opacity: v.opacite, transform: [{ scale: v.echelle }] };
  });
  const m = 46; // l'éclat s'étend jusqu'à 35 px du centre à l'échelle 1 ; marge pour 1,25
  return (
    <Piece k={k} x={f.x - m} y={f.y - m} l={2 * m} h={2 * m} origine={[m, m]} style={style}>
      {f.rayons.map(([d, cx, cy], j) => (
        <G key={j}>
          <Path d={d} stroke={f.couleurTrait} strokeWidth={2.4} strokeLinecap="round" />
          <Circle cx={cx} cy={cy} r={1.8} fill={f.couleurEtincelle} />
        </G>
      ))}
    </Piece>
  );
}

function HorlogeAnimee({ k, actif }: { k: number; actif: boolean }) {
  const phase = useBoucle(HORLOGE.duree * 2, HORLOGE.delai, actif);
  const style = useAnimatedStyle(() => {
    if (!actif) return {};
    const u = ease(aller(phase.value));
    return { transform: [{ scale: entre(1, HORLOGE.echelleFin, u) }] };
  });
  const c = 24;
  return (
    <Piece
      k={k}
      x={HORLOGE.x - c}
      y={HORLOGE.y - c}
      l={2 * c}
      h={2 * c}
      origine={[c, c]}
      style={style}
    >
      <Circle cx={HORLOGE.x} cy={HORLOGE.y} r={19} fill="#FFF8E6" />
      <Circle
        cx={HORLOGE.x}
        cy={HORLOGE.y}
        r={19}
        stroke={ENCRE}
        strokeWidth={1.6}
        strokeOpacity={0.7}
      />
    </Piece>
  );
}

function BallonAnime({ k, i, actif }: { k: number; i: number; actif: boolean }) {
  const b = BALLONS[i]!;
  const phase = useBoucle(b.duree * 2, b.delai, actif);
  const style = useAnimatedStyle(() => {
    if (!actif) return {};
    const u = ease(aller(phase.value));
    return { transform: [{ rotate: `${entre(-BALANCE_DEGRES, BALANCE_DEGRES, u)}deg` }] };
  });
  // Ballon centré en (b.x, b.y − 40), ficelle jusqu'en (b.x, b.y), origine au bout de la ficelle.
  const cy = b.y - 40;
  const demi = 24;
  const haut = 20; // marge au-dessus du ballon (ry 12,5)
  const hauteur = 40 + haut + 4;
  return (
    <Piece
      k={k}
      x={b.x - demi}
      y={cy - haut}
      l={2 * demi}
      h={hauteur}
      origine={[demi, haut + 40]}
      style={style}
    >
      <Path
        d={`M${b.x} ${cy + 13}Q${b.x - 5} ${cy + 26} ${b.x} ${b.y}`}
        stroke={ENCRE}
        strokeWidth={1.2}
        strokeOpacity={0.6}
        strokeLinecap="round"
      />
      <Ellipse cx={b.x} cy={cy} rx={10} ry={12.5} fill={b.couleur} />
      <Ellipse
        cx={b.x}
        cy={cy}
        rx={10}
        ry={12.5}
        stroke={ENCRE}
        strokeWidth={1.2}
        strokeOpacity={0.6}
      />
      <Path
        d={`M${b.x - 4} ${cy - 7}q-3 3-3 7`}
        stroke="#FFFFFF"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeOpacity={0.7}
      />
      <Path
        d={`M${b.x - 2.5} ${cy + 12.5}h5l-2.5 3z`}
        fill={b.couleur}
        stroke={ENCRE}
        strokeWidth={1}
        strokeOpacity={0.6}
        strokeLinejoin="round"
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
      testID="jour-an-confettis"
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

const MAISONS: readonly (readonly [string, string])[] = [
  ['M10 140V112L32 98L54 112V140Z', '#3B3F86'],
  ['M60 140V100L78 86L96 100V140Z', '#33377A'],
  ['M100 140V116L120 102L140 116V140Z', '#3B3F86'],
  ['M250 140V106L270 92L290 106V140Z', '#3B3F86'],
  ['M296 140V118L319 104L342 118V140Z', '#33377A'],
  ['M348 140V104L367 90L386 104V140Z', '#3B3F86'],
];

const FENETRES: readonly (readonly [number, number])[] = [
  [20, 118],
  [32, 118],
  [70, 108],
  [110, 122],
  [262, 112],
  [308, 124],
  [322, 124],
  [358, 112],
];

const GUIRLANDE: readonly (readonly [number, number, string])[] = [
  [14, 14.0, OR],
  [58, 19.5, ROSE],
  [102, 24.1, '#6FD3E8'],
  [146, 27.0, '#FFFFFF'],
  [190, 27.6, OR],
  [234, 25.8, ROSE],
  [278, 21.7, '#6FD3E8'],
  [322, 15.9, '#FFFFFF'],
  [366, 9.2, OR],
];

const SOL = 'M0 150c40-4 80 2 130-1 50-3 90 3 140 0 50-3 90 2 120 1v50H0z';
const LIGNE_SOL = 'M0 150c40-4 80 2 130-1 50-3 90 3 140 0 50-3 90 2 120 1';

export function BandeauJourAn({ largeur }: Props) {
  const p = useIdSvg('jour-an');
  const actif = useAnimationsActives();
  const k = largeur / LARGEUR_BANDEAU;
  const hauteur = (largeur * HAUTEUR_BANDEAU) / LARGEUR_BANDEAU;
  const couche = {
    width: largeur,
    height: hauteur,
    viewBox: `0 0 ${LARGEUR_BANDEAU} ${HAUTEUR_BANDEAU}`,
    fill: 'none' as const,
  };
  const masque = {
    accessibilityElementsHidden: true,
    importantForAccessibility: 'no-hide-descendants' as const,
  };

  return (
    <View
      style={{ width: largeur, height: hauteur, overflow: 'hidden' }}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {/* Couche 1 : ciel, derrière les étoiles et les feux. */}
      <Svg {...couche} {...masque} style={StyleSheet.absoluteFill} testID="bandeau-jour-an">
        <Defs>
          <Pattern id={`${p}-ciel-h`} width={10} height={3.6} patternUnits="userSpaceOnUse">
            <Path d="M-1 1.8h12" stroke="#4B4F96" strokeWidth={1.6} strokeLinecap="round" />
          </Pattern>
          <Pattern
            id={`${p}-ciel-d`}
            width={10}
            height={4}
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(38)"
          >
            <Path d="M-1 2h12" stroke="#5A5EA6" strokeWidth={1.5} strokeLinecap="round" />
          </Pattern>
        </Defs>
        <Rect width={390} height={200} fill="#2A2D62" />
        <Rect width={390} height={200} fill={`url(#${p}-ciel-h)`} opacity={0.4} />
        <Rect width={390} height={150} fill={`url(#${p}-ciel-d)`} opacity={0.3} />
      </Svg>
      {ETOILES.map((_, i) => (
        <EtoileAnimee key={`e${i}`} k={k} i={i} actif={actif} />
      ))}
      {FEUX.map((_, i) => (
        <FeuAnime key={`f${i}`} k={k} i={i} actif={actif} />
      ))}
      {/* Couche 2 : toits, fenêtres, clocher (derrière le cadran de l'horloge). */}
      <Svg {...couche} {...masque} style={StyleSheet.absoluteFill} pointerEvents="none">
        {MAISONS.map(([d, fond], i) => (
          <Path key={i} d={d} fill={fond} />
        ))}
        {FENETRES.map(([x, y], i) => (
          <Rect key={i} x={x} y={y} width={5} height={7} rx={1} fill={OR} opacity={0.9} />
        ))}
        <Path d="M158 150V84L195 60L232 84V150Z" fill="#454A9A" />
        <Path
          d="M158 150V84L195 60L232 84V150Z"
          stroke={ENCRE}
          strokeWidth={1.5}
          strokeLinejoin="round"
          strokeOpacity={0.6}
        />
        <Path d="M168 110h54" stroke="#2A2D62" strokeWidth={1.2} strokeOpacity={0.5} />
      </Svg>
      <HorlogeAnimee k={k} actif={actif} />
      {/* Couche 3 : aiguilles, sol enneigé. */}
      <Svg {...couche} {...masque} style={StyleSheet.absoluteFill} pointerEvents="none">
        <Defs>
          <Pattern id={`${p}-sol-h`} width={11} height={4.2} patternUnits="userSpaceOnUse">
            <Path d="M-1 2.1h13" stroke="#CBC6E6" strokeWidth={1.4} strokeLinecap="round" />
          </Pattern>
          <ClipPath id={`${p}-zone-sol`}>
            <Path d={SOL} />
          </ClipPath>
        </Defs>
        <Path
          d="M195 84v2.5M195 113.5V116M179 100h2.5M208.5 100H211"
          stroke={ENCRE}
          strokeWidth={1.6}
          strokeLinecap="round"
        />
        <Path d="M195 100V88M195 100V90" stroke={ENCRE} strokeWidth={2.4} strokeLinecap="round" />
        <Circle cx={195} cy={100} r={2} fill="#B0155A" />
        <Path d={SOL} fill="#F3EFFA" />
        <G clipPath={`url(#${p}-zone-sol)`}>
          <Rect y={148} width={390} height={52} fill={`url(#${p}-sol-h)`} opacity={0.4} />
        </G>
        <Path
          d={LIGNE_SOL}
          stroke={ENCRE}
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeOpacity={0.5}
        />
      </Svg>
      {BALLONS.map((_, i) => (
        <BallonAnime key={`b${i}`} k={k} i={i} actif={actif} />
      ))}
      {/* Couche 4 : guirlande de lumières. */}
      <Svg {...couche} {...masque} style={StyleSheet.absoluteFill} pointerEvents="none">
        <Path
          d="M-4 10Q195 34 394 8"
          stroke={ENCRE}
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeOpacity={0.6}
        />
        {GUIRLANDE.map(([cx, cy, fond], i) => (
          <Circle
            key={i}
            cx={cx}
            cy={cy}
            r={3.6}
            fill={fond}
            stroke={ENCRE}
            strokeWidth={1}
            strokeOpacity={0.6}
          />
        ))}
      </Svg>
      <Confettis k={k} actif={actif} />
    </View>
  );
}
