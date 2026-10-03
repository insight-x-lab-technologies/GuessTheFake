// Renders the 1200x630 Open Graph / Twitter images, one per language (W14-05),
// into public/assets/og/og-<lang>.png. Uses the cosmic home art and icon.svg.
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const art = await readFile(path.join(root, 'src/assets/background/cosmic_desktop_bg_home.webp'));
const icon = await readFile(path.join(root, 'public/assets/icons/icon.svg'), 'utf8');

const copy = {
  pt: ['Cinco afirmações.', 'Uma é falsa.', 'Jogo de festa em família · sem conta · offline'],
  en: ['Five statements.', 'One is fake.', 'Family party game · no account · works offline'],
  es: ['Cinco afirmaciones.', 'Una es falsa.', 'Juego de mesa familiar · sin cuenta · sin conexión'],
  fr: ['Cinq affirmations.', 'Une est fausse.', 'Jeu de soirée en famille · sans compte · hors ligne'],
  de: ['Fünf Aussagen.', 'Eine ist falsch.', 'Familien-Partyspiel · ohne Konto · offline'],
  it: ['Cinque affermazioni.', 'Una è falsa.', 'Gioco di società in famiglia · senza account · offline']
};

const page = (lang) => {
  const [lead, punch, footer] = copy[lang];
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@700;900&display=swap" rel="stylesheet">
<style>
  html, body { margin: 0; width: 1200px; height: 630px; overflow: hidden; }
  body {
    background: linear-gradient(90deg, rgba(20, 8, 48, 0.9) 0%, rgba(20, 8, 48, 0.55) 55%, rgba(20, 8, 48, 0.1) 100%),
      url(data:image/webp;base64,${art.toString('base64')}) center / cover;
    color: #fff; display: flex; align-items: center; gap: 56px; padding: 0 72px; box-sizing: border-box;
    font-family: 'Nunito', sans-serif;
  }
  .icon svg { width: 300px; height: 300px; filter: drop-shadow(0 24px 48px rgba(0, 0, 0, 0.45)); }
  h1 { font-family: 'Fredoka One', sans-serif; font-weight: 400; font-size: 92px; line-height: 1; margin: 0 0 28px; }
  p { margin: 0; font-weight: 900; font-size: 50px; line-height: 1.15; }
  .punch { color: #ffcf5a; }
  .footer { margin-top: 30px; font-size: 26px; font-weight: 700; opacity: 0.88; }
</style></head><body>
  <div class="icon">${icon}</div>
  <div><h1>Guess the Fake</h1><p>${lead}</p><p class="punch">${punch}</p><p class="footer">${footer}</p></div>
</body></html>`;
};

const browser = await chromium.launch();
const tab = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const lang of Object.keys(copy)) {
  await tab.setContent(page(lang), { waitUntil: 'networkidle' });
  await tab.evaluate(() => document.fonts.ready);
  const file = path.join(root, 'public/assets/og', `og-${lang}.png`);
  await tab.screenshot({ path: file });
  console.log(path.relative(root, file));
}
await browser.close();
