"""Fabrique les images de l'identité (icônes, splash, favicon, logo) depuis les sources.

À lancer depuis ce dossier : python3 generer.py
Dépendances : Pillow, NumPy, SciPy (outil de design, pas une dépendance de l'app).
"""
import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

ICI = Path(__file__).resolve().parent
RACINE = ICI.parent
SOURCES = RACINE / 'sources'
APP = RACINE / 'app'
TMP = ICI / '_tmp'

FOND_CLAIR = (0xFE, 0xF3, 0xD4)   # Soleil clair, fond de panneau du crayonné
OCRE = (0xC9, 0x8A, 0x2B)         # hachures du fond de panneau
TAILLE = 1024


def lancer(script, *args):
    subprocess.run([sys.executable, '-I', str(ICI / script), *map(str, args)], check=True)


def rogner(im):
    return im.crop(im.getbbox())


def rayon_max(im):
    """Plus grande distance entre le centre de la boîte et un pixel visible."""
    a = np.asarray(im.split()[3]) > 32
    ys, xs = np.nonzero(a)
    cy, cx = (im.height - 1) / 2, (im.width - 1) / 2
    return float(np.sqrt((xs - cx) ** 2 + (ys - cy) ** 2).max())


def centrer_dans_cercle(motif, rayon):
    """Pose le motif au centre d'un carré transparent de 1024, contenu dans un cercle de `rayon`."""
    echelle = rayon / rayon_max(motif)
    m = motif.resize((round(motif.width * echelle), round(motif.height * echelle)), Image.LANCZOS)
    toile = Image.new('RGBA', (TAILLE, TAILLE), (0, 0, 0, 0))
    toile.alpha_composite(m, ((TAILLE - m.width) // 2, (TAILLE - m.height) // 2))
    return toile


def fond_hachure(taille=TAILLE):
    """Fond crème hachuré en ocre, deux directions à 13 % et 10 % (design system, crayonné)."""
    fond = Image.new('RGBA', (taille, taille), FOND_CLAIR + (255,))
    for angle, opacite, pas in ((1, 0.13, 22), (-1, 0.10, 30)):
        calque = Image.new('RGBA', (taille, taille), (0, 0, 0, 0))
        d = ImageDraw.Draw(calque)
        for k in range(-taille, 2 * taille, pas):
            d.line([(k, 0), (k + angle * taille, taille)] if angle > 0 else [(k, 0), (k - taille, taille)],
                   fill=OCRE + (round(255 * opacite),), width=2)
        fond.alpha_composite(calque)
    return fond


def monochrome(ap):
    """Silhouette d'une couleur : lettres et éclats, sans l'anneau crème de l'autocollant."""
    px = np.asarray(ap).astype(int)
    r, g, b, a = (px[..., i] for i in range(4))
    vert = (g > r + 15) & (g >= b)
    bleu = (b > r + 25) & (b > 70)
    jaune = (r > 190) & (g > 140) & (b < 150) & (r - b > 70)
    m = (vert | bleu | jaune) & (a > 128)
    m = ndimage.binary_closing(m, iterations=4)
    m = ndimage.binary_opening(m, iterations=2)
    lab, n = ndimage.label(m)
    tailles = ndimage.sum(m, lab, range(1, n + 1))
    garde = np.zeros(n + 1, bool); garde[1:] = tailles > 500
    m = garde[lab]
    out = Image.new('RGBA', ap.size, (0, 0, 0, 0))
    out.putalpha(Image.fromarray((m * 255).astype(np.uint8)))
    blanc = Image.new('RGBA', ap.size, (255, 255, 255, 255)); blanc.putalpha(out.split()[3])
    return blanc


def main():
    TMP.mkdir(exist_ok=True)
    APP.mkdir(exist_ok=True)
    lancer('detour.py', SOURCES / 'icone-source.webp', TMP / 'ap-detoure.png')
    lancer('contour.py', TMP / 'ap-detoure.png', TMP / 'ap-propre.png', 8)
    lancer('logo_trous.py', SOURCES / 'logo-source.webp', TMP / 'logo-propre.png')

    ap = rogner(Image.open(TMP / 'ap-propre.png'))
    ap.save(RACINE / 'icone-ap.png', optimize=True)
    logo = rogner(Image.open(TMP / 'logo-propre.png'))
    logo.save(APP / 'logo.png', optimize=True)

    # Android, icône adaptive : 108 dp, zone sûre = cercle de 66 dp au centre (rayon 313 px sur 1024).
    premier_plan = centrer_dans_cercle(ap, 300)
    premier_plan.save(APP / 'android-icon-foreground.png', optimize=True)
    fond_hachure().save(APP / 'android-icon-background.png', optimize=True)
    centrer_dans_cercle(monochrome(ap), 300).save(APP / 'android-icon-monochrome.png', optimize=True)

    # iOS et magasins : carré plein, sans coins arrondis ni transparence (le système arrondit).
    icone = fond_hachure()
    icone.alpha_composite(centrer_dans_cercle(ap, 430))
    icone.convert('RGB').save(APP / 'icon.png', optimize=True)

    # Splash : même motif que le premier plan Android (Android 12+ le masque en cercle).
    premier_plan.save(APP / 'splash-icon.png', optimize=True)

    # Favicon web 48 × 48.
    fav = Image.new('RGBA', (48, 48), (0, 0, 0, 0))
    petit = ap.copy(); petit.thumbnail((46, 46), Image.LANCZOS)
    fav.alpha_composite(petit, ((48 - petit.width) // 2, (48 - petit.height) // 2))
    fav.save(APP / 'favicon.png', optimize=True)

    for f in TMP.iterdir():
        f.unlink()
    TMP.rmdir()
    for f in sorted(APP.iterdir()):
        print(f.name, Image.open(f).size, Image.open(f).mode)


if __name__ == '__main__':
    main()
