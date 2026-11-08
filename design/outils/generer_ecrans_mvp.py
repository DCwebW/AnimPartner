# Génère les 8 écrans MVP (énigme / réponse) pour chaque bandeau animé.
#
# Chaque écran reprend la scène animée de sa planche d'étude (VentBeauTemps,
# NuitAnimee, HiverNeige, AutomneLac) en renommant ses identifiants, puis pose la
# feuille relevée à 85 % et l'étiquette. Les couleurs de chaque bandeau sont dans
# THEMES. Usage, depuis la racine du dépôt :
#
#   python design/outils/generer_ecrans_mvp.py design/canvas design/canvas
#
# Les fichiers produits doivent ensuite être republiés sur le canevas.
import re, sys, os

SRC = sys.argv[1]   # dossier contenant les planches d'étude des bandeaux
OUT = sys.argv[2]   # dossier project/ de sortie

def extract(name, prefix):
    html = open(os.path.join(SRC, name), encoding='utf-8').read()
    style = re.search(r'<style>(.*?)</style>', html, re.S).group(1)
    # On garde uniquement les règles d'animation (après la ligne des liens)
    style = style.split('a:hover { color: #9E3417; }', 1)[1]
    svg = re.search(r'(<svg width="390" height="200".*?</svg>)', html, re.S).group(1)
    old = {'VentBeauTemps.dc.html': 'vt', 'NuitAnimee.dc.html': 'na',
           'HiverNeige.dc.html': 'hv', 'AutomneLac.dc.html': 'au'}[name]
    rx = re.compile(r'(?<![A-Za-z0-9])' + old + '-')
    return rx.sub(prefix + '-', style).strip(), rx.sub(prefix + '-', svg)

ICONS = {
    'vent': '<path d="M3 8.5h10a3 3 0 1 0-3-3"></path><path d="M3 12.5h14.5a3 3 0 1 1-3 3"></path><path d="M3 16.5h6.5"></path>',
    'lune': '<path d="M19.5 14.5A8 8 0 019 4.6a8 8 0 1010.5 9.9z"></path>',
    'neige': '<path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9M9.5 4.5L12 7l2.5-2.5M9.5 19.5L12 17l2.5 2.5"></path>',
    'eclaircie': '<circle cx="9" cy="9" r="3.5"></circle><path d="M9 2.5V4M2.5 9H4M4.4 4.4l1 1M13.6 4.4l-1 1"></path><path d="M8 20.5h9a3.5 3.5 0 0 0 0-7 5 5 0 0 0-9.4 1.6A2.8 2.8 0 0 0 8 20.5z"></path>',
}
ENGRENAGE = '<path d="M18.88 9.87 L21.46 10.38 L21.46 13.62 L18.88 14.13 L18.37 15.36 L19.84 17.54 L17.54 19.84 L15.36 18.37 L14.13 18.88 L13.62 21.46 L10.38 21.46 L9.87 18.88 L8.64 18.37 L6.46 19.84 L4.16 17.54 L5.63 15.36 L5.12 14.13 L2.54 13.62 L2.54 10.38 L5.12 9.87 L5.63 8.64 L4.16 6.46 L6.46 4.16 L8.64 5.63 L9.87 5.12 L10.38 2.54 L13.62 2.54 L14.13 5.12 L15.36 5.63 L17.54 4.16 L19.84 6.46 L18.37 8.64Z" stroke-width="1.9"></path><circle cx="12" cy="12" r="3" stroke-width="1.9"></circle>'
DE = '<rect x="4" y="4" width="16" height="16" rx="4.5"></rect><circle cx="9" cy="9" r="1.3" fill="currentColor" stroke="none"></circle><circle cx="15" cy="9" r="1.3" fill="currentColor" stroke="none"></circle><circle cx="9" cy="15" r="1.3" fill="currentColor" stroke="none"></circle><circle cx="15" cy="15" r="1.3" fill="currentColor" stroke="none"></circle>'
RETOURNER = '<path d="M4.5 11.5a7.5 7.5 0 0 1 13-4.6l2 2"></path><path d="M19.5 4.5v4.4h-4.4"></path><path d="M19.5 12.5a7.5 7.5 0 0 1-13 4.6l-2-2"></path><path d="M4.5 19.5v-4.4h4.4"></path>'

