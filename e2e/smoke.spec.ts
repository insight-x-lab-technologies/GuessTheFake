import { expect, test, type Page } from '@playwright/test';

// Fails when the layout scrolls sideways, the bug class jsdom cannot see.
async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
}

async function attachScreenshot(page: Page, name: string) {
  await test.info().attach(name, { body: await page.screenshot({ fullPage: false }), contentType: 'image/png' });
}

test('home renders without horizontal overflow', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('heading', { name: /guess the fake/i }).first()).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await attachScreenshot(page, 'home');
});

test('demo game: start turn, pick a card, reveal, next round', async ({ page }) => {
  await page.goto('./?demo=game');

  await page.getByRole('button', { name: /iniciar turno/i }).click();
  const showStatements = page.getByRole('button', { name: /mostrar frases/i });
  if (await showStatements.isVisible().catch(() => false)) await showStatements.click();

  const firstStatement = page.getByRole('button', { name: /frase 1/i });
  await expect(firstStatement).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await attachScreenshot(page, 'board');

  // The demo match is "everyone guesses": each player picks before the reveal.
  const nextRound = page.getByRole('button', { name: /próxima rodada/i });
  for (let turn = 0; turn < 8 && !(await nextRound.isVisible()); turn += 1) {
    await firstStatement.click();
    await page.waitForTimeout(250);
  }
  await expect(nextRound).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await attachScreenshot(page, 'revealed');

  await nextRound.click();
  await expect(page.getByRole('button', { name: /iniciar turno/i })).toBeVisible();
});

test('solo challenge reaches the personal result', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: /jogar sozinho/i }).first().click();
  await page.getByRole('spinbutton').fill('1');
  const start = page.getByRole('button', { name: /começar/i });
  await expect(start).toBeEnabled();
  await start.click();

  await page.getByRole('button', { name: /frase 1/i }).click();
  await page.getByRole('button', { name: /ver resultado/i }).click();
  await expect(page.getByRole('button', { name: /novo desafio/i })).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await attachScreenshot(page, 'solo-result');
});

test('manifest exposes maskable, monochrome icons and screenshots', async ({ request }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'viewport independent');
  const response = await request.get('./manifest.webmanifest');
  expect(response.ok()).toBe(true);
  const manifest = await response.json();
  const purposes = manifest.icons.map((icon: { purpose: string }) => icon.purpose);
  expect(purposes).toEqual(expect.arrayContaining(['any', 'maskable', 'monochrome']));
  expect(manifest.screenshots.length).toBeGreaterThanOrEqual(2);
  for (const asset of [...manifest.icons, ...manifest.screenshots]) {
    expect((await request.get(`./${asset.src}`)).ok(), asset.src).toBe(true);
  }
});

test.describe('offline', () => {
  test.use({ serviceWorkers: 'allow' });

  test('reloads offline after the first visit precached the app', async ({ page, context }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'viewport independent');
    await page.goto('./');
    await page.evaluate(() => navigator.serviceWorker.ready);
    // Workbox rejects a precache list with conflicting entries and caches
    // nothing; this caught the duplicated manifest icons.
    await expect.poll(() => page.evaluate(async () => {
      const names = await caches.keys();
      const precache = names.find(name => name.startsWith('workbox-precache'));
      return precache ? (await (await caches.open(precache)).keys()).length : 0;
    })).toBeGreaterThan(10);

    await context.setOffline(true);
    await page.reload();
    await expect(page.getByRole('heading', { name: /guess the fake/i }).first()).toBeVisible();
    await page.getByRole('button', { name: /nova partida/i }).first().click();
    await expect(page.getByRole('button', { name: /começar/i })).toBeEnabled();
  });
});
