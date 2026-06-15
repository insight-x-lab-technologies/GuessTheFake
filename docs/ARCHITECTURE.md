# Guess the Fake Platform Architecture

This project is being rebuilt as a reusable local-first web game platform. The
first production game on top of the platform is `Guess the Fake`, but the
architecture must also support future casual party games with shared menus,
themes, settings, content packs, achievements, leaderboard, PWA behavior, and
responsive layouts.

## Goals

- Keep the app cheap to host and easy to publish as a static PWA.
- Separate reusable platform capabilities from game-specific rules and content.
- Make game rules testable without rendering the UI.
- Make the frontend professional on desktop, tablet, and mobile.
- Preserve the useful product ideas from the original prototype while removing
  old game-specific naming and coupling.
- Prefer a simple hobby-friendly stack over backend-heavy infrastructure.

## Recommended Stack

- Vite for fast local development and static builds.
- React for component structure and reusable screens.
- TypeScript for explicit contracts between the platform and games.
- CSS Modules plus global design tokens for maintainable styling.
- Vitest for game rules, persistence, content validation, and shared utilities.
- Playwright for high-value responsive and interaction checks.
- vite-plugin-pwa for manifest and service worker generation.
- lucide-react for consistent iconography.

This app does not need Next.js by default. It is a client-side game, works well
as a static PWA, and should stay easy to deploy to GitHub Pages or any static
host.

## Source Layout

```txt
src/
  app/
    App.tsx
    main.tsx
    routes.ts
    providers/
    screens/
  core/
    achievements/
    audio/
    content-packs/
    i18n/
    leaderboard/
    multiplayer/
    pwa/
    settings/
    storage/
    themes/
    ui/
  games/
    guess-the-fake/
      game.manifest.ts
      rules.ts
      content-schema.ts
      screens/
      translations/
      packs/
    no-laughing-allowed/
      legacy-notes.md
  styles/
    reset.css
    tokens.css
    base.css
```

## Boundaries

### `app/`

Owns application boot, top-level providers, screen routing, and global layout.
It should know which game is active, but should not implement game rules.

### `core/`

Reusable platform modules. A module belongs in `core/` only when it can be used
by more than one game without knowing that game's domain language.

Examples:

- `core/storage`: typed localStorage wrappers, migrations, and namespacing.
- `core/i18n`: language selection, translation lookup, interpolation.
- `core/themes`: theme registry, CSS token application, theme persistence.
- `core/settings`: global settings such as language, sound, music, theme.
- `core/leaderboard`: generic score history by `gameId` and `modeId`.
- `core/achievements`: declarative achievement definitions and progress.
- `core/content-packs`: generic installable pack validation and activation.
- `core/audio`: sound effects and music playback.
- `core/multiplayer`: companion-device/session primitives.
- `core/ui`: shared buttons, cards, modals, form controls, layout primitives.

### `games/`

Each game owns its manifest, rules, content schema, copy, screens, and scoring.
A game can depend on `core/`, but `core/` must not depend on a concrete game.

## Game Contract

Each game exposes a manifest:

```ts
export type GameManifest = {
  id: string;
  titleKey: string;
  descriptionKey: string;
  defaultModeId: string;
  modes: GameMode[];
  contentSchemaVersion: number;
  createInitialState: () => unknown;
};
```

Rules should be pure functions where practical:

```ts
startRound(state, options) => nextState
submitGuess(state, guess) => result
applyResult(state, result) => nextState
getFinalResult(state) => summary
```

This keeps the hardest parts testable and prevents UI code from becoming the
source of truth for game behavior.

## Guess the Fake Domain Model

```ts
export type GuessTheFakeRound = {
  id: string;
  categoryId: string;
  statements: GuessTheFakeStatement[];
  fakeStatementId: string;
  explanation?: string;
};

export type GuessTheFakeStatement = {
  id: string;
  text: string;
};
```

The game flow:

1. Configure players, teams, rounds, categories, and packs.
2. Draw one round containing five statements.
3. Player or team selects the fake statement.
4. Reveal the result and optional explanation.
5. Score the round.
6. Continue until the final scoreboard.

## Persistence

Storage keys must be namespaced and versioned:

```txt
gtf.platform.settings.v1
gtf.platform.theme.v1
gtf.platform.leaderboard.v1
gtf.platform.achievements.v1
gtf.platform.content-packs.v1
gtf.game.guess-the-fake.quick-game.v1
gtf.game.guess-the-fake.progress.v1
```

Do not reuse old `npr_`, `mimimania`, `joke`, `mime`, or `drawing` storage names
except inside explicit migration adapters.

## Styling System

Use three layers:

1. Global reset and base layout.
2. Design tokens for colors, typography, spacing, elevation, shape, and motion.
3. Component or screen styles using CSS Modules.

Themes should override CSS variables, not duplicate component CSS.

Responsive behavior should be component-driven:

- Use `clamp`, `minmax`, `aspect-ratio`, and container-friendly layouts.
- Keep game controls reachable on mobile.
- Avoid viewport-scaled typography for controls.
- Test mobile portrait, mobile landscape, tablet, and desktop.

## PWA Strategy

Use Vite PWA tooling to generate a predictable service worker and manifest.
Avoid hand-maintained cache lists unless a specific route requires them.

The app should remain installable and mostly offline after first load.
External runtime CDN dependencies should be bundled or replaced when practical.

## Testing Strategy

Minimum useful coverage before adding new games:

- Game rule tests.
- Content validation tests.
- Storage migration and fallback tests.
- Leaderboard scoring tests.
- Achievement progress tests.
- One build check.
- A small Playwright smoke test for desktop and mobile once the UI shell exists.

## Design Direction

`Guess the Fake` should feel like a polished family quiz table: clear, fast,
playful, and legible across devices. The interface should avoid generic gradient
hero patterns and instead prioritize a strong game surface:

- Five statement cards as the main visual object.
- Clear selected, correct, and fake states.
- Confident typography with large readable statements.
- Compact setup and results screens.
- Themes that feel distinct but share the same layout system.
