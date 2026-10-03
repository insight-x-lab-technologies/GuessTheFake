import { useEffect, useMemo, useState } from 'react';
import type { ContentPack } from '../../core/content-packs/content-packs';
import type { Language } from '../../core/i18n/i18n';
import { BUILTIN_CATEGORIES } from '../../game/data/builtin/catalog';
import {
  createCustomCategory,
  createEmptyDraftRound,
  createEmptyPackDraft,
  createPackId,
  getDraftIssues,
  loadPackDraft,
  mergeDraftCategories,
  packToDraft,
  savePackDraft,
  validateDraftPack,
  type PackDraft,
  type PackDraftRound
} from '../../game/pack-editor';
import type { GuessTheFakePackContent } from '../../game/types';
import type { Translate } from '../app-types';
import { downloadJson } from '../browser';
import type { PacksController } from './usePacks';
import { memoryStorage } from './storage-fallback';

export type PackEditorController = ReturnType<typeof usePackEditor>;

const storage = () => (typeof localStorage === 'undefined' ? memoryStorage : localStorage);

// W17-05: the pack editor. The draft is saved locally on every change, so
// leaving the screen (or reloading) never loses work.
export function usePackEditor({ t, language, packs }: { t: Translate; language: Language; packs: Pick<PacksController, 'savePack'> }) {
  const [draft, setDraft] = useState<PackDraft | null>(() => loadPackDraft(storage()));
  const [open, setOpen] = useState(false);
  const [showIssues, setShowIssues] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    savePackDraft(draft, storage());
  }, [draft]);

  const issues = useMemo(() => (draft ? getDraftIssues(draft) : []), [draft]);

  function change(update: (current: PackDraft) => PackDraft) {
    setStatus('');
    setDraft(current => (current ? update(current) : current));
  }

  function changeRound(roundIndex: number, update: (round: PackDraftRound) => PackDraftRound) {
    change(current => ({
      ...current,
      rounds: current.rounds.map((round, index) => (index === roundIndex ? update(round) : round))
    }));
  }

  function start() {
    setStatus('');
    setShowIssues(false);
    setDraft(current => current ?? createEmptyPackDraft(language, BUILTIN_CATEGORIES));
    setOpen(true);
  }

  function editPack(pack: ContentPack<GuessTheFakePackContent>) {
    const loaded = packToDraft(pack, language);
    setStatus('');
    setShowIssues(false);
    setDraft({ ...loaded, categories: mergeDraftCategories(BUILTIN_CATEGORIES, loaded.categories) });
    setOpen(true);
  }

  // Validates, then hands the pack to `use` (save or export).
  function withValidPack(use: (pack: ContentPack<GuessTheFakePackContent>, packId: string) => void) {
    if (!draft) return;
    const packId = draft.packId ?? createPackId(draft.title, Date.now());
    const result = validateDraftPack(draft, packId, new Date().toISOString().slice(0, 10));
    if (!result.ok) {
      setShowIssues(true);
      setStatus(t('editor.invalid', { count: Math.max(1, result.issues.length) }));
      return;
    }
    setShowIssues(false);
    use(result.pack, packId);
  }

  return {
    draft,
    open,
    issues,
    showIssues,
    status,
    start,
    editPack,
    close: () => setOpen(false),
    discard: () => {
      setDraft(null);
      setOpen(false);
      setStatus('');
    },
    validate: () => {
      setShowIssues(true);
      setStatus(issues.length ? t('editor.invalid', { count: issues.length }) : t('editor.valid'));
    },
    save: () => withValidPack((pack, packId) => {
      if (!packs.savePack(pack)) return;
      setDraft(current => (current ? { ...current, packId } : current));
      setStatus(t('editor.saved'));
    }),
    exportJson: () => withValidPack((pack, packId) => {
      downloadJson(`${packId}.json`, JSON.stringify({ pack }, null, 2));
      setStatus(t('editor.exported'));
    }),
    setTitle: (title: string) => change(current => ({ ...current, title })),
    setDescription: (description: string) => change(current => ({ ...current, description })),
    setEmoji: (emoji: string) => change(current => ({ ...current, emoji })),
    setLanguage: (next: Language) => change(current => ({ ...current, language: next })),
    addCategory: (name: string) => {
      if (!draft) return false;
      const category = createCustomCategory(name, draft.language, draft.categories);
      if (!category) return false;
      change(current => ({ ...current, categories: [...current.categories, category] }));
      return true;
    },
    addRound: () => change(current => ({
      ...current,
      rounds: [
        ...current.rounds,
        createEmptyDraftRound(current.rounds.at(-1)?.categoryId ?? current.categories[0]?.id ?? 'custom', current.rounds.length + 1)
      ]
    })),
    removeRound: (roundIndex: number) => change(current => ({
      ...current,
      rounds: current.rounds.filter((_, index) => index !== roundIndex)
    })),
    setRoundField: <K extends 'categoryId' | 'difficulty' | 'fakeIndex' | 'explanation'>(roundIndex: number, key: K, value: PackDraftRound[K]) =>
      changeRound(roundIndex, round => ({ ...round, [key]: value })),
    setStatement: (roundIndex: number, statementIndex: number, text: string) =>
      changeRound(roundIndex, round => ({
        ...round,
        statements: round.statements.map((statement, index) => (index === statementIndex ? text : statement))
      }))
  };
}
