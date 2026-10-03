import { describe, expect, it } from 'vitest';
import { getBuiltinRounds } from '../test/builtin';
import { isSoloMode } from './modes';
import {
  advanceRound,
  assignSpecialRounds,
  beginPlaying,
  changeGuessInDiscussion,
  createInitialGuessTheFakeState,
  getRoundTimeSeconds,
  getTableMomentKind,
  getVisibleStatementCount,
  getWinners,
  prepareRoundsForMatch,
  revealDiscussion,
  revealNextClue,
  startMatch,
  submitGuess,
  TABLE_VOTE_BONUS,
  timeOutRound,
  voteInDiscussion
} from './rules';
import type { GuessTheFakeModeId, GuessTheFakeState, SpecialRoundKind } from './types';

const scoring = { correctGuessPoints: 10, wrongGuessPenalty: 0, speedBonusPoints: 0 };

function play(options: {
  modeId?: GuessTheFakeModeId;
  players?: string[];
  rounds?: number;
  tableMoments?: boolean;
} = {}) {
  return beginPlaying(startMatch(createInitialGuessTheFakeState(), {
    modeId: options.modeId ?? 'classic',
    playerNames: options.players ?? ['Ana', 'Bruno'],
    totalRounds: options.rounds ?? 3,
    rounds: getBuiltinRounds(),
    tableMoments: options.tableMoments
  }));
}

function fakeOf(state: GuessTheFakeState) {
  return state.rounds[state.currentRoundIndex].fakeStatementId;
}

function wrongOf(state: GuessTheFakeState) {
  const round = state.rounds[state.currentRoundIndex];
  return round.statements.find(statement => statement.id !== round.fakeStatementId)!.id;
}

function withSpecial(state: GuessTheFakeState, kind: SpecialRoundKind): GuessTheFakeState {
  const specialRounds = [...state.specialRounds];
  specialRounds[state.currentRoundIndex] = kind;
  return { ...state, specialRoundsEnabled: true, specialRounds };
}

describe('solo mode rules', () => {
  it('starts a solo match with only the first player and the challenge filters', () => {
    const state = startMatch(createInitialGuessTheFakeState(), {
      modeId: 'solo',
      playerNames: ['Ana', 'Bruno'],
      totalRounds: 3,
      rounds: getBuiltinRounds(),
      challenge: { categoryId: 'science', difficulty: 'hard', packIds: ['b', 'a'] },
      tableMoments: true
    });

    expect(isSoloMode(state.modeId)).toBe(true);
    expect(state.players.map(player => player.name)).toEqual(['Ana']);
    expect(state.challenge).toEqual({ categoryId: 'science', difficulty: 'hard', packIds: ['a', 'b'] });
    // Table moments need a table.
    expect(state.tableMoments).toBe(false);
  });

  it('has no winners in solo', () => {
    let state = play({ modeId: 'solo', players: ['Ana'], rounds: 1 });
    state = submitGuess(state, fakeOf(state), scoring).state;
    state = advanceRound(state);

    expect(state.phase).toBe('finished');
    expect(getWinners(state)).toEqual([]);
  });

  it('defaults the challenge to all categories and difficulties', () => {
    expect(play().challenge).toEqual({ categoryId: 'all', difficulty: 'all', packIds: [] });
  });
});

