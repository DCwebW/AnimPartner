// Palettes des quatre thèmes du MVP, reprises à l'identique du dictionnaire THEMES
// de design/outils/generer_ecrans_mvp.py (sans le contenu d'exemple : date, météo,
// énigme). Les noms de clés sont ceux de THEMES, pour que les palettes des thèmes
// suivants (design/propositions/<N°>-<thème>/palette.json) s'ajoutent telles quelles.
// Fichier généré une fois depuis THEMES ; les valeurs se corrigent dans le design.

export type CleTheme = 'beauTemps' | 'nuit' | 'hiver' | 'automne';

export type Palette = {
  key: 'Vent' | 'Nuit' | 'Hiver' | 'Automne';
  engrenage_fond: string;
  engrenage_bord: string;
  fond_scene: string;
  salut: 'Bonjour' | 'Bonsoir';
  icone: 'vent' | 'lune' | 'neige' | 'eclaircie';
  icone_c: string;
  feuille: string;
  hach1: string;
  op1: number;
  hach2: string;
  op2: number;
  ombre: string;
  encre: string;
  encre2: string;
  poignee: string;
  trait: string;
  trait_op: number;
  ficelle: string;
  oeillet: string;
  recto: string;
  recto_hach: string;
  recto_hach_op: number;
  recto_tirets: string;
  recto_accent: string;
  puce_fond: string;
  puce_texte: string;
  verso: string;
  verso_hach: string;
  verso_hach_op: number;
  verso_tirets: string;
  verso_texte: string;
  verso_kicker: string;
  verso_expl: string;
  bouton: string;
  bouton_texte: string;
  bord_bouton: string;
  ombre_bouton: string;
  lien: string;
};

