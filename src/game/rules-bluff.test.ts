import { describe, expect, it } from 'vitest';
import { getBuiltinRounds } from '../test/builtin';
import { aboutUsRoundsToPack, buildAboutUsRounds, createEmptyAboutUsEntry, getAboutUsEntryIssues, type AboutUsEntry } from './about-us';
import { validateGuessTheFakePack } from './content-schema';
import { GAME_ID } from './modes';
import {
  advanceRound,
  BLUFF_POINTS_PER_FOOLED,
  beginPlaying,
  changeGuessInDiscussion,
  createInitialGuessTheFakeState,
  getActiveGuessSubject,
  getBluffOutcome,
  getHandoffSubject,
  getPendingGuessSubjects,
  getRoundBluffer,
  getRoundTimeSeconds,
  revealDiscussion,
  startMatch,
  submitGuess,
  timeOutRound
} from './rules';
import type { GuessTheFakeState } from './types';

const names = ['Ana', 'Bruno', 'Caio'];

function entry(authorIndex: number, lieIndex = 4): AboutUsEntry {
  return {
    authorIndex,
    lieIndex,
    statements: [1, 2, 3, 4, 5].map(number => `${names[authorIndex]} fact ${number}`)
  };
}

function aboutUsMatch() {
  return beginPlaying(startMatch(createInitialGuessTheFakeState(), {
    modeId: 'about-us',
    playerNames: names,
    totalRounds: 3,
    rounds: buildAboutUsRounds([entry(0), entry(1), entry(2)])
  }));
}

function bluffMasterMatch(tableMoments = false) {
  return beginPlaying(startMatch(createInitialGuessTheFakeState(), {
    modeId: 'bluff-master',
    playerNames: names,
    totalRounds: 4,
    rounds: getBuiltinRounds(),
    tableMoments
  }));
}

function wrongId(state: GuessTheFakeState) {
  const round = state.rounds[state.currentRoundIndex];
  return round.statements.find(statement => statement.id !== round.fakeStatementId)!.id;
}

function fakeId(state: GuessTheFakeState) {
  return state.rounds[state.currentRoundIndex].fakeStatementId;
}

describe('W17-01 about us entries', () => {
  it('needs five distinct statements and a lie', () => {
    expect(getAboutUsEntryIssues(createEmptyAboutUsEntry(0)).sort()).toEqual(['empty-statement', 'no-lie']);
    expect(getAboutUsEntryIssues({ ...entry(0), statements: ['a', 'A', 'b', 'c', 'd'] })).toEqual(['duplicate-statement']);
    expect(getAboutUsEntryIssues({ ...entry(0), statements: ['x'.repeat(141), 'b', 'c', 'd', 'e'] })).toEqual(['too-long']);
    expect(getAboutUsEntryIssues(entry(0))).toEqual([]);
  });

  it('builds one round per valid entry, owned by its author', () => {
    const rounds = buildAboutUsRounds([entry(0, 2), entry(1), createEmptyAboutUsEntry(2)]);
    expect(rounds).toHaveLength(2);
    expect(rounds[0]).toMatchObject({ categoryId: 'about-us', authorPlayerId: 'player-1', fakeStatementId: 'about-us-1-3' });
    expect(rounds[1].authorPlayerId).toBe('player-2');
  });
});

