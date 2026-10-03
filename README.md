# Guess the Fake

Guess the Fake is a local-first family party game built with Vite, React,
TypeScript, and PWA support. Among five statements, players find the fake one.

It is a single, self-contained game: no backend, no accounts, no game launcher.

## Current Scope

- Responsive web app for desktop, tablet, and mobile, installable as a PWA.
- Solo challenge with personal records, plus classic, all-guess, teams,
  "About us" (the table writes the rounds) and "Bluff master" modes, with
  speed bonus, streaks, category, difficulty and Kids filters, and resumable
  matches.
- Optional table moments and special rounds, local family profiles, progress
  tracks with a next objective, match suggestions, a presenter (TV) view, and
  themed pack metadata.
- 360 curated built-in rounds (8 categories, 15 per category and difficulty)
  plus 105 Kids rounds for ages 6-9, in six languages, loaded per language on
  demand. Three optional seasonal packs (Christmas, Halloween, World Cup and
  Olympics) download only when turned on.
- In-app pack editor: create, validate, save, and export community packs.
- Local scores, trophies, content packs, content feedback, themes, and settings,
  all persisted in versioned localStorage.
- Optional local-first multi-device companion screen (no server).
- Light first visit: about 2.3 MB precached; music loops download the first
  time they play and then work offline. In-app update and offline notices.
- 47 test files / 248 tests in Vitest, including a responsive smoke across five
  viewports and a content coverage audit.

Known limits: multi-device pairing is manual.
See `docs/ROADMAP.md` for the full status.

## Scripts

```bash
npm run dev      # vite --host 0.0.0.0
npm test         # vitest run
npm run build    # tsc -b && vite build
npm run preview
npm run test:e2e # Playwright smoke in real Chromium (3 viewports)
```

There is no lint script. Typecheck runs inside `npm run build`.

Pushing to `main` runs tests, builds, and deploys to GitHub Pages via
`.github/workflows/static.yml`.

## Architecture

Start with `CLAUDE.md` for session orientation, then:

- `docs/ROADMAP.md` - what is done and what is left
- `docs/ARCHITECTURE.md` - boundaries, contracts, storage keys
- `docs/FEATURE_IMPLEMENTATION_GUIDE.md` - how to ship a feature
- `docs/FRONTEND_SYSTEM.md` - layout, breakpoints, title hierarchy
- `docs/DEVICE_VALIDATION.md` - responsive viewports

The source splits into four folders:

```txt
src/app       # shell: screens, state, timers, side effects
src/core      # modules that don't know what a round is
src/game      # Guess the Fake rules, content, and copy
src/styles    # global reset, tokens, and base styles
```

The `core` / `game` split exists to keep round logic pure and cheap to test,
not to support future games. `core` must never import from `game`.

Inside `src/app`, `App.tsx` is only the shell. State, timers, and side effects
live in hooks under `src/app/hooks/`, and each screen is a presentational
component under `src/app/screens/`.