export const PALETTES: Record<CleTheme, Palette> = {
  beauTemps: {
    key: 'Vent',
    engrenage_fond: '#FFFFFF',
    engrenage_bord: 'rgba(74, 63, 54, 0.4)',
    fond_scene: '#CFE9F4',
    salut: 'Bonjour',
    icone: 'vent',
    icone_c: '#0E6E99',
    feuille: '#FEF3D4',
    hach1: '#C9A227',
    op1: 0.13,
    hach2: '#D4A93A',
    op2: 0.1,
    ombre: 'rgba(35, 32, 30, 0.18)',
    encre: '#23201E',
    encre2: '#6B625B',
    poignee: 'rgba(74, 63, 54, 0.3)',
    trait: '#4A3F36',
    trait_op: 0.55,
    ficelle: '#9C7A4E',
    oeillet: '#B89B5E',
    recto: '#FFFFFF',
    recto_hach: '#8DC3DD',
    recto_hach_op: 0.14,
    recto_tirets: '#0E6E99',
    recto_accent: '#0E6E99',
    puce_fond: '#E3F1F8',
    puce_texte: '#0E5A7D',
    verso: '#FBD23E',
    verso_hach: '#EFA81A',
    verso_hach_op: 0.32,
    verso_tirets: '#8A6500',
    verso_texte: '#23201E',
    verso_kicker: '#6E5100',
    verso_expl: '#3E3215',
    bouton: '#0E6E99',
    bouton_texte: '#FFFFFF',
    bord_bouton: 'rgba(74, 63, 54, 0.4)',
    ombre_bouton: 'rgba(74, 63, 54, 0.18)',
    lien: '#0E5A7D',
  },
  nuit: {
    key: 'Nuit',
    engrenage_fond: '#3A3346',
    engrenage_bord: 'rgba(244, 239, 230, 0.28)',
    fond_scene: '#1F2340',
    salut: 'Bonsoir',
    icone: 'lune',
    icone_c: '#E0CE92',
    feuille: '#262231',
    hach1: '#D9B86A',
    op1: 0.07,
    hach2: '#B9A7D4',
    op2: 0.06,
    ombre: 'rgba(0, 0, 0, 0.45)',
    encre: '#F4EFE6',
    encre2: '#B3AAB8',
    poignee: 'rgba(244, 239, 230, 0.3)',
    trait: '#F6EDD4',
    trait_op: 0.3,
    ficelle: '#B9A27A',
    oeillet: '#8A7A55',
    recto: '#322C3E',
    recto_hach: '#8A93B8',
    recto_hach_op: 0.1,
    recto_tirets: '#E0CE92',
    recto_accent: '#E0CE92',
    puce_fond: '#3D3650',
    puce_texte: '#E8DDB5',
    verso: '#F3E7C4',
    verso_hach: '#D7C593',
    verso_hach_op: 0.4,
    verso_tirets: '#6B5A2A',
    verso_texte: '#1F2340',
    verso_kicker: '#5C4C22',
    verso_expl: '#34304A',
    bouton: '#F3E7C4',
    bouton_texte: '#1F2340',
    bord_bouton: 'rgba(0, 0, 0, 0.3)',
    ombre_bouton: 'rgba(0, 0, 0, 0.4)',
    lien: '#E0CE92',
  },
  hiver: {
    key: 'Hiver',
    engrenage_fond: '#FFFFFF',
    engrenage_bord: 'rgba(74, 63, 54, 0.4)',
    fond_scene: '#D3DEE7',
    salut: 'Bonjour',
    icone: 'neige',
    icone_c: '#4E7896',
    feuille: '#EEF3F7',
    hach1: '#9DB3C4',
    op1: 0.14,
    hach2: '#B8C9D6',
    op2: 0.12,
    ombre: 'rgba(35, 45, 55, 0.18)',
    encre: '#23201E',
    encre2: '#55616B',
    poignee: 'rgba(74, 63, 54, 0.28)',
    trait: '#4A3F36',
    trait_op: 0.5,
    ficelle: '#8A4F2D',
    oeillet: '#A8683D',
    recto: '#FFFFFF',
    recto_hach: '#B8C9D6',
    recto_hach_op: 0.2,
    recto_tirets: '#3A6A55',
    recto_accent: '#2F5D46',
    puce_fond: '#E3EEE8',
    puce_texte: '#2F5D46',
    verso: '#3A6A55',
    verso_hach: '#2F5D46',
    verso_hach_op: 0.45,
    verso_tirets: '#FFFFFF',
    verso_texte: '#FFFFFF',
    verso_kicker: '#D5E8DD',
    verso_expl: '#EAF3EE',
    bouton: '#3A6A55',
    bouton_texte: '#FFFFFF',
    bord_bouton: 'rgba(74, 63, 54, 0.4)',
    ombre_bouton: 'rgba(74, 63, 54, 0.18)',
    lien: '#2F5D46',
  },
  automne: {
    key: 'Automne',
    engrenage_fond: '#FFFBF3',
    engrenage_bord: 'rgba(74, 63, 54, 0.4)',
    fond_scene: '#E6EEEE',
    salut: 'Bonjour',
    icone: 'eclaircie',
    icone_c: '#C2621F',
    feuille: '#FBEAD5',
    hach1: '#D9893A',
    op1: 0.13,
    hach2: '#C9A227',
    op2: 0.1,
    ombre: 'rgba(35, 32, 30, 0.18)',
    encre: '#23201E',
    encre2: '#6E5A4A',
    poignee: 'rgba(74, 63, 54, 0.3)',
    trait: '#4A3F36',
    trait_op: 0.55,
    ficelle: '#7A5230',
    oeillet: '#B07A3E',
    recto: '#FFFBF3',
    recto_hach: '#F2B437',
    recto_hach_op: 0.16,
    recto_tirets: '#B8461F',
    recto_accent: '#A63E1B',
    puce_fond: '#FBE1CF',
    puce_texte: '#8E3216',
    verso: '#C8432B',
    verso_hach: '#8E2716',
    verso_hach_op: 0.3,
    verso_tirets: '#FFFFFF',
    verso_texte: '#FFFFFF',
    verso_kicker: '#FFE0C8',
    verso_expl: '#FFF0E6',
    bouton: '#B8461F',
    bouton_texte: '#FFFFFF',
    bord_bouton: 'rgba(74, 63, 54, 0.4)',
    ombre_bouton: 'rgba(74, 63, 54, 0.18)',
    lien: '#9E3A18',
  },
};

/** Clés attendues dans chaque palette, dans l'ordre de THEMES. */
export const CLES_PALETTE = [
  'key',
  'engrenage_fond',
  'engrenage_bord',
  'fond_scene',
  'salut',
  'icone',
  'icone_c',
  'feuille',
  'hach1',
  'op1',
  'hach2',
  'op2',
  'ombre',
  'encre',
  'encre2',
  'poignee',
  'trait',
  'trait_op',
  'ficelle',
  'oeillet',
  'recto',
  'recto_hach',
  'recto_hach_op',
  'recto_tirets',
  'recto_accent',
  'puce_fond',
  'puce_texte',
  'verso',
  'verso_hach',
  'verso_hach_op',
  'verso_tirets',
  'verso_texte',
  'verso_kicker',
  'verso_expl',
  'bouton',
  'bouton_texte',
  'bord_bouton',
  'ombre_bouton',
  'lien',
] as const satisfies readonly (keyof Palette)[];
