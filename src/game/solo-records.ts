import { createStorageKey, readVersioned, writeVersioned, type StorageAdapter } from '../core/storage/storage';
import { isSoloMode } from './modes';
import type { GuessTheFakeDifficulty, GuessTheFakeState } from './types';

export type SoloChallenge = {
  totalRounds: number;
  categoryId: string;
  difficulty: GuessTheFakeDifficulty | 'all';
  // W13-02: special rounds change the challenge.
  specialRounds?: boolean;
  // W13-07: installed packs active in the match change the challenge.
  packIds?: string[];
  // W17-03: kids-only content changes the challenge.
  kids?: boolean;
};

export type SoloResult = {
  points: number;
  correct: number;
  totalRounds: number;
  bestStreak: number;
  achievedAt: string;
};

export type SoloRecordsModel = {
  // playerKey -> challengeKey -> best result.
  records: Record<string, Record<string, SoloResult>>;
};

export type SoloRecordRow = SoloResult & {
  playerKey: string;
  challengeKey: string;
  challenge: SoloChallenge;
};

export const SOLO_RECORDS_VERSION = 1;
// Same scope as match-storage: a record depends on domain filters.
export const SOLO_RECORDS_KEY = createStorageKey('game.guess-the-fake', 'solo-records', SOLO_RECORDS_VERSION);

const PROFILE_KEY_PREFIX = 'profile:';

export function createEmptySoloRecords(): SoloRecordsModel {
  return { records: {} };
}

// "<rounds>|<category>|<difficulty>" plus optional segments for later waves.
export function getSoloChallengeKey(challenge: SoloChallenge) {
  const segments = [String(challenge.totalRounds), challenge.categoryId, challenge.difficulty];
  if (challenge.specialRounds) segments.push('special');
  const packIds = [...(challenge.packIds ?? [])].sort();
  if (packIds.length) segments.push(`packs:${packIds.join('+')}`);
  if (challenge.kids) segments.push('kids');
  return segments.join('|');
}

export function parseSoloChallengeKey(key: string): SoloChallenge {
  const [rounds, categoryId = 'all', difficulty = 'all', ...rest] = key.split('|');
  const packs = rest.find(segment => segment.startsWith('packs:'));
  return {
    totalRounds: Number(rounds) || 0,
    categoryId,
    difficulty: (['easy', 'medium', 'hard'].includes(difficulty) ? difficulty : 'all') as SoloChallenge['difficulty'],
    specialRounds: rest.includes('special'),
    packIds: packs ? packs.slice('packs:'.length).split('+').filter(Boolean) : [],
    kids: rest.includes('kids')
  };
}

export function getSoloChallengeFromState(state: GuessTheFakeState): SoloChallenge {
  return {
    totalRounds: state.totalRounds,
    categoryId: state.challenge?.categoryId ?? 'all',
    difficulty: state.challenge?.difficulty ?? 'all',
    specialRounds: state.specialRoundsEnabled,
    packIds: state.challenge?.packIds ?? [],
    kids: state.challenge?.kids === true
  };
}

// W13-03: a player with a family profile is keyed by profile id.
export function getSoloPlayerKey(playerName: string, profileId?: string | null) {
  return profileId ? `${PROFILE_KEY_PREFIX}${profileId}` : playerName.trim().toLocaleLowerCase();
}

export function getSoloResult(state: GuessTheFakeState, achievedAt = new Date().toISOString()): SoloResult | null {
  if (state.phase !== 'finished' || !isSoloMode(state.modeId) || !state.players[0]) return null;
  return {
    points: state.players[0].score,
    correct: state.correctGuessesInMatch,
    totalRounds: state.totalRounds,
    bestStreak: state.longestStreakInMatch,
    achievedAt
  };
}

// More points wins; a points tie goes to more correct answers; a full tie
// is not a record.
export function isNewSoloRecord(previous: SoloResult | null | undefined, next: SoloResult) {
  if (!previous) return true;
  if (next.points !== previous.points) return next.points > previous.points;
  return next.correct > previous.correct;
}

