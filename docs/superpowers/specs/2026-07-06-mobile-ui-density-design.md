# Mobile UI Density Review

## Scope

Refine the mobile presentation of gameplay reveal controls, Leaderboard,
Achievements, Packs, and New Game. Preserve desktop/tablet behavior, existing
themes, application architecture, game rules, persistence, and visible copy.

## Design

### Gameplay reveal

At `<= 680px`, replace the current two-column result/action composition with a
single vertical flow. Keep the result explanation and score breakdown first,
render the three content-feedback controls as a compact equal-width row, and
place the primary next-round action below at normal control height and full
available width. Controls must remain at least 44px tall and tolerate translated
labels without horizontal overflow.

### Utility screens

Leaderboard and Packs use a compact page header on mobile. Rare data-management
commands move into a disclosure labelled `Ações`; the primary filters, pack
status, and page content appear before those commands consume vertical space.
Destructive actions retain their existing confirmation behavior and visual
severity. Achievements replaces its tall introductory card with a compact
progress summary, followed immediately by the achievement list. None of these
mobile headers or cards is sticky; the screen uses one natural scroll region.

Desktop and tablet retain their current expanded action clusters and layout.

### New Game modes

The selected mode remains persistent through `aria-pressed="true"`, an accent
border, a subtly accented background, and a visible selection indicator. Hover
changes only the surface/elevation and never uses the selected border treatment.
Keyboard focus uses the existing focus-visible outline, distinct from both.
Touch devices therefore show only the selected state, with no ambiguous stale
hover highlight.

## Architecture

Composition remains in `src/app/App.tsx` and screen wrappers. Responsive styling
remains in `src/app/App.module.css`; shared controls are changed only if their
generic contract requires it. No game-domain or storage module changes are
needed. New visible labels, if any, must use the existing app translation map.

## Accessibility and responsive constraints

- Preserve semantic buttons, `aria-pressed`, labels, and disclosure state.
- Maintain 44px minimum touch targets and visible keyboard focus.
- Avoid horizontal overflow at 320px width and with longer English labels.
- Respect safe-area/nav occupancy and `prefers-reduced-motion`.
- Preserve current behavior above the mobile breakpoint.

## Verification

- Add or update UI tests for selected versus hover-capable mode styling hooks,
  disclosure accessibility, and the feedback/next-round interaction flow.
- Run unit/UI tests and production build.
- Run responsive smoke checks at 320x568 and a modern iPhone portrait viewport,
  covering all five affected screens and gameplay after answer reveal.

## Out of scope

No redesign of visual identity, navigation, game rules, data formats, content,
desktop/tablet information architecture, or unrelated screens.
