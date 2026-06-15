# Frontend System

This document defines the responsive interface contract for the game platform.
The goal is to make every new game start from a known layout system instead of
re-solving desktop, tablet, mobile, motion, and title hierarchy each time.

## Screen Layout

The app shell uses a persistent navigation/sidebar on desktop and a stacked
navigation region on tablet/mobile.

- Desktop: `18rem` navigation column plus one game surface column.
- Tablet: navigation becomes a wrapped top region; the game surface gets the
  remaining viewport height.
- Mobile: content may scroll when necessary, but the active game board is
  designed to remain compact and usable without relying on long vertical pages.

Primary game screens use `100dvh` instead of `100vh` so mobile browser chrome is
handled more predictably.

## Title Hierarchy

Use explicit title classes:

- `heroTitle`: one-per-home/landing experience.
- `pageTitle`: screen-level title, used for setup, active turn, results, and
  utility screens.
- `cardTitle`: repeated card/module title, used inside achievement/content/result
  cards.

This prevents oversized display text from leaking into compact cards.

## Game Surface

The active game board has four rows:

1. Header and player/score context.
2. Prompt or instruction.
3. Main interaction surface.
4. Result/action panel.

The statement grid uses `minmax(0, 1fr)` rows and columns so cards shrink within
the viewport instead of forcing desktop/tablet scrolling. Mobile switches to a
single-column stack with shorter cards and line clamping.

## Backgrounds and Motion

The app includes an `ambientBackdrop` layer behind all screens. It is fixed,
non-interactive, theme-driven, and animated through CSS variables:

- `--ambient-a`
- `--ambient-b`
- `--bg-pattern`

Themes can define animated atmosphere without changing screen markup. Motion is
disabled under `prefers-reduced-motion: reduce`.

## Buttons and Press States

Shared buttons live in `src/core/ui/Button.tsx` and `Button.module.css`.

All buttons support:

- hover lift
- pressed scale/translation
- disabled state
- focus-visible outline
- theme-aware colors

Navigation buttons and statement cards use the same pressed-state language so
the app feels consistent across game actions and shell actions.

## Responsive Breakpoints

Current breakpoints:

- `> 1100px`: desktop, sidebar layout, five statement cards in one row.
- `681px - 1100px`: tablet, top navigation, two-column statement grid.
- `<= 680px`: mobile, top navigation, one-column statement grid.
- `max-height: 760px`: compact desktop/tablet mode.

Future game screens should reuse the same shell behavior unless a specific game
needs a custom interaction surface.