THEMES = [
  dict(key='Vent', engrenage_fond='#FFFFFF', engrenage_bord='rgba(74, 63, 54, 0.4)', src='VentBeauTemps.dc.html', titre='Beau temps', fond_scene='#CFE9F4',
       salut='Bonjour', date='Mercredi 15 avril', meteo='Soleil et vent, 17 °C', icone='vent', icone_c='#0E6E99',
       feuille='#FEF3D4', hach1='#C9A227', op1=0.13, hach2='#D4A93A', op2=0.1, ombre='rgba(35, 32, 30, 0.18)',
       encre='#23201E', encre2='#6B625B', poignee='rgba(74, 63, 54, 0.3)',
       trait='#4A3F36', trait_op=0.55, ficelle='#9C7A4E', oeillet='#B89B5E',
       recto='#FFFFFF', recto_hach='#8DC3DD', recto_hach_op=0.14, recto_tirets='#0E6E99', recto_accent='#0E6E99',
       puce_fond='#E3F1F8', puce_texte='#0E5A7D',
       verso='#FBD23E', verso_hach='#EFA81A', verso_hach_op=0.32, verso_tirets='#8A6500', verso_texte='#23201E', verso_kicker='#6E5100', verso_expl='#3E3215',
       bouton='#0E6E99', bouton_texte='#FFFFFF', bord_bouton='rgba(74, 63, 54, 0.4)', ombre_bouton='rgba(74, 63, 54, 0.18)', lien='#0E5A7D',
       age='7 – 10 ans',
       enigme="J'ai un lit mais je ne dors jamais, je cours mais je n'ai pas de jambes. Qui suis-je ?",
       reponse='La rivière',
       expl="Son lit, c'est le creux où coule l'eau, et elle « court » jusqu'à la mer."),
  dict(key='Nuit', engrenage_fond='#3A3346', engrenage_bord='rgba(244, 239, 230, 0.28)', src='NuitAnimee.dc.html', titre='Nuit', fond_scene='#1F2340',
       salut='Bonsoir', date='Samedi 7 novembre', meteo='Nuit claire, 7 °C', icone='lune', icone_c='#E0CE92',
       feuille='#262231', hach1='#D9B86A', op1=0.07, hach2='#B9A7D4', op2=0.06, ombre='rgba(0, 0, 0, 0.45)',
       encre='#F4EFE6', encre2='#B3AAB8', poignee='rgba(244, 239, 230, 0.3)',
       trait='#F6EDD4', trait_op=0.3, ficelle='#B9A27A', oeillet='#8A7A55',
       recto='#322C3E', recto_hach='#8A93B8', recto_hach_op=0.1, recto_tirets='#E0CE92', recto_accent='#E0CE92',
       puce_fond='#3D3650', puce_texte='#E8DDB5',
       verso='#F3E7C4', verso_hach='#D7C593', verso_hach_op=0.4, verso_tirets='#6B5A2A', verso_texte='#1F2340', verso_kicker='#5C4C22', verso_expl='#34304A',
       bouton='#F3E7C4', bouton_texte='#1F2340', bord_bouton='rgba(0, 0, 0, 0.3)', ombre_bouton='rgba(0, 0, 0, 0.4)', lien='#E0CE92',
       age='6 – 9 ans',
       enigme="Plus il y en a, moins on y voit. Qui suis-je ?",
       reponse='Le noir',
       expl="Plus il fait noir, moins on distingue ce qui nous entoure. Les étoiles, elles, en profitent pour briller."),
  dict(key='Hiver', engrenage_fond='#FFFFFF', engrenage_bord='rgba(74, 63, 54, 0.4)', src='HiverNeige.dc.html', titre='Hiver', fond_scene='#D3DEE7',
       salut='Bonjour', date='Lundi 12 janvier', meteo='Neige, −2 °C', icone='neige', icone_c='#4E7896',
       feuille='#EEF3F7', hach1='#9DB3C4', op1=0.14, hach2='#B8C9D6', op2=0.12, ombre='rgba(35, 45, 55, 0.18)',
       encre='#23201E', encre2='#55616B', poignee='rgba(74, 63, 54, 0.28)',
       trait='#4A3F36', trait_op=0.5, ficelle='#8A4F2D', oeillet='#A8683D',
       recto='#FFFFFF', recto_hach='#B8C9D6', recto_hach_op=0.2, recto_tirets='#3A6A55', recto_accent='#2F5D46',
       puce_fond='#E3EEE8', puce_texte='#2F5D46',
       verso='#3A6A55', verso_hach='#2F5D46', verso_hach_op=0.45, verso_tirets='#FFFFFF', verso_texte='#FFFFFF', verso_kicker='#D5E8DD', verso_expl='#EAF3EE',
       bouton='#3A6A55', bouton_texte='#FFFFFF', bord_bouton='rgba(74, 63, 54, 0.4)', ombre_bouton='rgba(74, 63, 54, 0.18)', lien='#2F5D46',
       age='4 – 7 ans',
       enigme="Je tombe du ciel sans jamais me faire mal, et je disparais dès qu'on me serre dans la main. Qui suis-je ?",
       reponse='Le flocon de neige',
       expl="Il est si léger qu'il se pose en douceur, et la chaleur de la main le fait fondre."),
  dict(key='Automne', engrenage_fond='#FFFBF3', engrenage_bord='rgba(74, 63, 54, 0.4)', src='AutomneLac.dc.html', titre='Automne', fond_scene='#E6EEEE',
       salut='Bonjour', date='Dimanche 8 novembre', meteo='Éclaircies, 12 °C', icone='eclaircie', icone_c='#C2621F',
       feuille='#FBEAD5', hach1='#D9893A', op1=0.13, hach2='#C9A227', op2=0.1, ombre='rgba(35, 32, 30, 0.18)',
       encre='#23201E', encre2='#6E5A4A', poignee='rgba(74, 63, 54, 0.3)',
       trait='#4A3F36', trait_op=0.55, ficelle='#7A5230', oeillet='#B07A3E',
       recto='#FFFBF3', recto_hach='#F2B437', recto_hach_op=0.16, recto_tirets='#B8461F', recto_accent='#A63E1B',
       puce_fond='#FBE1CF', puce_texte='#8E3216',
       verso='#C8432B', verso_hach='#8E2716', verso_hach_op=0.3, verso_tirets='#FFFFFF', verso_texte='#FFFFFF', verso_kicker='#FFE0C8', verso_expl='#FFF0E6',
       bouton='#B8461F', bouton_texte='#FFFFFF', bord_bouton='rgba(74, 63, 54, 0.4)', ombre_bouton='rgba(74, 63, 54, 0.18)', lien='#9E3A18',
       age='4 – 7 ans',
       enigme="Verte au printemps, rouge en automne, je finis par tomber sans faire de bruit. Qui suis-je ?",
       reponse="La feuille d'arbre",
       expl="En automne, les feuilles changent de couleur puis se détachent des branches, une à une."),
]

