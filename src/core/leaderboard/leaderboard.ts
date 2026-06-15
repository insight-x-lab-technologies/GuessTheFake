import { createStorageKey, readVersioned, writeVersioned } from '../storage/storage';
import type { StorageAdapter } from '../storage/storage';

export type LeaderboardEntry = {
  playerName: string;
  gameId: string;
  modeId: string;
  matches: number;
  wins: number;
  points: number;
};

export type LeaderboardModel = {
  entries: LeaderboardEntry[];
};

export type LeaderboardSort = 'wins' | 'points' | 'matches' | 'winRate';

export type LeaderboardFilters = {
  gameId?: string;
  modeId?: string;
  playerName?: string;
};

export type LeaderboardSummary = {
  matches: number;
  wins: number;
  points: number;
  players: number;
  averagePoints: number;
  bestWinRate: number;
};

export const LEADERBOARD_VERSION = 1;
export const LEADERBOARD_KEY = createStorageKey('platform', 'leaderboard', LEADERBOARD_VERSION);

export function createEmptyLeaderboard(): LeaderboardModel {
  return { entries: [] };
}

export function loadLeaderboard(storage: StorageAdapter = localStorage): LeaderboardModel {
  const model = readVersioned(storage, LEADERBOARD_KEY, createEmptyLeaderboard(), LEADERBOARD_VERSION);
  return normalizeLeaderboard(model);
}

export function saveLeaderboard(model: LeaderboardModel, storage: StorageAdapter = localStorage) {
  writeVersioned(storage, LEADERBOARD_KEY, model, LEADERBOARD_VERSION);
}

export function recordLeaderboardMatch(
  model: LeaderboardModel,
  gameId: string,
  modeId: string,
  scores: Array<{ playerName: string; points: number; isWinner: boolean }>
): LeaderboardModel {
  const entries = [...model.entries];

  scores.forEach(score => {
    const existing = entries.find(
      entry =>
        entry.gameId === gameId &&
        entry.modeId === modeId &&
        entry.playerName.toLocaleLowerCase() === score.playerName.toLocaleLowerCase()
    );

    if (existing) {
      existing.matches += 1;
      existing.wins += score.isWinner ? 1 : 0;
      existing.points += score.points;
      return;
    }

    entries.push({
      playerName: score.playerName,
      gameId,
      modeId,
      matches: 1,
      wins: score.isWinner ? 1 : 0,
      points: score.points
    });
  });

  return { entries };
}

export function sortLeaderboard(entries: LeaderboardEntry[]) {
  return sortLeaderboardBy(entries, 'wins');
}

export function sortLeaderboardBy(entries: LeaderboardEntry[], sort: LeaderboardSort) {
  return [...entries].sort((a, b) => {
    if (sort === 'points') return b.points - a.points || b.wins - a.wins || a.playerName.localeCompare(b.playerName);
    if (sort === 'matches') return b.matches - a.matches || b.points - a.points || a.playerName.localeCompare(b.playerName);
    if (sort === 'winRate') return winRate(b) - winRate(a) || b.wins - a.wins || a.playerName.localeCompare(b.playerName);
    return b.wins - a.wins || b.points - a.points || a.playerName.localeCompare(b.playerName);
  });
}

export function filterLeaderboard(entries: LeaderboardEntry[], filters: LeaderboardFilters) {
  return entries.filter(entry => {
    if (filters.gameId && entry.gameId !== filters.gameId) return false;
    if (filters.modeId && entry.modeId !== filters.modeId) return false;
    if (filters.playerName && entry.playerName !== filters.playerName) return false;
    return true;
  });
}

export function getPlayerLeaderboardDetail(entries: LeaderboardEntry[], playerName: string) {
  const playerEntries = entries.filter(entry => entry.playerName === playerName);
  return {
    playerName,
    entries: playerEntries,
    matches: playerEntries.reduce((total, entry) => total + entry.matches, 0),
    wins: playerEntries.reduce((total, entry) => total + entry.wins, 0),
    points: playerEntries.reduce((total, entry) => total + entry.points, 0)
  };
}

export function summarizeLeaderboard(entries: LeaderboardEntry[]): LeaderboardSummary {
  const normalized = normalizeLeaderboard({ entries }).entries;
  const matches = normalized.reduce((total, entry) => total + entry.matches, 0);
  const wins = normalized.reduce((total, entry) => total + entry.wins, 0);
  const points = normalized.reduce((total, entry) => total + entry.points, 0);
  const players = new Set(normalized.map(entry => entry.playerName.toLocaleLowerCase())).size;
  const bestWinRate = normalized.length
    ? Math.max(...normalized.map(entry => winRate(entry)))
    : 0;

  return {
    matches,
    wins,
    points,
    players,
    averagePoints: matches ? Math.round(points / matches) : 0,
    bestWinRate: Math.round(bestWinRate * 100)
  };
}

export function exportLeaderboard(model: LeaderboardModel) {
  return JSON.stringify(normalizeLeaderboard(model), null, 2);
}

export function importLeaderboard(raw: string): LeaderboardModel | null {
  try {
    return normalizeLeaderboard(JSON.parse(raw) as LeaderboardModel);
  } catch {
    return null;
  }
}

function normalizeLeaderboard(model: Partial<LeaderboardModel>): LeaderboardModel {
  return {
    entries: Array.isArray(model.entries)
      ? model.entries.filter(entry =>
        typeof entry.playerName === 'string' &&
        typeof entry.gameId === 'string' &&
        typeof entry.modeId === 'string' &&
        Number.isFinite(entry.matches) &&
        Number.isFinite(entry.wins) &&
        Number.isFinite(entry.points)
      )
      : []
  };
}

function winRate(entry: LeaderboardEntry) {
  return entry.matches > 0 ? entry.wins / entry.matches : 0;
}
