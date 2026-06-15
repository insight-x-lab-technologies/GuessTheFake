import { describe, expect, it } from 'vitest';
import {
  filterLeaderboard,
  getPlayerLeaderboardDetail,
  importLeaderboard,
  recordLeaderboardMatch,
  sortLeaderboardBy,
  summarizeLeaderboard
} from './leaderboard';

describe('leaderboard helpers', () => {
  it('records, filters, sorts, and summarizes player entries', () => {
    const model = recordLeaderboardMatch(
      { entries: [] },
      'guess-the-fake',
      'classic',
      [
        { playerName: 'Ana', points: 20, isWinner: true },
        { playerName: 'Bruno', points: 10, isWinner: false }
      ]
    );

    const filtered = filterLeaderboard(model.entries, { modeId: 'classic' });
    expect(filtered).toHaveLength(2);
    expect(sortLeaderboardBy(filtered, 'points')[0].playerName).toBe('Ana');
    expect(getPlayerLeaderboardDetail(model.entries, 'Ana')).toMatchObject({
      matches: 1,
      wins: 1,
      points: 20
    });
    expect(summarizeLeaderboard(model.entries)).toMatchObject({
      matches: 2,
      wins: 1,
      points: 30,
      players: 2,
      averagePoints: 15,
      bestWinRate: 100
    });
  });

  it('rejects invalid imported leaderboard JSON', () => {
    expect(importLeaderboard('{')).toBeNull();
  });
});