export function getSoloRecord(model: SoloRecordsModel, playerKey: string, challengeKey: string) {
  return model.records[playerKey]?.[challengeKey] ?? null;
}

export function recordSoloResult(
  model: SoloRecordsModel,
  playerKey: string,
  challengeKey: string,
  result: SoloResult
): { model: SoloRecordsModel; previous: SoloResult | null; isNewRecord: boolean } {
  const previous = getSoloRecord(model, playerKey, challengeKey);
  const isNewRecord = isNewSoloRecord(previous, result);
  if (!isNewRecord) return { model, previous, isNewRecord };
  return {
    model: {
      records: {
        ...model.records,
        [playerKey]: { ...model.records[playerKey], [challengeKey]: result }
      }
    },
    previous,
    isNewRecord
  };
}

// Records kept under a name move to the profile created for that name; the
// best result per challenge wins when both exist.
export function migrateSoloRecordsToProfile(model: SoloRecordsModel, playerName: string, profileId: string): SoloRecordsModel {
  const nameKey = getSoloPlayerKey(playerName);
  const fromName = model.records[nameKey];
  if (!fromName) return model;
  const profileKey = getSoloPlayerKey(playerName, profileId);
  const merged = { ...model.records[profileKey] };
  Object.entries(fromName).forEach(([challengeKey, result]) => {
    if (isNewSoloRecord(merged[challengeKey], result)) merged[challengeKey] = result;
  });
  const records = { ...model.records, [profileKey]: merged };
  delete records[nameKey];
  return { records };
}

export function listSoloRecords(model: SoloRecordsModel): SoloRecordRow[] {
  return Object.entries(model.records)
    .flatMap(([playerKey, byChallenge]) => Object.entries(byChallenge).map(([challengeKey, result]) => ({
      ...result,
      playerKey,
      challengeKey,
      challenge: parseSoloChallengeKey(challengeKey)
    })))
    .sort((a, b) => b.points - a.points || b.correct - a.correct || b.achievedAt.localeCompare(a.achievedAt));
}

export function isProfileSoloKey(playerKey: string) {
  return playerKey.startsWith(PROFILE_KEY_PREFIX);
}

export function getProfileIdFromSoloKey(playerKey: string) {
  return isProfileSoloKey(playerKey) ? playerKey.slice(PROFILE_KEY_PREFIX.length) : null;
}

export function normalizeSoloRecords(value: unknown): SoloRecordsModel {
  if (!value || typeof value !== 'object' || !isRecord((value as SoloRecordsModel).records)) return createEmptySoloRecords();
  const records: SoloRecordsModel['records'] = {};
  Object.entries((value as SoloRecordsModel).records).forEach(([playerKey, byChallenge]) => {
    if (!isRecord(byChallenge)) return;
    const valid = Object.entries(byChallenge).filter(([, result]) => isSoloResult(result));
    if (valid.length) records[playerKey] = Object.fromEntries(valid) as Record<string, SoloResult>;
  });
  return { records };
}

export function loadSoloRecords(storage: StorageAdapter = localStorage): SoloRecordsModel {
  return normalizeSoloRecords(readVersioned<unknown>(storage, SOLO_RECORDS_KEY, null, SOLO_RECORDS_VERSION));
}

export function saveSoloRecords(model: SoloRecordsModel, storage: StorageAdapter = localStorage) {
  writeVersioned(storage, SOLO_RECORDS_KEY, normalizeSoloRecords(model), SOLO_RECORDS_VERSION);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isSoloResult(value: unknown): value is SoloResult {
  const result = value as SoloResult;
  return isRecord(value)
    && Number.isFinite(result.points)
    && Number.isFinite(result.correct)
    && Number.isFinite(result.totalRounds)
    && Number.isFinite(result.bestStreak)
    && typeof result.achievedAt === 'string';
}
