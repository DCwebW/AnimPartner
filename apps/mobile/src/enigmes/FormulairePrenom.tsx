import { PRENOM_MAX, nettoyerPrenom, type Palette } from '@animpartner/shared';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { POLICES } from '@/theme/polices';

type Props = {
  palette: Palette;
  /** Reçoit le prénom déjà nettoyé, jamais vide. */
  onValider: (prenom: string) => void;
  onPlusTard: () => void;
};

/** Question posée à la première ouverture. Pas de maquette : design system et palette du thème. */
export function FormulairePrenom({ palette: p, onValider, onPlusTard }: Props) {
  const insets = useSafeAreaInsets();
  const [saisi, setSaisi] = useState('');
  const valide = nettoyerPrenom(saisi) !== '';
  const valider = () => {
    if (valide) onValider(nettoyerPrenom(saisi));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: p.fond_scene }}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.contenu,
          { paddingTop: 24 + insets.top, paddingBottom: 24 + insets.bottom },
        ]}
      >
        <View
          style={[
            styles.carte,
            { backgroundColor: p.feuille, boxShadow: `0px 6px 24px ${p.ombre}` },
          ]}
        >
          <Text accessibilityRole="header" style={[styles.titre, { color: p.encre }]}>
            Bienvenue !
          </Text>
          <Text style={[styles.aide, { color: p.encre2 }]}>
            Comment t’appelles-tu ? Ton prénom reste sur ce téléphone.
          </Text>
          <TextInput
            accessibilityLabel="Ton prénom"
            placeholder="Ton prénom"
            placeholderTextColor={p.encre2}
            value={saisi}
            onChangeText={setSaisi}
            maxLength={PRENOM_MAX}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={valider}
            style={[
              styles.champ,
              { color: p.encre, backgroundColor: p.recto, borderColor: p.engrenage_bord },
            ]}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="C’est parti"
            accessibilityState={{ disabled: !valide }}
            disabled={!valide}
            onPress={valider}
            style={({ pressed }) => [
              styles.principal,
              {
                backgroundColor: p.bouton,
                borderColor: p.bord_bouton,
                boxShadow: `1px 1.5px 0px ${p.ombre_bouton}`,
                opacity: !valide ? 0.5 : pressed ? 0.85 : 1,
              },
            ]}
          >
            <Text style={[styles.textePrincipal, { color: p.bouton_texte }]}>C’est parti</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Plus tard"
            onPress={onPlusTard}
            style={({ pressed }) => [styles.secondaire, { opacity: pressed ? 0.6 : 1 }]}
          >
            <Text style={[styles.texteSecondaire, { color: p.lien }]}>Plus tard</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  contenu: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 20 },
  carte: { borderRadius: 26, padding: 24, gap: 14 },
  titre: { fontFamily: POLICES.fraunces700, fontSize: 25 },
  aide: { fontFamily: POLICES.nunito400, fontSize: 15 },
  champ: {
    minHeight: 48,
    borderWidth: 1.4,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontFamily: POLICES.nunito600,
    fontSize: 16,
  },
  principal: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.4,
    borderRadius: 999,
  },
  textePrincipal: { fontFamily: POLICES.nunito800, fontSize: 16 },
  secondaire: { minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  texteSecondaire: { fontFamily: POLICES.nunito700, fontSize: 15 },
});
