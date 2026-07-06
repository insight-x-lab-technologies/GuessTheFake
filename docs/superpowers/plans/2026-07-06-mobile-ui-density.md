# Mobile UI Density Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the five affected mobile screens prioritize playable/content space while preserving desktop and tablet layouts.

**Architecture:** Keep screen composition in `src/app/App.tsx` and encode the mobile-only layout contract in `src/app/App.module.css`. Use native `details`/`summary` for infrequent data actions, avoiding new state or shared abstractions; keep all domain and persistence behavior unchanged.

**Tech Stack:** React 19, TypeScript, CSS Modules, Testing Library, Vitest, Vite.

---

### Task 1: Compact utility actions

**Files:**
- Modify: `src/app/App.tsx:2076-2107,2296-2322`
- Modify: `src/app/translations.ts`
- Test: `src/app/responsive-smoke.test.tsx`

- [ ] **Step 1: Write the failing disclosure test**

Add a smoke assertion that Leaderboard exposes a closed `details` control named from the new `common.actions` translation, then navigate to Packs and assert the same control exists there. Assert the existing import/export/reset buttons remain descendants of the disclosure.

- [ ] **Step 2: Verify RED**

Run `rtk npm test -- src/app/responsive-smoke.test.tsx` and confirm failure because no actions disclosure exists.

- [ ] **Step 3: Add the minimal semantic disclosure**

Add `common.actions: 'Ações'` / `'Actions'` to the two translation dictionaries. Wrap each existing `.actionCluster` in:

```tsx
<details className={styles.mobileActionDisclosure}>
  <summary>{t('common.actions')}</summary>
  <div className={styles.actionCluster}>...</div>
</details>
```

Retain a second desktop action cluster via a `.desktopActions` wrapper so controls are not hidden behind a disclosure above 680px. Do not duplicate event logic: extract each action cluster into a local JSX value immediately before the relevant screen return, or render the same button definitions through a small local function.

- [ ] **Step 4: Style mobile-only disclosure**

Default `.mobileActionDisclosure { display: none; }`; under `@media (max-width: 680px)`, show it as a compact bordered surface, style `summary` as a 44px touch target, hide `.desktopActions`, and make the expanded `.actionCluster` a single-column compact list. Keep both hidden inputs unchanged.

- [ ] **Step 5: Verify GREEN**

Run `rtk npm test -- src/app/responsive-smoke.test.tsx`; expect all tests in the file to pass.

### Task 2: Clarify New Game selection state

**Files:**
- Modify: `src/app/App.tsx:1709-1730`
- Modify: `src/app/App.module.css:1147-1178`
- Test: `src/app/responsive-smoke.test.tsx`

- [ ] **Step 1: Write the failing selected-indicator test**

In the setup smoke flow, assert the pressed mode contains an element with accessible text `Selecionado`/`Selected`, while an unpressed mode does not.

- [ ] **Step 2: Verify RED**

Run `rtk npm test -- src/app/responsive-smoke.test.tsx`; confirm failure because the indicator is absent.

- [ ] **Step 3: Add translated selected indicator**

Add `setup.selected: 'Selecionado'` / `'Selected'`. Inside each mode button, render:

```tsx
{selectedModeId === mode.id ? (
  <span className={styles.modeSelected}><CheckCircle2 size={14} />{t('setup.selected')}</span>
) : null}
```

- [ ] **Step 4: Separate hover, selected, and focus styles**

Make `.modeCard:hover` change only background and translation. Give `.modeCard[aria-pressed="true"]` the accent border, accented background, and inset ring. Add `.modeCard:focus-visible` using the standard focus outline. Suppress hover translation inside `@media (hover: none)` and style `.modeSelected` as a compact accent label.

- [ ] **Step 5: Verify GREEN**

Run `rtk npm test -- src/app/responsive-smoke.test.tsx`; expect the mode test to pass.

### Task 3: Reflow gameplay reveal and compact Achievements

**Files:**
- Modify: `src/app/App.module.css:822-845,1321-1390,1622-1814`
- Test: `src/app/gameplay-click-feedback.test.tsx`
- Test: `src/app/responsive-smoke.test.tsx`

- [ ] **Step 1: Add structural regression assertions**

Assert the revealed result has the existing feedback group before the Next Round button in DOM order. On Achievements, assert completion remains visible and the achievement list follows the compact header/summary without a second fixed or sticky region.

- [ ] **Step 2: Verify RED for a mobile layout hook**

Add `data-layout="mobile-stack"` to the expected result panel in the test first and confirm `rtk npm test -- src/app/gameplay-click-feedback.test.tsx` fails because the hook is absent. Then add that stable hook to the result panel; CSS remains responsible for breakpoint behavior.

- [ ] **Step 3: Implement mobile result flow**

Inside `@media (max-width: 680px)`, set `.resultPanel` to one column, reduce padding/gaps, keep its icon/title/explanation compact, set `.feedbackActions` to a three-column grid, remove feedback button fixed minimum widths, retain at least 44px height, and make the direct primary button full width with ordinary button height.

- [ ] **Step 4: Compact utility page headers and achievement summary**

At the same breakpoint, reduce `.panel` and `.pageHeader` gaps/padding; lay out the screen mark beside title copy; make `.sessionCode` a compact full-width progress strip; reduce mobile metric cards and use a horizontally scrollable one-row `.statGrid` for summary metrics. Ensure `.panel`, `.pageHeader`, and summary elements use `position: static` and one natural scroll region.

- [ ] **Step 5: Verify GREEN**

Run `rtk npm test -- src/app/gameplay-click-feedback.test.tsx src/app/responsive-smoke.test.tsx`; expect both files to pass.

### Task 4: Full verification and visual smoke

**Files:**
- Modify only if verification exposes a scoped regression.

- [ ] **Step 1: Run automated checks**

Run `rtk npm test` and `rtk npm run build`; require zero failures and exit code 0.

- [ ] **Step 2: Run responsive browser smoke**

Start `rtk npm run dev`, then inspect 320x568 and 430x932 viewports for New Game, revealed gameplay, Leaderboard, Achievements, and Packs. Confirm no horizontal overflow, 44px touch targets, natural scrolling, compact collapsed actions, visible content above the bottom navigation, and unchanged desktop layout at 1440x900.

- [ ] **Step 3: Review the diff**

Run `rtk git diff --check` and `rtk git diff --stat`; confirm no whitespace errors and only scoped app/test/translation/CSS/plan files changed.

- [ ] **Step 4: Commit implementation**

Stage only the scoped files and commit with `fix: improve mobile game screen density`.
