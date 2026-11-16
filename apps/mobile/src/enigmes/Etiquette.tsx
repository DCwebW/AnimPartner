import { formaterTrancheAge, type Enigme, type Palette } from '@animpartner/shared';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Svg, { Circle, ClipPath, Defs, G, Path, Pattern, Rect } from 'react-native-svg';

import { useIdSvg } from '@/svg/useIdSvg';
import { POLICES } from '@/theme/polices';

import { lierQuestion, taillesExplication, taillesQuestion } from './typographie';

export type Face = 'recto' | 'verso';

// L'étiquette a une hauteur fixe. La question et l'explication suivent la taille de
// texte du système dans la limite de la place (voir `typographie.ts`) ; les petits
// libellés grandissent jusqu'à ce plafond, la réponse (31 px) ne grandit pas.
const AGRANDISSEMENT_LIBELLES = 1.3;

// Dimensions et tracés de l'étiquette des maquettes du MVP (design/outils/generer_ecrans_mvp.py).
export const LARGEUR_ETIQUETTE = 290;
export const HAUTEUR_ETIQUETTE = 372;
const CORPS = 'M62 1.5H229L288 47V319Q288 327.5 279.5 327.5H10.5Q2 327.5 2 319V47Z';
const TIRETS = 'M67 14H224L275 53V310Q275 315 270 315H20Q15 315 15 310V53Z';

type Props = {
  enigme: Enigme;
  face: Face;
  palette: Palette;
};

/** L'étiquette à œillet, suspendue à sa ficelle : l'énigme au recto, la réponse au verso. */
export function Etiquette({ enigme, face, palette: p }: Props) {
  const verso = face === 'verso';
  const fond = verso ? p.verso : p.recto;
  const hachure = verso ? p.verso_hach : p.recto_hach;
  const opaciteHachure = verso ? p.verso_hach_op : p.recto_hach_op;
  const tirets = verso ? p.verso_tirets : p.recto_tirets;
  const ids = useIdSvg(`etq-${face}`);

  return (
    <View style={styles.etiquette}>
      <Svg
        width={LARGEUR_ETIQUETTE}
        height={HAUTEUR_ETIQUETTE}
        viewBox={`0 -42 ${LARGEUR_ETIQUETTE} ${HAUTEUR_ETIQUETTE}`}
        fill="none"
        style={StyleSheet.absoluteFill}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <Defs>
          <Pattern id={`${ids}-h`} width={10} height={4} patternUnits="userSpaceOnUse">
            <Path d="M-1 2h12" stroke={hachure} strokeWidth={1.4} strokeLinecap="round" />
          </Pattern>
          <Pattern
            id={`${ids}-d`}
            width={10}
            height={4.2}
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(-38)"
          >
            <Path d="M-1 2.1h12" stroke={hachure} strokeWidth={1.3} strokeLinecap="round" />
          </Pattern>
          <ClipPath id={`${ids}-zone`}>
            <Path d={CORPS} />
          </ClipPath>
        </Defs>
        <Path d={CORPS} fill={fond} />
        <G clipPath={`url(#${ids}-zone)`}>
          <Rect width={290} height={330} fill={`url(#${ids}-h)`} opacity={opaciteHachure} />
          <Rect
            width={290}
            height={120}
            fill={`url(#${ids}-d)`}
            opacity={Math.round(opaciteHachure * 0.8 * 1000) / 1000}
          />
        </G>
        <Path
          d={TIRETS}
          stroke={tirets}
          strokeWidth={1.3}
          strokeDasharray="5 5"
          strokeLinecap="round"
          strokeOpacity={0.38}
        />
        <Path
          d={CORPS}
          stroke={p.trait}
          strokeWidth={1.6}
          strokeLinejoin="round"
          strokeOpacity={p.trait_op}
        />
        <Path
          d={CORPS}
          transform="translate(1.2 1.5)"
          stroke={p.trait}
          strokeWidth={1}
          strokeLinejoin="round"
          strokeOpacity={Math.round(p.trait_op * 0.45 * 1000) / 1000}
        />
        <Circle cx={145} cy={34} r={13} stroke={p.oeillet} strokeWidth={3.4} />
        <Circle cx={145} cy={34} r={9} fill={p.feuille} />
        <Circle
          cx={145}
          cy={34}
          r={9}
          stroke={p.trait}
          strokeWidth={1.1}
          strokeOpacity={p.trait_op}
        />
        <Path
          d="M140 33C133 12 138-10 145-26M150 33C157 12 152-10 145-26"
          stroke={p.ficelle}
          strokeWidth={2.3}
          strokeLinecap="round"
        />
        <Path
          d="M145-27C139-33 130-36 120-38M145-27C151-34 160-38 172-39"
          stroke={p.ficelle}
          strokeWidth={2}
          strokeLinecap="round"
        />
        <Circle cx={145} cy={-27} r={3.4} fill={p.ficelle} />
      </Svg>

      <View style={styles.contenu}>
        {verso ? <Verso enigme={enigme} palette={p} /> : <Recto enigme={enigme} palette={p} />}
      </View>
    </View>
  );
}

function Recto({ enigme, palette: p }: { enigme: Enigme; palette: Palette }) {
  const { fontScale } = useWindowDimensions();
  return (
    <>
      <View style={styles.ligne}>
        <Text
          maxFontSizeMultiplier={AGRANDISSEMENT_LIBELLES}
          style={[styles.kicker, { color: p.recto_accent }]}
        >
          Énigme
        </Text>
        <Text
          maxFontSizeMultiplier={AGRANDISSEMENT_LIBELLES}
          style={[styles.puce, { color: p.puce_texte, backgroundColor: p.puce_fond }]}
          accessibilityLabel={`De ${enigme.ageMin} à ${enigme.ageMax} ans`}
        >
          {formaterTrancheAge(enigme.ageMin, enigme.ageMax)}
        </Text>
      </View>
      <Text
        style={[styles.question, taillesQuestion(enigme.question, fontScale), { color: p.encre }]}
      >
        {lierQuestion(enigme.question)}
      </Text>
    </>
  );
}

function Verso({ enigme, palette: p }: { enigme: Enigme; palette: Palette }) {
  const { fontScale } = useWindowDimensions();
  return (
    <>
      <Text
        maxFontSizeMultiplier={AGRANDISSEMENT_LIBELLES}
        style={[styles.kicker, { color: p.verso_kicker }]}
      >
        Réponse
      </Text>
      <Text allowFontScaling={false} style={[styles.reponse, { color: p.verso_texte }]}>
        {enigme.reponse}
      </Text>
      <Text
        style={[
          styles.explication,
          taillesExplication(enigme.explication, fontScale),
          { color: p.verso_expl },
        ]}
      >
        {enigme.explication}
      </Text>
    </>
  );
}

const styles = StyleSheet.create({
  etiquette: { width: LARGEUR_ETIQUETTE, height: HAUTEUR_ETIQUETTE },
  contenu: {
    position: 'absolute',
    left: 32,
    right: 32,
    top: 104,
    bottom: 34,
    justifyContent: 'center',
    gap: 14,
  },
  ligne: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  kicker: {
    fontFamily: POLICES.nunito800,
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  puce: {
    fontFamily: POLICES.nunito700,
    fontSize: 12,
    borderRadius: 999,
    paddingVertical: 3,
    paddingHorizontal: 10,
    overflow: 'hidden',
  },
  question: { fontFamily: POLICES.fraunces600 },
  reponse: { fontFamily: POLICES.fraunces700, fontSize: 31, lineHeight: 37 },
  explication: { fontFamily: POLICES.nunito400 },
});