CORPS = "M62 1.5H229L288 47V319Q288 327.5 279.5 327.5H10.5Q2 327.5 2 319V47Z"
TIRETS = "M67 14H224L275 53V310Q275 315 270 315H20Q15 315 15 310V53Z"

def fr(x):
    return x.replace(' ?', '&nbsp;?').replace('« ', '«&nbsp;').replace(' »', '&nbsp;»').replace('Qui suis-je&nbsp;?', '<span style="white-space: nowrap">Qui suis-je&nbsp;?</span>')

def etiquette(t, p, face):
    t = dict(t, enigme=fr(t['enigme']), expl=fr(t['expl']))
    verso = face == 'reponse'
    fond = t['verso'] if verso else t['recto']
    hach = t['verso_hach'] if verso else t['recto_hach']
    hach_op = t['verso_hach_op'] if verso else t['recto_hach_op']
    tirets = t['verso_tirets'] if verso else t['recto_tirets']
    angle = '2deg' if verso else '-2deg'
    if verso:
        contenu = f'''
        <span style="font-size: 12px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: {t['verso_kicker']}">Réponse</span>
        <span style="font-family: 'Fraunces', Georgia, serif; font-size: 31px; line-height: 37px; font-weight: 700; color: {t['verso_texte']}">{t['reponse']}</span>
        <span style="font-size: 15px; line-height: 22px; color: {t['verso_expl']}">{t['expl']}</span>'''
        label = f"Réponse : {t['reponse']}"
    else:
        contenu = f'''
        <span style="display: flex; align-items: center; justify-content: space-between; gap: 8px">
          <span style="font-size: 12px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: {t['recto_accent']}">Énigme</span>
          <span style="font-size: 12px; font-weight: 700; color: {t['puce_texte']}; background: {t['puce_fond']}; border-radius: 999px; padding: 3px 10px">{t['age']}</span>
        </span>
        <span style="font-family: 'Fraunces', Georgia, serif; font-size: 23px; line-height: 31px; font-weight: 600; color: {t['encre'] if t['key'] != 'Nuit' else '#F4EFE6'}">{t['enigme']}</span>'''
        label = "Énigme"
    return f'''
      <div role="group" aria-label="{label}" style="position: relative; width: 290px; height: 372px; flex: 0 0 auto; align-self: center; transform: rotate({angle}) scale(1.1)">
        <svg width="290" height="372" viewBox="0 -42 290 372" fill="none" aria-hidden="true" style="position: absolute; left: 0; top: 0">
          <defs>
            <pattern id="{p}-etq-h" width="10" height="4" patternUnits="userSpaceOnUse">
              <path d="M-1 2h12" stroke="{hach}" stroke-width="1.4" stroke-linecap="round"></path>
            </pattern>
            <pattern id="{p}-etq-d" width="10" height="4.2" patternUnits="userSpaceOnUse" patternTransform="rotate(-38)">
              <path d="M-1 2.1h12" stroke="{hach}" stroke-width="1.3" stroke-linecap="round"></path>
            </pattern>
            <clipPath id="{p}-etq-zone"><path d="{CORPS}"></path></clipPath>
          </defs>
          <path d="{CORPS}" fill="{fond}"></path>
          <g clip-path="url(#{p}-etq-zone)">
            <rect width="290" height="330" fill="url(#{p}-etq-h)" opacity="{hach_op}"></rect>
            <rect width="290" height="120" fill="url(#{p}-etq-d)" opacity="{round(hach_op * 0.8, 3)}"></rect>
          </g>
          <path d="{TIRETS}" stroke="{tirets}" stroke-width="1.3" stroke-dasharray="5 5" stroke-linecap="round" stroke-opacity="0.38"></path>
          <path d="{CORPS}" stroke="{t['trait']}" stroke-width="1.6" stroke-linejoin="round" stroke-opacity="{t['trait_op']}"></path>
          <path d="{CORPS}" transform="translate(1.2 1.5)" stroke="{t['trait']}" stroke-width="1" stroke-linejoin="round" stroke-opacity="{round(t['trait_op'] * 0.45, 3)}"></path>
          <circle cx="145" cy="34" r="13" stroke="{t['oeillet']}" stroke-width="3.4"></circle>
          <circle cx="145" cy="34" r="9" fill="{t['feuille']}"></circle>
          <circle cx="145" cy="34" r="9" stroke="{t['trait']}" stroke-width="1.1" stroke-opacity="{t['trait_op']}"></circle>
          <path d="M140 33C133 12 138-10 145-26M150 33C157 12 152-10 145-26" stroke="{t['ficelle']}" stroke-width="2.3" stroke-linecap="round"></path>
          <path d="M145-27C139-33 130-36 120-38M145-27C151-34 160-38 172-39" stroke="{t['ficelle']}" stroke-width="2" stroke-linecap="round"></path>
          <circle cx="145" cy="-27" r="3.4" fill="{t['ficelle']}"></circle>
        </svg>
        <div style="position: absolute; left: 32px; right: 32px; top: 104px; bottom: 34px; display: flex; flex-direction: column; justify-content: center; gap: 14px">{contenu}
        </div>
      </div>'''

