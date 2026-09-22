# Guess the Fake Architecture

Guess the Fake is a single, self-contained local-first web game: among five
statements, find the fake one. There is no backend, no account, and no
multi-game shell. Everything ships as a static PWA.

Verified against the code on 2026-09-22.

## Goals

- Keep the app cheap to host and easy to publish as a static PWA.
- Keep round logic pure and testable without rendering the UI.
- Keep the app professional on desktop, tablet, and mobile.
- Prefer a simple hobby-friendly stack over backend-heavy infrastructure.

## Non-Goals

- No game registry, game picker, or second game. The shell renders Guess the
  Fake directly and that is the intended end state.
- No signaling server, lobby, or room backend.
- No server-side accounts, sync, or analytics.

## Current Stack

- Vite 7 for local development and static builds.
- React 19 for component structure.
- TypeScript 5 for explicit contracts.
- CSS Modules plus global design tokens.
- Vitest 4 + jsdom + Testing Library (27 test files, 103 tests).
- vite-plugin-pwa for manifest and service worker generation.
- lucide-react for iconography, qrcode for local invite QR codes.

Not adopted: no router, no state library, no CSS framework, no linter, and no
real-browser test runner. A Playwright (or equivalent) browser smoke test is a
future improvement; today the responsive smoke runs in jsdom.

Deployment runs from `.github/workflows/static.yml` on every push to `main`
(`npm ci` -> `npm test` -> `npm run build` with `VITE_BASE_PATH`).

## Source Layout

```txt
src/
  app/                   # shell: boot, screens, state, timers, network wiring
    App.tsx              # shell only: composes hooks, nav, toast, screen switch
    App.module.css       # every layout breakpoint lives here
    main.tsx
    app-types.ts         # Screen, Translate, LocalizeText
    navigation.tsx       # screen list, icons, tone classes, label keys
    achievement-definitions.ts
    match-boot.ts        # ?demo=game / persisted match / clean boot
    match-summary.ts     # pure: score rows, leaderboard rows, companion snapshot
    browser.ts           # download, file read, clipboard, external links
    peer-connection.ts   # BroadcastChannel/WebRTC support, ICE, QR fallback
    accessibility.ts
    new-match-flow.ts
    setup-filters.ts
    translations.ts      # pt/en shell dictionaries, merged with game dictionaries
    locales/             # es/fr/de/it shell dictionaries
    hooks/
      useSettings.ts     # settings, t(), theme/font/lang side effects
      useAudio.ts        # audio service, unlock, SFX, music zone
      useProgress.ts     # leaderboard, achievements (global + per mode), feedback
      usePacks.ts        # installed packs, enable/remove, import/export
      useLocalData.ts    # full local data import/export, leaderboard files
      useMatchSetup.ts   # New Match form and the rounds it would draw from
      useMatch.ts        # match state, countdown timers, persistence, wake lock
      useMultiDevice.ts  # companion session, BroadcastChannel, manual WebRTC, QR
      useGrowth.ts       # share, donations, PWA install prompt
    screens/             # presentational components, data + callbacks by props
      HomeScreen, NewMatchChoiceScreen, SetupScreen, GameBoardScreen,
      StatementGrid, RoundResultPanel, FinalResultPanel, LeaderboardScreen,
      AchievementsScreen, PacksScreen, MultiDeviceScreen, GrowthScreen,
      SettingsScreen, ScreenHeader (+ ResponsiveActions), ScoreResetFeedback
    *.test.ts(x)         # accessibility, new-match-flow, setup-filters,
                         # match-summary, match-persistence,
                         # gameplay-click-feedback, score-recalibration,
                         # responsive-smoke, hooks/useMatch,
                         # screens/AchievementsScreen
  assets/                # background/, icons/, songs/, player-default.svg
  core/                  # app-wide modules, independent of round logic
    achievements/
    audio/
    content-feedback/
    content-packs/
    i18n/
    leaderboard/
    multiplayer/
    settings/
    share/
    storage/
    themes/
    ui/                  # Button.tsx + Button.module.css
    user-data/
  game/                  # Guess the Fake domain
    modes.ts             # GAME_ID + GAME_MODES
    rules.ts             # pure round/score logic
    types.ts
    content-schema.ts
    match-storage.ts
    content-audit.ts     # pure coverage/duplicate audit of content packs
    content-review.ts    # pure human-review sheet and review-log checks
    translations.ts      # pt/en game dictionaries
    locales/             # es/fr/de/it game dictionaries
    data/builtin/
      catalog.ts         # language-neutral rounds + editorial metadata
      index.ts           # createBuiltinPack / loadBuiltinPack (lazy import)
      texts/<lang>.ts    # one text file (and chunk) per language
  styles/
    reset.css
    tokens.css
    base.css
  test/
    setup.ts
  vite-env.d.ts
```

`App.tsx` owns only the active screen and the focus/body-dataset effects. Each
hook returns a controller object (state + actions) and exports its type
(`MatchController`, `ProgressController`, ...); screens receive those
controllers or plain values by props. Screens hold no domain logic and at most
view-local state such as a file input ref.

