import { createStorageKey, readVersioned, writeVersioned, type StorageAdapter } from '../storage/storage';

export type MultiplayerRole = 'local' | 'host' | 'guest';
export type MultiplayerStatus = 'idle' | 'hosting' | 'joined' | 'offline';
export type MultiplayerTransportKind = 'broadcast-channel' | 'webrtc-manual' | 'manual-offline' | 'peer-unavailable';
export type MultiplayerPeerStatus = 'idle' | 'signaling' | 'connecting' | 'connected' | 'disconnected' | 'failed';

export type MultiplayerScoreRow = {
  name: string;
  score: number;
};

export type MultiplayerGameSnapshot = {
  gameId: string;
  modeId: string;
  phase: string;
  roundNumber: number;
  totalRounds: number;
  activeSubjectName: string;
  timerSeconds: number;
  revealed: boolean;
  scoreboard: MultiplayerScoreRow[];
  updatedAt: string;
};

export type MultiplayerGuest = {
  id: string;
  connectedAt: string;
  lastSeenAt: string;
};

export type MultiplayerSessionState = {
  role: MultiplayerRole;
  status: MultiplayerStatus;
  sessionCode: string;
  transport: MultiplayerTransportKind;
  peerStatus: MultiplayerPeerStatus;
  guests: MultiplayerGuest[];
  lastSnapshot: MultiplayerGameSnapshot | null;
  error: string | null;
  updatedAt: string;
};

export type MultiplayerMessage =
  | {
    type: 'guest-ready';
    sessionCode: string;
    guestId: string;
    sentAt: string;
  }
  | {
    type: 'session-state';
    sessionCode: string;
    snapshot: MultiplayerGameSnapshot;
    sentAt: string;
  }
  | {
    type: 'guest-left';
    sessionCode: string;
    guestId: string;
    sentAt: string;
  };

export type MultiplayerSignalKind = 'offer' | 'answer';

export type MultiplayerSignalPayload = {
  type: 'webrtc-signal';
  kind: MultiplayerSignalKind;
  sessionCode: string;
  sdp: string;
  sentAt: string;
};

export const MULTIPLAYER_STORAGE_VERSION = 1;
export const MULTIPLAYER_STORAGE_KEY = createStorageKey('platform', 'multiplayer-session', MULTIPLAYER_STORAGE_VERSION);

const SESSION_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const DEFAULT_GUEST_ID_PREFIX = 'guest';

export function createInitialMultiplayerSessionState(now = new Date().toISOString()): MultiplayerSessionState {
  return {
    role: 'local',
    status: 'idle',
    sessionCode: '',
    transport: 'manual-offline',
    peerStatus: 'idle',
    guests: [],
    lastSnapshot: null,
    error: null,
    updatedAt: now
  };
}

export function createSessionCode(random: () => number = Math.random) {
  const parts = Array.from({ length: 6 }, () => {
    const index = Math.max(0, Math.min(SESSION_CODE_ALPHABET.length - 1, Math.floor(random() * SESSION_CODE_ALPHABET.length)));
    return SESSION_CODE_ALPHABET[index];
  });
  return `GTF-${parts.join('')}`;
}

export function normalizeSessionCode(value: string) {
  const raw = extractSessionCode(value);
  const normalized = raw
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .replace(/^GTF/, '');

  if (!normalized) return '';
  return `GTF-${normalized.slice(0, 8)}`;
}

