// Captures the manifest screenshots (public/assets/screenshots) and the mobile
// reference captures in docs/sample from the production build (W14-05).
// Usage: npm run build && npm run screenshots
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import { preview } from 'vite';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const server = await preview({ root, preview: { port: 4174, strictPort: true } });
const baseUrl = 'http://localhost:4174/';

const browser = await chromium.launch();

async function openPage({ width, height, scale }) {
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: scale,
    isMobile: width < 700,
    hasTouch: width < 700,
    locale: 'pt-BR',
    reducedMotion: 'reduce',
    serviceWorkers: 'block'
  });
  const page = await context.newPage();
  return { context, page };
}

async function settle(page) {
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
}

async function goHome(page) {
  await page.goto(baseUrl);
  await settle(page);
}

async function goBoard(page) {
  await page.goto(`${baseUrl}?demo=game`);
  await page.getByRole('button', { name: /iniciar turno/i }).click();
  const show = page.getByRole('button', { name: /mostrar frases/i });
  if (await show.isVisible().catch(() => false)) await show.click();
  await page.getByRole('button', { name: /frase 1/i }).waitFor();
  await settle(page);
}

// The demo match is "everyone guesses": each player picks before the reveal.
async function guessUntilRevealed(page) {
  const next = page.getByRole('button', { name: /próxima rodada/i });
  for (let turn = 0; turn < 8 && !(await next.isVisible()); turn += 1) {
    await page.getByRole('button', { name: /frase 1/i }).click();
    await page.waitForTimeout(250);
  }
  await next.waitFor();
}

async function goRevealed(page) {
  await goBoard(page);
  await guessUntilRevealed(page);
  await settle(page);
}

async function goNav(label) {
  return async (page) => {
    await goHome(page);
    await page.getByRole('navigation').getByRole('button', { name: label }).click();
    await settle(page);
  };
}

async function goSetup(page) {
  await goHome(page);
  await page.getByRole('button', { name: /nova partida/i }).first().click();
  await settle(page);
}

const shots = [
  { file: 'public/assets/screenshots/wide-home.jpg', size: { width: 1280, height: 800, scale: 1 }, go: goHome },
  { file: 'public/assets/screenshots/wide-game.jpg', size: { width: 1280, height: 800, scale: 1 }, go: goBoard },
  { file: 'public/assets/screenshots/narrow-home.jpg', size: { width: 390, height: 844, scale: 2 }, go: goHome },
  { file: 'public/assets/screenshots/narrow-game.jpg', size: { width: 390, height: 844, scale: 2 }, go: goBoard },
  { file: 'docs/sample/Mobile_Home.jpg', size: { width: 390, height: 844, scale: 1.5 }, go: goHome },
  { file: 'docs/sample/Mobile_NewGame.jpg', size: { width: 390, height: 844, scale: 1.5 }, go: goSetup },
  { file: 'docs/sample/Mobile_GamePlay_1.jpg', size: { width: 390, height: 844, scale: 1.5 }, go: goBoard },
  { file: 'docs/sample/Mobile_GamePlay_2.jpg', size: { width: 390, height: 844, scale: 1.5 }, go: goRevealed },
  { file: 'docs/sample/Mobile_Leaderboard.jpg', size: { width: 390, height: 844, scale: 1.5 }, go: await goNav(/leaderboard/i) },
  { file: 'docs/sample/Mobile_Trophy.jpg', size: { width: 390, height: 844, scale: 1.5 }, go: await goNav(/troféus/i) },
  { file: 'docs/sample/Mobile_ContentAndPacks.jpg', size: { width: 390, height: 844, scale: 1.5 }, go: await goNav(/packs/i) }
];

try {
  for (const shot of shots) {
    const { context, page } = await openPage(shot.size);
    await shot.go(page);
    await page.screenshot({ path: path.join(root, shot.file), type: 'jpeg', quality: 82 });
    console.log(shot.file);
    await context.close();
  }
} finally {
  await browser.close();
  await new Promise((resolve) => server.httpServer.close(resolve));
}
