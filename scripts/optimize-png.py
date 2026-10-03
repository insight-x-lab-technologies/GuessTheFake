"""Quantizes PNGs to a 256-color palette in place (pngquant-like, via Pillow).

Uses libimagequant when Pillow has it; the octree fallback bands gradients.

Usage: python3 scripts/optimize-png.py file.png [...]
"""
import sys
from pathlib import Path
from PIL import Image, features

METHOD = Image.LIBIMAGEQUANT if features.check_feature('libimagequant') else Image.FASTOCTREE

for name in sys.argv[1:]:
    path = Path(name)
    before = path.stat().st_size
    image = Image.open(path).convert('RGBA')
    image.quantize(256, method=METHOD, dither=Image.FLOYDSTEINBERG).save(path, optimize=True)
    print(f'{path.name}: {before // 1024} kB -> {path.stat().st_size // 1024} kB')
