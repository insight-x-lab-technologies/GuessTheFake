import { describe, expect, it } from 'vitest';
import type { StorageAdapter } from '../core/storage/storage';
import { validateGuessTheFakePack } from './content-schema';
import { GAME_ID } from './modes';
import {
  createCustomCategory,
  createEmptyPackDraft,
  createPackId,
  draftToPack,
  getDraftIssues,
  loadPackDraft,
  packToDraft,
  savePackDraft,
  validateDraftPack,
  type PackDraft
} from './pack-editor';

function createMemoryStorage(): StorageAdapter {
  const values = new Map<string, string>();
  return {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => void values.set(key, value),
    removeItem: key => void values.delete(key)
  };
}

const history = { id: 'history', title: { pt: 'História', en: 'History' } };

function filledDraft(): PackDraft {
  const draft = createEmptyPackDraft('pt', [history]);
  return {
    ...draft,
    title: 'Pack da vovó',
    rounds: [{
      ...draft.rounds[0],
      statements: ['Um', 'Dois', 'Três', 'Quatro', 'Cinco'],
      fakeIndex: 2,
      explanation: 'Três é a falsa.'
    }]
  };
}

describe('W17-05 pack editor', () => {
  it('lists localized issues with their position', () => {
    const issues = getDraftIssues(createEmptyPackDraft('pt', [history]));
    expect(issues.map(issue => issue.key)).toEqual([
      'editor.issue.title',
      ...Array(5).fill('editor.issue.statement'),
      'editor.issue.fake',
      'editor.issue.explanation'
    ]);
    expect(issues[1]).toMatchObject({ roundIndex: 0, statementIndex: 0 });
  });

  it('flags repeated statements across the pack', () => {
    const draft = filledDraft();
    const twice = { ...draft, rounds: [draft.rounds[0], { ...draft.rounds[0], key: 'other' }] };
    expect(getDraftIssues(twice).filter(issue => issue.key === 'editor.issue.duplicate')).toHaveLength(5);
  });

  it('turns a clean draft into a pack that passes the content schema', () => {
    const result = validateDraftPack(filledDraft(), 'local-test', '2026-10-03');
    expect(result.issues).toEqual([]);
    expect(result.ok).toBe(true);
    expect(validateGuessTheFakePack(result.pack, { expectedGameId: GAME_ID, language: 'pt' }).ok).toBe(true);
    expect(result.pack.content.rounds[0].fakeStatementId).toBe('local-test-001-c');
    expect(result.pack.languages).toEqual(['pt']);
  });

  it('keeps only the categories in use and adds custom ones', () => {
    const custom = createCustomCategory('Comida de rua', 'pt', [history])!;
    expect(custom.id).toBe('custom-comida-de-rua');
    expect(createCustomCategory('história', 'pt', [history])).toBeNull();
    const draft = { ...filledDraft(), categories: [history, custom] };
    draft.rounds[0].categoryId = custom.id;
    expect(draftToPack(draft, 'p', '2026-10-03').content.categories).toEqual([custom]);
  });

  it('round-trips an installed pack for editing', () => {
    const pack = draftToPack(filledDraft(), 'local-test', '2026-10-03');
    const draft = packToDraft(pack, 'en');
    expect(draft).toMatchObject({ packId: 'local-test', language: 'pt', title: 'Pack da vovó' });
    expect(draft.rounds[0]).toMatchObject({ fakeIndex: 2, explanation: 'Três é a falsa.' });
    expect(draftToPack(draft, 'local-test', '2026-10-03').content).toEqual(pack.content);
  });

  it('makes readable unique ids', () => {
    expect(createPackId('Pack da Vovó!', 1_000)).toBe('local-pack-da-vovo-rs');
  });

  it('keeps the draft in versioned storage', () => {
    const storage = createMemoryStorage();
    savePackDraft(filledDraft(), storage);
    expect(loadPackDraft(storage)?.title).toBe('Pack da vovó');
    savePackDraft(null, storage);
    expect(loadPackDraft(storage)).toBeNull();
  });
});