describe('W17-01 about us mode', () => {
  it('skips the author and pays them per fooled guess', () => {
    let state = aboutUsMatch();
    const author = getRoundBluffer(state)!;
    expect(state.rounds[0].authorPlayerId).toBe(author.id);
    expect(getPendingGuessSubjects(state).map(subject => subject.id)).not.toContain(author.id);
    expect(getActiveGuessSubject(state)!.id).not.toBe(author.id);

    const first = getActiveGuessSubject(state)!;
    const opening = state;
    state = submitGuess(state, wrongId(state)).state;
    const handoff = getHandoffSubject(opening, state);
    expect(handoff?.id).not.toBe(first.id);
    expect(state.phase).toBe('playing');
    state = submitGuess(state, fakeId(state)).state;

    expect(state.phase).toBe('revealed');
    expect(getBluffOutcome(state)).toMatchObject({ blufferId: author.id, fooledNames: [first.name], points: BLUFF_POINTS_PER_FOOLED });
    expect(state.players.find(player => player.id === author.id)!.score).toBe(BLUFF_POINTS_PER_FOOLED);
  });

  it('gives every player one authored round and shuffles the lie', () => {
    let state = aboutUsMatch();
    const authors: string[] = [];
    while (state.phase !== 'finished') {
      authors.push(getRoundBluffer(state)!.id);
      state = timeOutRound(state).state;
      state = beginPlaying(advanceRound(state));
      if (state.phase !== 'playing') break;
    }
    expect(authors.sort()).toEqual(['player-1', 'player-2', 'player-3']);
  });

  it('does not count timeouts as fooled', () => {
    const state = timeOutRound(aboutUsMatch()).state;
    expect(getBluffOutcome(state)?.points).toBe(0);
  });

  it('saves the table rounds as a valid local pack', () => {
    const state = aboutUsMatch();
    const pack = aboutUsRoundsToPack(state.rounds, state.players, {
      id: 'about-us-test',
      language: 'pt',
      title: 'Sobre nós',
      categoryTitle: 'Sobre nós',
      explanationFor: name => `Escrita por ${name}`
    });
    expect(validateGuessTheFakePack(pack, { expectedGameId: GAME_ID, language: 'pt' }).ok).toBe(true);
    expect(pack.content.rounds).toHaveLength(3);
    expect(pack.content.rounds.every(round => round.authorPlayerId === undefined)).toBe(true);
    expect(pack.content.rounds[0].explanation).toEqual({ pt: `Escrita por ${state.players.find(player => player.id === state.rounds[0].authorPlayerId)!.name}` });
  });
});

describe('W17-02 bluff master mode', () => {
  it('rotates the master and keeps them out of the vote', () => {
    let state = bluffMasterMatch();
    expect(getRoundBluffer(state)!.id).toBe('player-1');
    expect(getActiveGuessSubject(state)!.id).toBe('player-2');
    state = timeOutRound(state).state;
    state = beginPlaying(advanceRound(state));
    expect(getRoundBluffer(state)!.id).toBe('player-2');
    expect(getActiveGuessSubject(state)!.id).toBe('player-3');
  });

  it('always opens a final defense, then pays the master per fooled vote', () => {
    let state = bluffMasterMatch();
    state = submitGuess(state, wrongId(state), undefined, { remainingSeconds: 50, totalSeconds: 60 }).state;
    const { state: discussing, result } = submitGuess(state, fakeId(state), undefined, { remainingSeconds: 50, totalSeconds: 60 });
    expect(result.speedBonus).toBe(0);
    expect(discussing.phase).toBe('discussing');
    expect(discussing.tableMoment?.kind).toBe('change-mind');

    // Caio changes to a wrong statement in the final defense.
    const changed = changeGuessInDiscussion(discussing, 'player-3', wrongId(discussing));
    const revealed = revealDiscussion(changed);
    expect(revealed.phase).toBe('revealed');
    expect(getBluffOutcome(revealed)!.points).toBe(2 * BLUFF_POINTS_PER_FOOLED);
    expect(revealed.players[0].score).toBe(2 * BLUFF_POINTS_PER_FOOLED);
  });

  it('keeps the final defense even with table moments on', () => {
    let state = bluffMasterMatch(true);
    state = submitGuess(state, wrongId(state)).state;
    state = submitGuess(state, wrongId(state)).state;
    expect(state.tableMoment?.kind).toBe('change-mind');
  });

  it('doubles the round time for the defense', () => {
    expect(getRoundTimeSeconds(bluffMasterMatch(), 60)).toBe(120);
  });
});
