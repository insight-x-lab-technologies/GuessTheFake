# Migration Plan

This plan rebuilds the current static prototype into a reusable game platform
before implementing the new `Guess the Fake` game.

## Phase 1: Architecture Documents

Status: complete.

Deliverables:

- `docs/ARCHITECTURE.md`
- `docs/MIGRATION_PLAN.md`

Acceptance criteria:

- The target stack is defined.
- The reusable platform boundary is clear.
- The first game contract is defined.
- Naming conventions and storage conventions are documented.

## Phase 2: Modern Scaffold

Status: complete.

Create a Vite + React + TypeScript application.

Deliverables:

- `vite.config.ts`
- `tsconfig.json`
- `index.html`
- `src/app/main.tsx`
- `src/app/App.tsx`
- Base CSS files under `src/styles`
- Updated `package.json` scripts

Acceptance criteria:

- `npm run build` succeeds.
- App renders a minimal shell.
- Old prototype files are either removed or moved to a legacy reference area.

## Phase 3: Core Platform Modules

Status: partial.

Extract the reusable foundation.

Deliverables:

- `core/storage`
- `core/i18n`
- `core/themes`
- `core/settings`
- `core/leaderboard`
- `core/achievements`
- `core/content-packs`
- `core/audio`
- `core/ui`

Acceptance criteria:

- Modules are game-agnostic.
- Public types are explicit.
- Pure utilities have unit tests where useful.

## Phase 4: Game Registry

Status: partial.

Create the contract that future games will use.

Deliverables:

- `core/games` or equivalent registry types.
- `games/guess-the-fake/game.manifest.ts`.
- Placeholder route/screen for the active game.

Acceptance criteria:

- The app shell can render a game from a manifest.
- The manifest contains title, modes, settings, and content schema version.

## Phase 5: Responsive UI Shell

Status: partial.

Build the professional reusable frontend shell.

Deliverables:

- Home/menu screen.
- Setup shell.
- Game screen shell.
- Results/final shell.
- Settings screen.
- Leaderboard screen.
- Achievements screen.
- Content packs screen.

Acceptance criteria:

- Layout works on mobile, tablet, and desktop.
- Components are reusable and not tied to `Guess the Fake` copy.
- Theme tokens drive the visual system.

## Phase 6: PWA, I18n, Storage, and Tests

Status: partial.

Make the base robust enough for future games.

Deliverables:

- PWA manifest and service worker via Vite.
- Translation dictionaries for at least `pt` and `en`.
- Versioned storage helpers.
- Initial Vitest setup.

Acceptance criteria:

- Build works.
- Unit tests run.
- App has a valid manifest.
- Settings persist locally.

## Phase 7: Guess the Fake Base Game

Status: partial, playable.

Implement the first playable version.

Deliverables:

- Guess the Fake rules.
- Round/content model.
- Sample built-in pack.
- Setup flow.
- Round flow with five statements.
- Result reveal.
- Scoring and final scoreboard.

Acceptance criteria:

- A local game can be completed from start to finish.
- Rules are covered by unit tests.
- UI remains responsive.

## Phase 8: Verification and Polish

Status: partial.

Validate the app as a foundation for future games.

Deliverables:

- `npm run build`
- `npm test`
- Responsive smoke checks.
- README updated for the new project.

Acceptance criteria:

- No legacy No Laughing Allowed branding remains in active app files.
- The codebase has clear separation between platform and game.
- The next game can be added by creating a new folder under `src/games`.

## Migration Notes From Prototype

The current prototype contains valuable features but should not remain as the
active architecture:

- `src/script.js` mixes game rules, DOM rendering, storage, i18n, audio, PWA,
  content packs, achievements, leaderboard, and multi-device logic.
- `src/index.html` owns all screens statically.
- `src/style.css` contains global layout and component styles in one file.
- `src/translations.js` contains all languages in one global object.
- `src/service-worker.js` has old cache naming.
- Legacy terms such as `npr`, `joke`, `word`, `mime`, and `drawing` need to be
  removed from active platform code unless they belong to a legacy adapter.

The rebuild can delete or replace active files because the original game is
preserved in another repository.