## Boundaries

The `core` / `game` split is not about supporting future games. It is about
keeping the parts that must stay pure and cheap to test (`game`) apart from the
parts that touch browser APIs and persistence (`core`), with the shell (`app`)
wiring them together.

### `app/`

Owns boot, screen selection, layout, timers, and all side-effect wiring.
It may know about Guess the Fake screens and copy, but must not reimplement
round or scoring logic.

- `app/hooks/*` own state and side effects (timers, storage writes, network,
  audio). Callbacks that run later than their render (timers, data channel
  events, state updaters) read the latest values through refs.
- `app/screens/*` are presentational. New UI state that must survive a screen
  change belongs in a hook, not in the screen component.
- `App.tsx` should stay a thin shell; add behavior to a hook and wiring to the
  screen props instead of growing it.

### `core/`

App-wide modules that do not know what a round or a statement is. A module
belongs here when it would still make sense if the round rules changed
completely.

- `core/storage`: typed localStorage wrappers, migrations, and namespacing.
- `core/i18n`: language selection, translation lookup, interpolation.
- `core/themes`: theme registry, CSS token application, WCAG contrast audit.
- `core/settings`: language, theme, font scale, audio, timers, scoring.
- `core/leaderboard`: score history keyed by `gameId` and `modeId`.
- `core/achievements`: declarative achievement definitions and progress,
  with counters kept globally and per `modeId` (`getAchievementProgressView`).
- `core/content-packs`: installable pack validation and activation.
- `core/content-feedback`: per-round rating, "do not repeat", and aggregates.
- `core/audio`: track library, fades, unlock-on-interaction, synthesized SFX.
- `core/multiplayer`: companion-device session primitives and transports.
- `core/share`: Web Share API, clipboard fallback, and web intents.
- `core/user-data`: local user id plus import/export of all local data.
- `core/ui`: the shared `Button` component.

Rule: `core/` must never import from `game/`.

### `game/`

Owns the domain: modes, rules, content schema, content, and game copy.
It may import from `core/`. Round rules stay pure.

## Game Definition

Identity and modes live in `src/game/modes.ts` as plain constants:

```ts
export const GAME_ID = 'guess-the-fake';

export type GameMode = {
  id: string;
  titleKey: string;
  descriptionKey: string;
  minPlayers: number;
  maxPlayers: number;
};

export const GAME_MODES: GameMode[] = [/* classic, all-guess, teams */];
```

`GAME_ID` is the key used by leaderboard entries, pack validation, and
multiplayer snapshots. `GAME_MODES` drives the setup mode picker and the mode
labels shown during a match. There is no manifest object and no registry: the
shell imports these constants directly.

Rules are pure functions in `src/game/rules.ts`:

```ts
startMatch(state, options) => nextState
startRound(state, options) => nextState
submitGuess(state, guess) => result
applyResult(state, result) => nextState
getFinalResult(state) => summary
```

No `Date.now`, `setTimeout`, DOM, localStorage, audio, or network inside
`rules.ts`. Pass external values in as parameters. This keeps the hardest parts
testable and prevents UI code from becoming the source of truth.

## State Management

There is deliberately no state library and no router.

- Session state lives in `useState`/`useRef` inside the hooks of `app/hooks/`;
  `App()` only holds the active screen.
- Screen selection is a string union rendered conditionally:
  `'home' | 'play' | 'leaderboard' | 'achievements' | 'packs' | 'multiDevice' |
  'growth' | 'settings'`. `?demo=game` is the only deep link.
- Durable state goes through the versioned `core/*` modules, each exposing
  `load*`/`save*` over `core/storage`.
- State transitions belong to pure functions in `game/rules.ts`. React holds the
  result; it does not compute it.

## Domain Model

```ts
export type GuessTheFakeRound = {
  id: string;
  categoryId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  statements: GuessTheFakeStatement[];
  fakeStatementId: string;
  explanation?: string;
};

export type GuessTheFakeStatement = {
  id: string;
  text: string;
};
```

Match flow: `setup -> intro -> preparing -> playing -> revealed -> finished`.

1. Configure players, teams, rounds, categories, difficulty, and packs.
2. Draw one round containing five statements.
3. Player or team selects the fake statement.
4. Reveal the result and optional explanation.
5. Score the round (base points, speed bonus, streak multiplier).
6. Continue until the final scoreboard.

## Content

Built-in content lives in `src/game/data/builtin/`: a language-neutral
`catalog.ts` (round ids, category, difficulty, fake position, `ageRating`,
`sources`, `review`) plus one `texts/<lang>.ts` per language. `loadBuiltinPack`
loads only the active language through `import()`, so each language is its own
chunk; the PWA precaches all of them. Round ids are shared across languages.

Today: 7 categories x 3 difficulties x 15 rounds = 315 factual rounds in all
six languages, AI-drafted and marked `review.status: 'draft'` until a human
review is logged in `builtin/reviews.ts`. `game/content-review.ts` builds the
review sheet (`npm run review:content`). Editorial checklist
and authoring flow: `docs/CONTENT_GUIDE.md`. `game/content-audit.ts` checks
coverage and duplicates; its test fails below `RELEASE_MIN_ROUNDS_PER_CELL`.

