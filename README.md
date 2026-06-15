# Guess the Fake

Guess the Fake is a local-first family game platform built with Vite, React,
TypeScript, and PWA support. The first game asks players to identify the fake
statement among five claims.

## Current Scope

- Reusable platform structure for future games.
- Responsive web app for desktop, tablet, and mobile.
- Shared settings, themes, leaderboard, achievements, and content pack modules.
- First playable `Guess the Fake` implementation.
- Unit tests for core game rules.

## Scripts

```bash
npm run dev
npm run build
npm test
```

## Architecture

See:

- `docs/ARCHITECTURE.md`
- `docs/MIGRATION_PLAN.md`
- `docs/ROADMAP.md`
- `docs/FEATURE_IMPLEMENTATION_GUIDE.md`

The active source follows this split:

```txt
src/app       # App shell and screens
src/core      # Reusable platform modules
src/games     # Game-specific manifests, rules, data, and screens
src/styles    # Global reset, tokens, and base styles
```

## Adding Future Games

Create a new folder under `src/games/<game-id>` with:

- `game.manifest.ts`
- `rules.ts`
- `types.ts`
- built-in content or pack adapters
- translations
- game-specific screens when needed

Shared behavior should stay in `src/core`.
