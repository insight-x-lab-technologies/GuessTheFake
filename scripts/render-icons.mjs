// Renders the PWA icons in public/assets/icons from icon.svg (W14-02).
// Variants share the same art: `icon-*` keeps the rounded tile, `maskable`
// and `apple-touch-icon` fill the whole square and shrink the art into the
// safe zone, and `monochrome` is a white silhouette for Android themed icons.
// Run `python3 scripts/optimize-png.py public/assets/icons/*.png` afterwards.
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const iconsDir = path.join(root, 'public/assets/icons');
const source = await readFile(path.join(iconsDir, 'icon.svg'), 'utf8');

const defs = source.match(/<defs>[\s\S]*<\/defs>/)[0];
const art = source.slice(source.indexOf('/>', source.indexOf('<rect')) + 2, source.lastIndexOf('</svg>'));
const scaled = (content, scale) => (
  `<g transform="translate(256 256) scale(${scale}) translate(-256 -256)">${content}</g>`
);
const svg = (body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">${defs}${body}</svg>`;
const fullBleed = (scale) => svg(`<rect width="512" height="512" fill="url(#bg)"/>${scaled(art, scale)}`);

// Dark details become holes; sparkles (the translucent circles) are dropped.
const silhouette = art
  .replace(/<circle[^>]*opacity="[^"]*"\/>/g, '')
  .replaceAll('url(#face)', '#ffffff')
  .replaceAll('#1f123d', '#000000');
const monochrome = svg(
  `<mask id="cut"><rect width="512" height="512" fill="#000000"/>${scaled(silhouette, 0.72)}</mask>`
  + '<rect width="512" height="512" fill="#ffffff" mask="url(#cut)"/>'
);

const outputs = [
  { file: 'icon-192.png', size: 192, markup: source },
  { file: 'icon-512.png', size: 512, markup: source },
  { file: 'maskable-512.png', size: 512, markup: fullBleed(0.78) },
  { file: 'apple-touch-icon.png', size: 180, markup: fullBleed(0.9) },
  { file: 'monochrome-512.png', size: 512, markup: monochrome }
];

const browser = await chromium.launch();
const page = await browser.newPage();
for (const { file, size, markup } of outputs) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(
    `<style>html,body{margin:0;background:transparent}svg{display:block;width:${size}px;height:${size}px}</style>${markup}`
  );
  await page.locator('svg').screenshot({ path: path.join(iconsDir, file), omitBackground: true });
  console.log(file);
}
await browser.close();
