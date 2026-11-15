"""Détoure l'icône « AP » livrée sur un faux damier peint dans l'image.

Le damier fait 50 × 50 cases. Un pixel est du fond s'il est gris neutre et proche de
la teinte attendue pour sa case (foncée ou claire), ou gris intermédiaire sur une ligne
de la grille (lissage entre deux cases). Le fond retenu est la partie de ces pixels
reliée au bord de l'image.
"""
import sys
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

src, dst = sys.argv[1], sys.argv[2]
im = np.asarray(Image.open(src).convert('RGB')).astype(int)
H, W, _ = im.shape
CASES = 50
gris = im.mean(2)
ecart = im.max(2) - im.min(2)
ys, xs = np.mgrid[0:H, 0:W]
ci, cj = (xs * CASES) // W, (ys * CASES) // H
fonce = (ci + cj) % 2 == 0
# teintes de référence mesurées sur la bordure de l'image
bande = np.zeros((H, W), bool); bande[:30] = bande[-30:] = True; bande[:, :30] = bande[:, -30:] = True
ref_f = np.median(gris[bande & fonce & (ecart < 10)])
ref_c = np.median(gris[bande & ~fonce & (ecart < 10)])
attendu = np.where(fonce, ref_f, ref_c)
pas = W / CASES
dist_grille = np.minimum(np.minimum(xs % pas, pas - xs % pas), np.minimum(ys % pas, pas - ys % pas))
case = (ecart < 12) & (np.abs(gris - attendu) < 24)
grille = (ecart < 12) & (dist_grille < 2.5) & (gris > ref_f - 15) & (gris < ref_c + 15)
candidat = case | grille
lab, _ = ndimage.label(candidat)
bord = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
obj = ~np.isin(lab, list(bord))
lab2, n2 = ndimage.label(obj)
tailles = ndimage.sum(obj, lab2, range(1, n2 + 1))
garde = np.zeros(n2 + 1, bool); garde[1:] = tailles > 400
obj = ndimage.binary_fill_holes(garde[lab2])
obj = ndimage.binary_opening(obj, iterations=2)  # retire les filaments de grille restés collés
obj = ndimage.binary_erosion(obj, iterations=1)
alpha = Image.fromarray((obj * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8))
out = Image.fromarray(im.astype(np.uint8)).convert('RGBA'); out.putalpha(alpha)
out.save(dst)
print('réf foncé', ref_f, 'réf clair', ref_c, 'composantes', int(garde.sum()), 'bbox', out.getbbox())
