"""Ajoute un trait bleu marine sous la silhouette pour refermer le contour de l'autocollant."""
import sys
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

src, dst = sys.argv[1], sys.argv[2]
EPAISSEUR = int(sys.argv[3]) if len(sys.argv) > 3 else 7
MARINE = (16, 24, 52)
im = Image.open(src).convert('RGBA')
a = np.asarray(im.split()[3]) > 127
lisse = np.asarray(Image.fromarray((a * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(4))) > 127
trait = ndimage.binary_dilation(lisse | a, iterations=EPAISSEUR)
alpha = Image.fromarray((trait * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.0))
fond = Image.new('RGBA', im.size, MARINE + (0,)); fond.putalpha(alpha)
# bord du détourage : pixels mêlés au damier, on les rogne ; le trait passe dessous
coeur = ndimage.binary_erosion(a, iterations=3)
im.putalpha(Image.fromarray((coeur * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6)))
fond.alpha_composite(im)
fond.save(dst)
