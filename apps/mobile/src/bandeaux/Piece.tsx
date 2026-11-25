import type { ReactNode } from 'react';
import Animated, { type useAnimatedStyle } from 'react-native-reanimated';
import Svg from 'react-native-svg';

/**
 * Une vue animée qui porte un petit dessin placé aux coordonnées du viewBox 390 × 200.
 * `k` est l'échelle (largeur affichée / 390). Seule cette petite vue bouge : le décor ne se
 * redessine pas.
 */
export function Piece({
  k,
  x,
  y,
  l,
  h,
  origine,
  style,
  children,
  testID,
}: {
  k: number;
  x: number;
  y: number;
  l: number;
  h: number;
  /** Point d'origine des rotations et de l'échelle, en unités du viewBox, dans la pièce. */
  origine: [number, number];
  style: ReturnType<typeof useAnimatedStyle> | undefined;
  children: ReactNode;
  testID?: string;
}) {
  return (
    <Animated.View
      pointerEvents="none"
      testID={testID}
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
