import { useState } from 'react';
import type { ContentPack } from '../../core/content-packs/content-packs';
import type { Language } from '../../core/i18n/i18n';
import {
  aboutUsRoundsToPack,
  createEmptyAboutUsEntry,
  getAboutUsEntryIssues,
  type AboutUsEntry,
  type AboutUsEntryIssue
} from '../../game/about-us';
import type { GuessTheFakePackContent, GuessTheFakeState } from '../../game/types';
import type { Translate } from '../app-types';
import type { MatchSetupController } from './useMatchSetup';

export type AboutUsAuthoringController = ReturnType<typeof useAboutUsAuthoring>;

type Step = 'handoff' | 'writing' | 'done';

// W17-01: each player writes their round on the shared device, in turn.
// Memory only: nothing is saved until the match starts.
export function useAboutUsAuthoring({ t, setup }: { t: Translate; setup: Pick<MatchSetupController, 'tablePlayers' | 'setSetupError'> }) {
  const [active, setActive] = useState(false);
  const [names, setNames] = useState<string[]>([]);
  const [entries, setEntries] = useState<AboutUsEntry[]>([]);
  const [index, setIndex] = useState(0);
  const [step, setStep] = useState<Step>('handoff');
  const [issues, setIssues] = useState<AboutUsEntryIssue[]>([]);
  // "Save as local pack" status of the match that just ended.
  const [savedStatus, setSavedStatus] = useState('');

  const entry = entries[index] ?? null;

  function begin() {
    const players = setup.tablePlayers.slice(0, 8);
    if (players.length < 2) {
      setup.setSetupError(t('setup.notEnoughPlayers', { count: 2 }));
      return false;
    }
    setup.setSetupError('');
    setNames(players);
    setEntries(players.map((_, authorIndex) => createEmptyAboutUsEntry(authorIndex)));
    setIndex(0);
    setStep('handoff');
    setIssues([]);
    setSavedStatus('');
    setActive(true);
    return true;
  }

  function saveAsPack(
    state: GuessTheFakeState,
    language: Language,
    savePack: (pack: ContentPack<GuessTheFakePackContent>) => boolean
  ) {
    const date = new Date();
    const pack = aboutUsRoundsToPack(state.rounds, state.players, {
      id: `about-us-${date.getTime().toString(36)}`,
      language,
      title: t('aboutUs.packTitle', { date: date.toLocaleDateString(language) }),
      categoryTitle: t('aboutUs.category'),
      explanationFor: name => t('aboutUs.packExplanation', { name })
    });
    if (savePack(pack)) setSavedStatus(t('aboutUs.saved'));
  }

  function cancel() {
    setActive(false);
    setEntries([]);
    setNames([]);
    setIssues([]);
  }

  function updateEntry(update: (current: AboutUsEntry) => AboutUsEntry) {
    setIssues([]);
    setEntries(current => current.map((candidate, candidateIndex) => (candidateIndex === index ? update(candidate) : candidate)));
  }

  function confirmEntry() {
    if (!entry) return;
    const found = getAboutUsEntryIssues(entry);
    if (found.length) {
      setIssues(found);
      return;
    }
    setIssues([]);
    if (index + 1 >= entries.length) {
      setStep('done');
      return;
    }
    setIndex(index + 1);
    setStep('handoff');
  }

  return {
    active,
    names,
    entries,
    index,
    step,
    entry,
    issues,
    savedStatus,
    saveAsPack,
    authorName: names[index] ?? '',
    begin,
    cancel,
    startWriting: () => setStep('writing'),
    setStatement: (statementIndex: number, text: string) =>
      updateEntry(current => ({
        ...current,
        statements: current.statements.map((statement, candidate) => (candidate === statementIndex ? text : statement))
      })),
    setLie: (lieIndex: number) => updateEntry(current => ({ ...current, lieIndex })),
    confirmEntry
  };
}
