"""Compose portrait `*_mobile_bg_app.webp` backgrounds from the desktop app art.

The desktop art keeps its decoration on the edges and leaves the middle calm,
so a plain center crop (what `background-size: cover` does in portrait) loses
the art. This keeps the top and bottom bands of the full-width image and
fills the middle with a stretched, blurred band of the calm center.

Usage: python3 scripts/compose-mobile-bg.py [theme ...]
"""
import sys
from pathlib import Path
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'src' / 'assets' / 'background'
THEMES = sys.argv[1:] or ['cosmic', 'autumn', 'spring', 'light', 'dark', 'contrast']
WIDTH, HEIGHT = 720, 1560
BAND = 0.62  # share of the scaled image height kept in each band
FADE = 140   # px of blend between a band and the middle fill


def vertical_mask(height, fade, top):
    mask = Image.new('L', (1, height), 255)
    for y in range(fade):
        value = int(255 * y / fade)
        mask.putpixel((0, y if not top else height - 1 - y), value)
    return mask.resize((WIDTH, height))


for theme in THEMES:
    desktop = Image.open(SRC / f'{theme}_desktop_bg_app.webp').convert('RGB')
    scaled_height = round(desktop.height * WIDTH / desktop.width)
    scaled = desktop.resize((WIDTH, scaled_height), Image.LANCZOS)
    band = round(scaled_height * BAND)

    center = scaled.crop((0, scaled_height // 2 - 40, WIDTH, scaled_height // 2 + 40))
    canvas = center.resize((WIDTH, HEIGHT), Image.BICUBIC).filter(ImageFilter.GaussianBlur(24))

    top = scaled.crop((0, 0, WIDTH, band))
    canvas.paste(top, (0, 0), vertical_mask(band, FADE, top=True))
    bottom = scaled.crop((0, scaled_height - band, WIDTH, scaled_height))
    canvas.paste(bottom, (0, HEIGHT - band), vertical_mask(band, FADE, top=False))

    out = SRC / f'{theme}_mobile_bg_app.webp'
    canvas.save(out, 'WEBP', quality=78, method=6)
    print(out.relative_to(ROOT), out.stat().st_size // 1024, 'kB')