External packs are validated by `src/game/content-schema.ts`: unique ids,
exactly five statements, exactly one `fakeStatementId`, known category, valid
difficulty, optional valid `ageRating`, compatible language, and
`expectedGameId === GAME_ID`.

## Persistence

Storage keys are namespaced and versioned. `core/storage` builds them with
`createStorageKey(scope, name, version)` as `gtf.<scope>.<name>.v<n>`.

Keys currently in use:

```txt
gtf.platform.settings.v3           # migrates from v1 and v2
gtf.platform.leaderboard.v1
gtf.platform.achievements.v1
gtf.platform.content-packs.v1
gtf.platform.content-feedback.v2   # migrates from v1
gtf.platform.multiplayer-session.v1
gtf.platform.user-id.v1
gtf.game.guess-the-fake.quick-game.v1
```

`gtf.platform.achievements.v1` gained an optional `modeCounters` record in
2026-09. It is additive: `normalizeAchievementState` fills it with `{}` for old
or invalid data, so the version was not bumped. Per-mode counters only exist
for rounds played after that change; earlier progress stays global.

The `platform` scope is a historical name kept on purpose: renaming it would
orphan every existing player's local data for no functional gain. Read it as
"app-wide". Theme lives inside the settings envelope; there is no separate
theme key.

When a schema changes, bump the version and register a migration through
`readVersionedWithMigrations` instead of reading the old key ad hoc.

## Styling System

Three layers:

1. Global reset and base layout (`src/styles/reset.css`, `base.css`).
2. Design tokens for colors, typography, spacing, elevation, shape, and motion
   (`src/styles/tokens.css`).
3. Screen and component styles using CSS Modules.

Six themes ship as token overrides, not duplicated component CSS: `cosmic`,
`liquid-glass`, `material3`, `light-mode`, `dark-mode`, `high-contrast`.
`core/themes/contrast.ts` holds a testable WCAG audit for critical pairs.

Responsive behavior is component-driven: `clamp`, `minmax`, `aspect-ratio`, and
container-friendly layouts; no viewport-scaled typography for controls. Every
size derives from `--font-scale`, which the font-size setting overrides across
five levels. Breakpoints are documented in `docs/FRONTEND_SYSTEM.md`.

## PWA Strategy

`VitePWA({ registerType: 'autoUpdate' })` in `vite.config.ts` with an inline
manifest and a workbox glob covering js, css, html, svg, png, jpg, webp, mp3,
and ico. Icons are served from `public/assets/icons/`. The base path is
env-driven via `VITE_BASE_PATH`.

Registration relies on the plugin's auto-injection: the app does not import
`virtual:pwa-register` and has no in-app update or offline-ready prompt. The
install CTA is handled in `App.tsx` through `beforeinstallprompt`.

## Multiplayer Strategy

Multi-device is optional and strictly serverless. Three transports exist in
`core/multiplayer`:

- `broadcast-channel`: tabs on the same origin and device.
- `webrtc-manual`: RTCPeerConnection with offer/answer exchanged by hand
  (copy/paste or QR), public STUN by default and `VITE_GTF_STUN_URLS` override.
- `manual-offline`: exported/imported JSON snapshots.

Guests are read-only spectators of a `MultiplayerGameSnapshot`. Do not add a
signaling server, lobby, or room backend without an explicit product decision —
it breaks the static-hosting constraint.

## Testing Strategy

Present today (27 files, 103 tests):

- Round and scoring rule tests (`game/rules.test.ts`).
- Content validation tests (`game/content-schema.test.ts`).
- Storage migration and fallback tests (`core/storage`, `core/settings`,
  `core/content-feedback`, `game/match-storage`).
- Leaderboard and achievement progress tests, including per-mode counters.
- Pure match summary tests (`app/match-summary.test.ts`).
- Hook test for the match countdown, timeout, pause, and end-of-match
  recording with fake timers (`app/hooks/useMatch.test.tsx`).
- Isolated screen test for the trophy mode filter
  (`app/screens/AchievementsScreen.test.tsx`).
- Theme contrast audit test.
- Interaction tests for card click/feedback, score recalibration, and match
  persistence.
- A responsive smoke across the `DEVICE_VALIDATION.md` viewports
  (`src/app/responsive-smoke.test.tsx`). It runs in Vitest + jsdom, not a real
  browser, so it verifies structure and interaction, not computed layout.
- `npm run build` also runs `tsc -b` as the typecheck gate.

Still missing: a real-browser smoke test, lint/format tooling, and coverage
thresholds.

## Design Direction

Guess the Fake should feel like a polished family quiz table: clear, fast,
playful, and legible across devices. Prioritize the game surface over generic
gradient hero patterns:

- Five statement cards as the main visual object.
- Clear selected, correct, and fake states.
- Confident typography with large readable statements.
- Compact setup and results screens.
- Themes that feel distinct but share the same layout system.
