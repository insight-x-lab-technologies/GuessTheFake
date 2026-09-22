---
name: implement-feature
description: Implement a GuessTheFake roadmap item by ID, such as W7-10, W8-01, or W10-03. Use when the user asks Codex CLI to implement a feature from docs/ROADMAP.md, especially with commands like "/implement-feature W7-10", "implemente W7-02", or "build roadmap item W9-01" in the GuessTheFake repository.
---

# Implement Feature

Implement one roadmap item from the GuessTheFake repository end to end.

## Required Context

Before changing files, read these project documents in this order:

1. `CLAUDE.md`
2. `README.md`
3. `docs/FEATURE_IMPLEMENTATION_GUIDE.md`
4. Every document directly referenced by `docs/FEATURE_IMPLEMENTATION_GUIDE.md`, especially:
   - `docs/ROADMAP.md`
   - `docs/ARCHITECTURE.md`
   - `docs/FRONTEND_SYSTEM.md`
5. Source files directly affected by the requested roadmap item.

If any required document is missing, state that explicitly and continue with the best available context.

## Roadmap Lookup

Extract the feature ID from the user request. Accept IDs with optional lowercase or spacing, for example `W7-10`, `w7-10`, or `W7 10`.

In `docs/ROADMAP.md`:

1. Find the exact roadmap item heading matching the ID.
2. Read the full item body until the next numbered roadmap item or next wave heading.
3. Read the surrounding wave objective.
4. If the ID does not exist, stop and report the closest existing IDs in the same wave if discoverable.

Treat the roadmap item as the requested scope. Do not silently implement unrelated items from the same wave.

## Implementation Workflow

1. Inspect current state:
   - Run `git status --short`.
   - Use `rg`/`rg --files` to find relevant files.
   - Read existing tests and local patterns before editing.
2. Classify the feature using the guide categories:
   - Gameplay
   - Conteudo
   - App
   - UI/UX
   - Integracao opcional
3. Choose the correct ownership boundary:
   - Modules that don't know what a round is belong in `src/core`.
   - Guess the Fake domain code (rules, modes, content, copy) belongs in `src/game`.
   - App orchestration/screens may live in `src/app`.
   - `src/core` must never import from `src/game`.
   - Pure game rules must not depend on React, DOM, storage, timers, audio, or network.
4. Implement the smallest coherent slice that satisfies the roadmap item.
5. Add or update tests for changed rules, validators, storage, settings, helpers, or regressions.
6. Update `docs/ROADMAP.md` only when implementation changes the status or details of the item.
7. Run verification:
   - `npm test`
   - `npm run build`

## Project Rules

- Keep the app local-first and static-PWA friendly unless the roadmap item explicitly requires optional infrastructure.
- Preserve the existing architecture and naming conventions.
- Do not leave decorative buttons, settings, or menu entries. Connect real behavior or mark them disabled/coming soon.
- Put all visible UI text in i18n dictionaries.
- Use existing tokens, CSS Modules, and shared UI components before adding new patterns.
- Keep changes scoped to the requested roadmap item.
- Do not revert unrelated user changes in the working tree.

## Final Response

Report:

- The roadmap item implemented.
- Main files changed.
- User-visible behavior delivered.
- Tests/build commands run and whether they passed.
- Any remaining gap or follow-up that is still outside the implemented item.