export function extractSessionCode(value: string) {
  const raw = String(value ?? '').trim();
  if (!raw) return '';

  try {
    const url = new URL(raw, 'https://guess-the-fake.local/');
    const fromSearch = url.searchParams.get('join');
    const fromHash = url.hash.match(/(?:join|multiplayer)=([^&]+)/i)?.[1];
    return decodeURIComponent(fromSearch || fromHash || raw).trim();
  } catch {
    return raw.replace(/^#?(join|multiplayer)=/i, '').trim();
  }
}

export function createInviteUrl(baseHref: string, sessionCode: string) {
  const url = new URL(baseHref);
  url.search = '';
  url.hash = '';
  url.searchParams.set('join', normalizeSessionCode(sessionCode));
  return url.toString();
}

export function hostMultiplayerSession(
  state: MultiplayerSessionState,
  options: {
    now?: string;
    random?: () => number;
    transport?: MultiplayerTransportKind;
  } = {}
): MultiplayerSessionState {
  const now = options.now ?? new Date().toISOString();
  return {
    ...state,
    role: 'host',
    status: 'hosting',
    sessionCode: state.sessionCode || createSessionCode(options.random),
    transport: options.transport ?? 'broadcast-channel',
    peerStatus: options.transport === 'webrtc-manual' ? 'signaling' : 'idle',
    error: null,
    updatedAt: now
  };
}

export function joinMultiplayerSession(
  state: MultiplayerSessionState,
  input: string,
  options: {
    now?: string;
    guestId?: string;
    transport?: MultiplayerTransportKind;
  } = {}
): { state: MultiplayerSessionState; message: MultiplayerMessage | null } {
  const now = options.now ?? new Date().toISOString();
  const sessionCode = normalizeSessionCode(input);

  if (!sessionCode) {
    return {
      state: {
        ...state,
        role: 'guest',
        status: 'offline',
        error: 'missing-session-code',
        peerStatus: 'idle',
        updatedAt: now
      },
      message: null
    };
  }

  const guestId = options.guestId ?? createGuestId(now);
  return {
    state: {
      ...state,
      role: 'guest',
      status: 'joined',
      sessionCode,
      transport: options.transport ?? 'broadcast-channel',
      peerStatus: options.transport === 'webrtc-manual' ? 'signaling' : 'idle',
      guests: [],
      error: null,
      updatedAt: now
    },
    message: {
      type: 'guest-ready',
      sessionCode,
      guestId,
      sentAt: now
    }
  };
}

export function updateMultiplayerPeerStatus(
  state: MultiplayerSessionState,
  peerStatus: MultiplayerPeerStatus,
  options: { now?: string; error?: string | null } = {}
): MultiplayerSessionState {
  return {
    ...state,
    peerStatus,
    error: options.error === undefined ? state.error : options.error,
    updatedAt: options.now ?? new Date().toISOString()
  };
}

export function disconnectMultiplayerSession(
  state: MultiplayerSessionState,
  options: { now?: string; guestId?: string } = {}
): { state: MultiplayerSessionState; message: MultiplayerMessage | null } {
  const now = options.now ?? new Date().toISOString();
  const message = state.role === 'guest' && state.sessionCode && options.guestId
    ? {
      type: 'guest-left' as const,
      sessionCode: state.sessionCode,
      guestId: options.guestId,
      sentAt: now
    }
    : null;

  return {
    state: {
      ...createInitialMultiplayerSessionState(now),
      lastSnapshot: state.lastSnapshot
    },
    message
  };
}

export function createSessionStateMessage(
  sessionCode: string,
  snapshot: MultiplayerGameSnapshot,
  now = new Date().toISOString()
): MultiplayerMessage {
  return {
    type: 'session-state',
    sessionCode: normalizeSessionCode(sessionCode),
    snapshot,
    sentAt: now
  };
}

export function reduceMultiplayerMessage(
  state: MultiplayerSessionState,
  message: MultiplayerMessage,
  now = new Date().toISOString()
): MultiplayerSessionState {
  if (normalizeSessionCode(message.sessionCode) !== normalizeSessionCode(state.sessionCode)) return state;

  if (message.type === 'guest-ready' && state.role === 'host') {
    const existing = state.guests.find(guest => guest.id === message.guestId);
    const guests = existing
      ? state.guests.map(guest => guest.id === message.guestId ? { ...guest, lastSeenAt: now } : guest)
      : [...state.guests, { id: message.guestId, connectedAt: message.sentAt, lastSeenAt: now }];
    return { ...state, guests, updatedAt: now, error: null };
  }

  if (message.type === 'guest-left' && state.role === 'host') {
    return {
      ...state,
      guests: state.guests.filter(guest => guest.id !== message.guestId),
      updatedAt: now
    };
  }

  if (message.type === 'session-state' && state.role === 'guest') {
    return {
      ...state,
      status: 'joined',
      lastSnapshot: message.snapshot,
      updatedAt: now,
      error: null
    };
  }

  return state;
}

export function serializeMultiplayerMessage(message: MultiplayerMessage) {
  return JSON.stringify(message);
}

export function parseMultiplayerMessage(raw: string): MultiplayerMessage | null {
  try {
    const parsed = JSON.parse(raw) as Partial<MultiplayerMessage>;
    if (!parsed || typeof parsed !== 'object' || typeof parsed.type !== 'string') return null;
    if (!('sessionCode' in parsed) || typeof parsed.sessionCode !== 'string') return null;
    if (!('sentAt' in parsed) || typeof parsed.sentAt !== 'string') return null;

    if (parsed.type === 'guest-ready' || parsed.type === 'guest-left') {
      return typeof parsed.guestId === 'string' ? parsed as MultiplayerMessage : null;
    }

    if (parsed.type === 'session-state') {
      return isSnapshot(parsed.snapshot) ? parsed as MultiplayerMessage : null;
    }

    return null;
  } catch {
    return null;
  }
}

export function createWebRtcSignalPayload(
  kind: MultiplayerSignalKind,
  sessionCode: string,
  sdp: string,
  now = new Date().toISOString()
): MultiplayerSignalPayload {
  return {
    type: 'webrtc-signal',
    kind,
    sessionCode: normalizeSessionCode(sessionCode),
    sdp,
    sentAt: now
  };
}

export function serializeWebRtcSignalPayload(payload: MultiplayerSignalPayload) {
  return JSON.stringify(payload, null, 2);
}

export function parseWebRtcSignalPayload(raw: string): MultiplayerSignalPayload | null {
  try {
    const parsed = JSON.parse(raw) as Partial<MultiplayerSignalPayload>;
    if (!parsed || parsed.type !== 'webrtc-signal') return null;
    if (parsed.kind !== 'offer' && parsed.kind !== 'answer') return null;
    if (typeof parsed.sessionCode !== 'string' || !normalizeSessionCode(parsed.sessionCode)) return null;
    if (typeof parsed.sdp !== 'string' || !parsed.sdp.trim()) return null;
    if (typeof parsed.sentAt !== 'string' || !parsed.sentAt.trim()) return null;
    return {
      type: 'webrtc-signal',
      kind: parsed.kind,
      sessionCode: normalizeSessionCode(parsed.sessionCode),
      sdp: parsed.sdp,
      sentAt: parsed.sentAt
    };
  } catch {
    return null;
  }
}

export function exportMultiplayerSnapshot(snapshot: MultiplayerGameSnapshot | null) {
  return JSON.stringify({ type: 'guess-the-fake.multiplayer-snapshot', version: 1, snapshot }, null, 2);
}

export function importMultiplayerSnapshot(raw: string): MultiplayerGameSnapshot | null {
  try {
    const parsed = JSON.parse(raw) as { snapshot?: unknown };
    return isSnapshot(parsed.snapshot) ? parsed.snapshot : null;
  } catch {
    return null;
  }
}

export function loadMultiplayerSession(storage: StorageAdapter = localStorage) {
  return normalizeMultiplayerSessionState(
    readVersioned(storage, MULTIPLAYER_STORAGE_KEY, createInitialMultiplayerSessionState(), MULTIPLAYER_STORAGE_VERSION)
  );
}

export function saveMultiplayerSession(state: MultiplayerSessionState, storage: StorageAdapter = localStorage) {
  writeVersioned(storage, MULTIPLAYER_STORAGE_KEY, state, MULTIPLAYER_STORAGE_VERSION);
}

function createGuestId(seed: string) {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }
  return `${DEFAULT_GUEST_ID_PREFIX}-${hash.toString(16).padStart(8, '0')}`;
}

