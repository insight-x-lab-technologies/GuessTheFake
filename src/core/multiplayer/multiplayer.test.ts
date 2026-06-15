import { describe, expect, it } from 'vitest';
import {
  createInitialMultiplayerSessionState,
  createInviteUrl,
  createSessionStateMessage,
  disconnectMultiplayerSession,
  exportMultiplayerSnapshot,
  hostMultiplayerSession,
  importMultiplayerSnapshot,
  joinMultiplayerSession,
  loadMultiplayerSession,
  normalizeSessionCode,
  parseMultiplayerMessage,
  reduceMultiplayerMessage,
  saveMultiplayerSession,
  serializeMultiplayerMessage,
  type MultiplayerGameSnapshot
} from './multiplayer';
import type { StorageAdapter } from '../storage/storage';

function createMemoryStorage(): StorageAdapter {
  const values = new Map<string, string>();
  return {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: key => values.delete(key)
  };
}

const snapshot: MultiplayerGameSnapshot = {
  gameId: 'guess-the-fake',
  modeId: 'classic',
  phase: 'playing',
  roundNumber: 2,
  totalRounds: 5,
  activeSubjectName: 'Ana',
  timerSeconds: 37,
  revealed: false,
  scoreboard: [
    { name: 'Ana', score: 10 },
    { name: 'Bruno', score: 0 }
  ],
  updatedAt: '2026-06-14T12:00:00.000Z'
};

describe('multiplayer session helpers', () => {
  it('normalizes codes from raw text, links, and hashes', () => {
    expect(normalizeSessionCode('gtf-abc123')).toBe('GTF-ABC123');
    expect(normalizeSessionCode('https://example.test/game?join=gtf-xy9')).toBe('GTF-XY9');
    expect(normalizeSessionCode('#multiplayer=GTF-A1B2')).toBe('GTF-A1B2');
  });

  it('creates invite links without preserving stale search or hash values', () => {
    expect(createInviteUrl('https://example.test/play?old=1#card', 'gtf-abc123')).toBe(
      'https://example.test/play?join=GTF-ABC123'
    );
  });

  it('hosts and joins a session through serializable messages', () => {
    const hosted = hostMultiplayerSession(createInitialMultiplayerSessionState('2026-06-14T10:00:00.000Z'), {
      now: '2026-06-14T10:01:00.000Z',
      random: () => 0
    });
    expect(hosted).toMatchObject({
      role: 'host',
      status: 'hosting',
      sessionCode: 'GTF-AAAAAA',
      transport: 'broadcast-channel'
    });

    const joined = joinMultiplayerSession(createInitialMultiplayerSessionState(), hosted.sessionCode, {
      now: '2026-06-14T10:02:00.000Z',
      guestId: 'guest-1'
    });
    expect(joined.state).toMatchObject({ role: 'guest', status: 'joined', sessionCode: hosted.sessionCode });
    expect(joined.message).toMatchObject({ type: 'guest-ready', guestId: 'guest-1' });

    const withGuest = reduceMultiplayerMessage(hosted, joined.message!, '2026-06-14T10:03:00.000Z');
    expect(withGuest.guests).toEqual([
      {
        id: 'guest-1',
        connectedAt: '2026-06-14T10:02:00.000Z',
        lastSeenAt: '2026-06-14T10:03:00.000Z'
      }
    ]);
  });

  it('updates guest snapshots from host state messages', () => {
    const guest = joinMultiplayerSession(createInitialMultiplayerSessionState(), 'GTF-ABC123', {
      guestId: 'guest-1'
    }).state;
    const message = createSessionStateMessage('GTF-ABC123', snapshot, '2026-06-14T12:01:00.000Z');
    const next = reduceMultiplayerMessage(guest, message, '2026-06-14T12:02:00.000Z');

    expect(next.lastSnapshot).toEqual(snapshot);
    expect(next.status).toBe('joined');
  });

  it('round-trips messages and rejects invalid payloads', () => {
    const message = createSessionStateMessage('GTF-ABC123', snapshot);
    expect(parseMultiplayerMessage(serializeMultiplayerMessage(message))).toEqual(message);
    expect(parseMultiplayerMessage('{"type":"session-state"}')).toBeNull();
    expect(parseMultiplayerMessage('{')).toBeNull();
  });

  it('exports and imports manual offline snapshots', () => {
    const exported = exportMultiplayerSnapshot(snapshot);
    expect(importMultiplayerSnapshot(exported)).toEqual(snapshot);
    expect(importMultiplayerSnapshot('{"snapshot":{"gameId":"bad"}}')).toBeNull();
  });

  it('persists session state and falls back for invalid storage', () => {
    const storage = createMemoryStorage();
    const hosted = hostMultiplayerSession(createInitialMultiplayerSessionState(), { random: () => 0.1 });
    saveMultiplayerSession(hosted, storage);
    expect(loadMultiplayerSession(storage).sessionCode).toBe(hosted.sessionCode);

    storage.setItem('gtf.platform.multiplayer-session.v1', '{');
    expect(loadMultiplayerSession(storage).status).toBe('idle');
  });

  it('emits a guest-left message when disconnecting a joined guest', () => {
    const joined = joinMultiplayerSession(createInitialMultiplayerSessionState(), 'GTF-ABC123', {
      guestId: 'guest-1',
      now: '2026-06-14T12:00:00.000Z'
    }).state;
    const disconnected = disconnectMultiplayerSession(joined, {
      guestId: 'guest-1',
      now: '2026-06-14T12:05:00.000Z'
    });

    expect(disconnected.state.status).toBe('idle');
    expect(disconnected.message).toMatchObject({ type: 'guest-left', guestId: 'guest-1' });
  });
});
