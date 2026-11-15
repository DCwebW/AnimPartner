"""Bouche les trous transparents entre « Anim » et « Partner » et efface leur liseré sombre."""
import sys
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

src, dst = sys.argv[1], sys.argv[2]
im = np.asarray(Image.open(src).convert('RGBA')).astype(float)
op = im[..., 3] > 0
trous = ndimage.binary_fill_holes(op) & ~op
lum = im[..., :3].mean(2)
sombre = op & (lum < 140)
lab, _ = ndimage.label(sombre | trous)
ids = set(np.unique(lab[ndimage.binary_dilation(trous, iterations=2)])) - {0}
zone = np.isin(lab, list(ids))
taille = zone.sum()
zone = ndimage.binary_dilation(zone, iterations=4)  # le lissage autour du liseré
creme = np.median(im[op & (lum > 235) & (im[..., 2] > 200)][:, :3], axis=0)
douce = np.asarray(Image.fromarray((zone * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))) / 255.0
out = im.copy()
for c in range(3):
    out[..., c] = im[..., c] * (1 - douce) + creme[c] * douce
out[..., 3] = np.where(zone | trous, 255, im[..., 3])
Image.fromarray(out.clip(0, 255).astype(np.uint8)).save(dst)
print('crème', creme, 'pixels effacés', int(taille))
