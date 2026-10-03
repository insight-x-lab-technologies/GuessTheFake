import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const DESCRIPTION = 'A family party game: five statements, one is fake. Find it, score for speed and streaks. Local-first, no account.';
// The page boots in Portuguese (`<html lang="pt-BR">`), so the static social
// tags do too; og-<lang>.png variants exist for posts in other languages.
const SOCIAL_DESCRIPTION = 'Jogo de festa em família: cinco afirmações, uma é falsa. Descubra qual, pontue por rapidez e sequência. Sem conta, funciona offline.';

// Open Graph / Twitter tags (W14-05). Crawlers need absolute image URLs, so
// they use VITE_GTF_PUBLIC_URL when set and fall back to base-relative paths.
function socialMeta(base: string, publicUrl: string): Plugin {
  const origin = publicUrl ? publicUrl.replace(/\/?$/, '/') : base;
  const image = `${origin}assets/og/og-pt.png`;
  return {
    name: 'gtf-social-meta',
    transformIndexHtml() {
      return [
        { tag: 'meta', attrs: { name: 'description', content: SOCIAL_DESCRIPTION }, injectTo: 'head' },
        { tag: 'meta', attrs: { property: 'og:type', content: 'website' }, injectTo: 'head' },
        { tag: 'meta', attrs: { property: 'og:title', content: 'Guess the Fake' }, injectTo: 'head' },
        { tag: 'meta', attrs: { property: 'og:description', content: SOCIAL_DESCRIPTION }, injectTo: 'head' },
        { tag: 'meta', attrs: { property: 'og:image', content: image }, injectTo: 'head' },
        { tag: 'meta', attrs: { property: 'og:image:width', content: '1200' }, injectTo: 'head' },
        { tag: 'meta', attrs: { property: 'og:image:height', content: '630' }, injectTo: 'head' },
        { tag: 'meta', attrs: { property: 'og:locale', content: 'pt_BR' }, injectTo: 'head' },
        ...['en_US', 'es_ES', 'fr_FR', 'de_DE', 'it_IT'].map(locale => (
          { tag: 'meta', attrs: { property: 'og:locale:alternate', content: locale }, injectTo: 'head' as const }
        )),
        ...(publicUrl ? [{ tag: 'meta', attrs: { property: 'og:url', content: origin }, injectTo: 'head' as const }] : []),
        { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' }, injectTo: 'head' },
        { tag: 'meta', attrs: { name: 'twitter:title', content: 'Guess the Fake' }, injectTo: 'head' },
        { tag: 'meta', attrs: { name: 'twitter:description', content: SOCIAL_DESCRIPTION }, injectTo: 'head' },
        { tag: 'meta', attrs: { name: 'twitter:image', content: image }, injectTo: 'head' }
      ];
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const base = env.VITE_BASE_PATH || process.env.VITE_BASE_PATH || '/';

  return {
    base,
    plugins: [
      react(),
      socialMeta(base, env.VITE_GTF_PUBLIC_URL ?? ''),
      VitePWA({
        // Prompt mode: a new version waits for the player (W14-04).
        registerType: 'prompt',
        // The workbox glob already precaches public/assets/icons; adding the
        // manifest icons again made Workbox reject the duplicate entries
        // (add-to-cache-list-conflicting-entries) and skip the whole precache.
        includeManifestIcons: false,
        manifest: {
          name: 'Guess the Fake',
          short_name: 'Guess Fake',
          description: DESCRIPTION,
          theme_color: '#14532d',
          background_color: '#f8f5ed',
          display: 'standalone',
          start_url: '.',
          scope: '.',
          categories: ['games', 'entertainment', 'family'],
          icons: [
            { src: 'assets/icons/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
            { src: 'assets/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
            { src: 'assets/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
            { src: 'assets/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
            { src: 'assets/icons/monochrome-512.png', sizes: '512x512', type: 'image/png', purpose: 'monochrome' }
          ],
          screenshots: [
            {
              src: 'assets/screenshots/wide-home.jpg',
              sizes: '1280x800',
              type: 'image/jpeg',
              form_factor: 'wide',
              label: 'Home screen'
            },
            {
              src: 'assets/screenshots/wide-game.jpg',
              sizes: '1280x800',
              type: 'image/jpeg',
              form_factor: 'wide',
              label: 'Five statements, one is fake'
            },
            {
              src: 'assets/screenshots/narrow-home.jpg',
              sizes: '780x1688',
              type: 'image/jpeg',
              form_factor: 'narrow',
              label: 'Home screen'
            },
            {
              src: 'assets/screenshots/narrow-game.jpg',
              sizes: '780x1688',
              type: 'image/jpeg',
              form_factor: 'narrow',
              label: 'Five statements, one is fake'
            }
          ]
        },
        workbox: {
          // Music is not precached: each loop downloads the first time it plays
          // and stays in the runtime cache for offline play (W14-01).
          globPatterns: ['**/*.{js,css,html,svg,png,jpg,jpeg,webp,ico}'],
          // Only the default (cosmic) backgrounds are precached; the other
          // themes cache their art the first time they are shown.
          globIgnores: [
            '**/assets/og/**',
            '**/assets/screenshots/**',
            '**/assets/{autumn,spring,light,dark,contrast}_*_bg_*'
          ],
          maximumFileSizeToCacheInBytes: 2 * 1024 * 1024,
          runtimeCaching: [
            {
              urlPattern: ({ request, url }) => request.destination === 'audio' || url.pathname.endsWith('.mp3'),
              handler: 'CacheFirst',
              options: {
                cacheName: 'gtf-music',
                cacheableResponse: { statuses: [0, 200] },
                expiration: { maxEntries: 8 },
                rangeRequests: true
              }
            },
            {
              urlPattern: ({ url }) => /_bg_(app|home)-[\w-]+\.webp$/.test(url.pathname),
              handler: 'CacheFirst',
              options: {
                cacheName: 'gtf-backgrounds',
                cacheableResponse: { statuses: [0, 200] },
                expiration: { maxEntries: 24 }
              }
            }
          ]
        }
      })
    ],
    build: {
      sourcemap: true
    }
  };
});