function normalizeMultiplayerSessionState(state: MultiplayerSessionState): MultiplayerSessionState {
  const fallback = createInitialMultiplayerSessionState();
  return {
    ...fallback,
    ...state,
    transport: isTransportKind(state.transport) ? state.transport : fallback.transport,
    peerStatus: isPeerStatus(state.peerStatus) ? state.peerStatus : fallback.peerStatus,
    guests: Array.isArray(state.guests) ? state.guests : [],
    lastSnapshot: isSnapshot(state.lastSnapshot) ? state.lastSnapshot : null,
    error: typeof state.error === 'string' || state.error === null ? state.error : null
  };
}

function isTransportKind(value: unknown): value is MultiplayerTransportKind {
  return value === 'broadcast-channel'
    || value === 'webrtc-manual'
    || value === 'manual-offline'
    || value === 'peer-unavailable';
}

function isPeerStatus(value: unknown): value is MultiplayerPeerStatus {
  return value === 'idle'
    || value === 'signaling'
    || value === 'connecting'
    || value === 'connected'
    || value === 'disconnected'
    || value === 'failed';
}

function isSnapshot(value: unknown): value is MultiplayerGameSnapshot {
  if (!value || typeof value !== 'object') return false;
  const snapshot = value as Partial<MultiplayerGameSnapshot>;
  return typeof snapshot.gameId === 'string'
    && typeof snapshot.modeId === 'string'
    && typeof snapshot.phase === 'string'
    && typeof snapshot.roundNumber === 'number'
    && typeof snapshot.totalRounds === 'number'
    && typeof snapshot.activeSubjectName === 'string'
    && typeof snapshot.timerSeconds === 'number'
    && typeof snapshot.revealed === 'boolean'
    && Array.isArray(snapshot.scoreboard)
    && snapshot.scoreboard.every(row => row && typeof row.name === 'string' && typeof row.score === 'number')
    && typeof snapshot.updatedAt === 'string';
}