describe('table moments (W13-01)', () => {
  it('rotates defend, vote, and change-mind by round', () => {
    expect([0, 1, 2, 3].map(getTableMomentKind)).toEqual(['defend', 'vote', 'change-mind', 'defend']);
  });

  it('keeps the classic flow unchanged when table moments are off', () => {
    const state = play({ modeId: 'classic' });
    expect(submitGuess(state, fakeOf(state), scoring).state.phase).toBe('revealed');
  });

  it('opens a defend moment before the reveal in classic mode', () => {
    const state = play({ modeId: 'classic', tableMoments: true });
    const discussing = submitGuess(state, fakeOf(state), scoring).state;

    expect(discussing.phase).toBe('discussing');
    expect(discussing.tableMoment).toEqual({ kind: 'defend', votedSubjectId: null, changedSubjectIds: [] });
    expect(discussing.players[0].score).toBe(10);

    const revealed = revealDiscussion(discussing);
    expect(revealed.phase).toBe('revealed');
    expect(revealed.players[0].score).toBe(10);
  });

  it('waits for every guess in all-guess mode and gives the vote bonus at the reveal', () => {
    let state = play({ modeId: 'all-guess', tableMoments: true });
    state = submitGuess(state, fakeOf(state), scoring).state;
    state = submitGuess(state, wrongOf(state), scoring).state;
    state = advanceRound(revealDiscussion(state));
    state = beginPlaying(state);
    state = submitGuess(state, wrongOf(state), scoring).state;
    expect(state.phase).toBe('playing');
    state = submitGuess(state, wrongOf(state), scoring).state;

    expect(state.phase).toBe('discussing');
    expect(state.tableMoment?.kind).toBe('vote');
    const voted = voteInDiscussion(state, 'player-2');
    expect(voted.tableMoment?.votedSubjectId).toBe('player-2');
    expect(voteInDiscussion(state, 'nobody')).toBe(state);

    const revealed = revealDiscussion(voted);
    expect(revealed.players[1].score).toBe(state.players[1].score + TABLE_VOTE_BONUS);
    expect(revealed.players[0].score).toBe(state.players[0].score);
  });

  it('lets a team change its guess once and rescores without the speed bonus', () => {
    let state = play({ modeId: 'teams', players: ['Ana', 'Bruno', 'Caio', 'Dani'], tableMoments: true });
    const speedScoring = { ...scoring, speedBonusPoints: 5 };
    // Rounds 1 and 2: correct guesses build a streak for team 1 and team 2.
    state = advanceRound(revealDiscussion(submitGuess(state, fakeOf(state), speedScoring).state));
    state = beginPlaying(state);
    state = advanceRound(revealDiscussion(submitGuess(state, fakeOf(state), speedScoring).state));
    state = beginPlaying(state);
    // Round 3 (change-mind): team 1 guesses wrong, then changes to the fake.
    const before = state.teams[0].score;
    state = submitGuess(state, wrongOf(state), speedScoring, { remainingSeconds: 10, totalSeconds: 10 }).state;
    expect(state.tableMoment?.kind).toBe('change-mind');
    expect(state.teams[0].score).toBe(before);
    expect(state.currentStreakByTeam['team-1']).toBe(0);

    const changed = changeGuessInDiscussion(state, 'team-1', fakeOf(state), speedScoring);
    expect(changed.roundGuesses['team-1']).toMatchObject({ correct: true, speedBonus: 0, changedMind: true });
    expect(changed.teams[0].score).toBe(before + 10);
    expect(changed.currentStreakByTeam['team-1']).toBe(2);
    expect(changed.correctGuessesInMatch).toBe(state.correctGuessesInMatch + 1);
    // One change per subject.
    expect(changeGuessInDiscussion(changed, 'team-1', wrongOf(changed), speedScoring)).toBe(changed);

    // Changing a correct guess to a wrong one undoes points and streak.
    const undone = changeGuessInDiscussion({ ...changed, tableMoment: { ...changed.tableMoment!, changedSubjectIds: [] } }, 'team-1', wrongOf(changed), speedScoring);
    expect(undone.teams[0].score).toBe(before);
    expect(undone.currentStreakByTeam['team-1']).toBe(0);
    expect(undone.longestStreakInMatch).toBe(1);
  });

  it('skips the moment when the round times out', () => {
    const state = play({ modeId: 'classic', tableMoments: true });
    expect(timeOutRound(state, scoring).state.phase).toBe('revealed');
  });

  it('ignores moment actions of the wrong kind', () => {
    const state = play({ modeId: 'classic', tableMoments: true });
    const defend = submitGuess(state, fakeOf(state), scoring).state;
    expect(voteInDiscussion(defend, 'player-1')).toBe(defend);
    expect(changeGuessInDiscussion(defend, 'player-1', wrongOf(defend))).toBe(defend);
  });
});