def bouton_principal(t, texte, icone, href=None):
    style = f"min-height: 52px; display: flex; align-items: center; justify-content: center; gap: 10px; text-decoration: none; font: inherit; font-size: 16px; font-weight: 800; color: {t['bouton_texte']}; background: {t['bouton']}; border: 1.4px solid {t['bord_bouton']}; border-radius: 999px; box-shadow: 1px 1.5px 0 {t['ombre_bouton']}; cursor: pointer"
    svg = f'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{icone}</svg>'
    if href:
        return f'<a href="{href}" style="{style}">{svg}{texte}</a>'
    return f'<button type="button" style="{style}">{svg}{texte}</button>'

def bouton_second(t, texte, icone, href=None):
    style = f"min-height: 48px; display: flex; align-items: center; justify-content: center; gap: 8px; text-decoration: none; font: inherit; font-size: 15px; font-weight: 700; color: {t['lien']}; background: transparent; border: 0; cursor: pointer"
    svg = f'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{icone}</svg>'
    if href:
        return f'<a href="{href}" style="{style}">{svg}{texte}</a>'
    return f'<button type="button" style="{style}">{svg}{texte}</button>'

def ecran(t, face):
    key = t['key']
    p = 'm' + key[:2].lower() + ('r' if face == 'reponse' else 'e')
    anim, scene = extract(t['src'], p)
    recto_file = f'Mvp{key}Enigme.dc.html'
    verso_file = f'Mvp{key}Reponse.dc.html'
    if face == 'enigme':
        actions = bouton_principal(t, 'Voir la réponse', RETOURNER, verso_file) + '\n        ' + bouton_second(t, 'Une autre énigme', DE)
        titre_doc = f"AnimPartner — MVP {t['titre']}, énigme"
    else:
        actions = bouton_principal(t, 'Une autre énigme', DE) + '\n        ' + bouton_second(t, "Revoir l'énigme", RETOURNER, recto_file)
        titre_doc = f"AnimPartner — MVP {t['titre']}, réponse"
    return f'''<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>{titre_doc}</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Nunito+Sans:wght@400;600;700;800&display=swap">
<style>
body {{ margin: 0; font-family: 'Nunito Sans', system-ui, sans-serif; color: #23201E; }}
a {{ color: {t['lien']}; }} a:hover {{ color: {t['lien']}; }}

{anim}
</style>
</helmet>

<div style="width: 390px; height: 844px; box-sizing: border-box; background: {t['fond_scene']}; display: flex; flex-direction: column; overflow: hidden">

  <div style="flex: 0 0 auto; height: 187px; overflow: hidden">
    {scene}
  </div>

  <section aria-label="Énigme du moment" style="position: relative; flex: 1 1 auto; min-height: 0; margin-top: -60px; background: {t['feuille']}; border-radius: 30px 26px 0 0; box-shadow: 0 -10px 30px {t['ombre']}; overflow: hidden">

    <svg width="390" height="717" viewBox="0 0 390 717" fill="none" aria-hidden="true" style="position: absolute; left: 0; top: 0; z-index: 0">
      <defs>
        <pattern id="{p}-papier-h" width="11" height="4.4" patternUnits="userSpaceOnUse">
          <path d="M-1 2.2h13" stroke="{t['hach1']}" stroke-width="1.4" stroke-linecap="round"></path>
        </pattern>
        <pattern id="{p}-papier-d" width="11" height="4.6" patternUnits="userSpaceOnUse" patternTransform="rotate(36)">
          <path d="M-1 2.3h13" stroke="{t['hach2']}" stroke-width="1.3" stroke-linecap="round"></path>
        </pattern>
      </defs>
      <rect width="390" height="717" fill="url(#{p}-papier-h)" opacity="{t['op1']}"></rect>
      <rect width="390" height="717" fill="url(#{p}-papier-d)" opacity="{t['op2']}"></rect>
    </svg>

    <div style="position: relative; z-index: 1; height: 100%; box-sizing: border-box; padding: 30px 20px 26px; display: flex; flex-direction: column; gap: 12px">

      <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px">
        <div style="display: flex; flex-direction: column; gap: 4px; min-width: 0">
          <span style="font-family: 'Fraunces', Georgia, serif; font-size: 25px; font-weight: 700; color: {t['encre']}">{t['salut']}, Camille</span>
          <span style="display: flex; align-items: center; gap: 7px; font-size: 13px; color: {t['encre2']}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="{t['icone_c']}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{ICONS[t['icone']]}</svg>
            {t['date']} · {t['meteo']}
          </span>
        </div>
        <a href="#parametres" aria-label="Paramètres" style="width: 46px; height: 46px; flex: 0 0 auto; border-radius: 999px; background: {t['engrenage_fond']}; border: 1.4px solid {t['engrenage_bord']}; box-shadow: 1px 1.5px 0 {t['ombre_bouton']}; display: flex; align-items: center; justify-content: center; color: {t['encre']}">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{ENGRENAGE}</svg>
        </a>
      </div>

      <div style="flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; justify-content: center">{etiquette(t, p, face)}
      </div>

      <div style="flex: 0 0 auto; display: flex; flex-direction: column; gap: 4px">
        {actions}
      </div>

    </div>
  </section>

</div>
</x-dc>

<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":390,"height":844}}}}'>
class Component extends DCLogic {{
  renderVals() {{
    return {{}};
  }}
}}
</script>
</body>
</html>
'''

for t in THEMES:
    for face, suffixe in (('enigme', 'Enigme'), ('reponse', 'Reponse')):
        nom = f"Mvp{t['key']}{suffixe}.dc.html"
        open(os.path.join(OUT, nom), 'w', encoding='utf-8', newline='\n').write(ecran(t, face))
        print(nom)
