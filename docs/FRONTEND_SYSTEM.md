# Frontend System

This document defines the responsive interface contract for Guess the Fake.
The goal is to make every new screen start from a known layout system instead
of re-solving desktop, tablet, mobile, motion, and title hierarchy each time.

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
the viewport instead of forcing desktop/tablet scrolling. Mobile portrait
switches to a single-column stack and **removes** line clamping so long
statements wrap naturally; clamping is reapplied only in the short-height
landscape modes.

## Backgrounds and Motion

The app includes an `ambientBackdrop` layer behind all screens. It is fixed,
non-interactive, theme-driven, and animated through CSS variables defined per
theme in `src/styles/tokens.css`:

- `--ambient-a`
- `--ambient-b`

Themes can define animated atmosphere without changing screen markup. Motion is
disabled under `prefers-reduced-motion: reduce`.

## Typographic Scale

`src/styles/tokens.css` derives every size from `--font-scale`, which the font
size setting overrides with five levels (`xs` 0.9 through `xl` 1.16). Use the
`--title-*` and `--text-*` tokens instead of hard-coded sizes so the setting
keeps working.

## Labels and Wrapping

Short labels (`compactRows b`, share/donation buttons, header pills) must never
break mid-word. Keep icons at `flex: none`, give labels `flex: none` with a
`max-width` cap, and use `overflow-wrap: break-word` so only words that cannot
fit on a line are split. Reserve `overflow-wrap: anywhere` for free text such as
URLs, codes, and user content.

The "Apoiar" (`growth`) screen uses two columns on desktop (donation and share)
with the install card spanning the full width; its status rows become three
columns there and collapse to one column at `<= 1100px`.

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
- `<= 680px`: mobile, bottom tabs, one-column statement grid.
- `max-height: 760px` and `min-width: 681px`: compact desktop/tablet mode.
- `max-height: 520px`, landscape, `<= 1000px`: compact phone landscape.
- `max-height: 420px`, landscape, `<= 920px`: ultra-compact phone landscape.

All of them live in `src/app/App.module.css`. Utility screens on mobile keep
secondary data actions inside collapsed `<details data-mobile-actions="...">`
disclosures so the primary content stays above the fold.

New screens should reuse the same shell behavior unless the interaction genuinely
needs a custom surface.