describe('special rounds (W13-02)', () => {
  it('assigns one special every three rounds and ends with sudden death', () => {
    const specials = assignSpecialRounds(7, () => 0);
    expect(specials).toEqual([null, null, 'double-or-nothing', null, null, 'double-or-nothing', 'sudden-death']);
    expect(assignSpecialRounds(2, () => 0)).toEqual([null, null]);
    expect(assignSpecialRounds(3, () => 0.99)).toEqual([null, null, 'sudden-death']);
  });

  it('leaves every round regular when special rounds are off', () => {
    const state = play({ rounds: 6 });
    expect(state.specialRoundsEnabled).toBe(false);
    expect(state.specialRounds).toEqual([null, null, null, null, null, null]);
    const enabled = startMatch(createInitialGuessTheFakeState(), {
      playerNames: ['Ana'],
      totalRounds: 6,
      rounds: getBuiltinRounds(),
      specialRounds: true,
      random: () => 0.3
    });
    expect(enabled.specialRounds.filter(Boolean)).toHaveLength(2);
  });

  it('doubles a hit and takes points for a miss in double or nothing, never below zero', () => {
    const base = withSpecial(play({ players: ['Ana'] }), 'double-or-nothing');
    expect(submitGuess(base, fakeOf(base), scoring).result.pointsAwarded).toBe(20);

    const rich = { ...base, players: [{ ...base.players[0], score: 25 }] };
    expect(submitGuess(rich, wrongOf(rich), scoring).state.players[0].score).toBe(15);
    const poor = { ...base, players: [{ ...base.players[0], score: 4 }] };
    expect(submitGuess(poor, wrongOf(poor), scoring).state.players[0].score).toBe(0);
  });

  it('halves the score on a sudden death miss', () => {
    const base = withSpecial(play({ players: ['Ana'] }), 'sudden-death');
    const rich = { ...base, players: [{ ...base.players[0], score: 31 }] };
    expect(submitGuess(rich, wrongOf(rich), scoring).state.players[0].score).toBe(16);
    expect(submitGuess(rich, fakeOf(rich), scoring).state.players[0].score).toBe(41);
  });

  it('hides statements in a gradual clue round and pays for hidden ones', () => {
    const base = withSpecial(play({ players: ['Ana'] }), 'gradual-clue');
    const round = base.rounds[0];
    expect(getVisibleStatementCount(base)).toBe(2);
    expect(() => submitGuess(base, round.statements[4].id, scoring)).toThrow(/hidden/);

    const more = revealNextClue(base);
    expect(getVisibleStatementCount(more)).toBe(3);
    const fakeIndex = round.statements.findIndex(statement => statement.id === round.fakeStatementId);
    let state = base;
    while (getVisibleStatementCount(state) <= fakeIndex) state = revealNextClue(state);
    const hidden = round.statements.length - getVisibleStatementCount(state);
    expect(submitGuess(state, round.fakeStatementId, scoring).result.pointsAwarded).toBe(10 + hidden * 2);
    expect(revealNextClue(play())).toEqual(play());
  });

  it('shortens the lightning timer and doubles its speed bonus', () => {
    const base = withSpecial(play({ players: ['Ana'] }), 'lightning');
    expect(getRoundTimeSeconds(base, 60)).toBe(20);
    expect(getRoundTimeSeconds(base, 15)).toBe(10);
    expect(getRoundTimeSeconds(play(), 60)).toBe(60);
    const { result } = submitGuess(base, fakeOf(base), { ...scoring, speedBonusPoints: 5 }, { remainingSeconds: 20, totalSeconds: 20 });
    expect(result.speedBonus).toBe(10);
  });

  it('pays 1.5x for a category challenge hit', () => {
    const base = withSpecial(play({ players: ['Ana'] }), 'category-challenge');
    expect(submitGuess(base, fakeOf(base), scoring).result.pointsAwarded).toBe(15);
    expect(submitGuess(base, wrongOf(base), scoring).result.pointsAwarded).toBe(0);
  });
});

describe('round draw (W13-05)', () => {
  it('draws deprioritized rounds only after every other round', () => {
    const rounds = getBuiltinRounds().slice(0, 5);
    const ordered = prepareRoundsForMatch(rounds, {
      shuffle: false,
      deprioritizedRoundIds: [rounds[0].id, rounds[2].id]
    });
    expect(ordered.map(round => round.id)).toEqual([rounds[1].id, rounds[3].id, rounds[4].id, rounds[0].id, rounds[2].id]);
  });
});
