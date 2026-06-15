import type { AchievementState } from '../achievements/achievements';
import type { InstalledContentPacksModel } from '../content-packs/content-packs';
import type { ContentFeedbackModel } from '../content-feedback/content-feedback';
import type { LeaderboardModel } from '../leaderboard/leaderboard';
import type { PlatformSettings } from '../settings/settings';
import { createStorageKey, readVersioned, writeVersioned, type StorageAdapter } from '../storage/storage';

export type UserIdentity = {
  userId: string;
};

export type LocalDataExport<TContent> = {
  exportedAt: string;
  user: UserIdentity;
  settings: PlatformSettings;
  leaderboard: LeaderboardModel;
  achievements: AchievementState;
  installedPacks: InstalledContentPacksModel<TContent>;
  contentFeedback?: ContentFeedbackModel;
};

export const USER_ID_VERSION = 1;
export const USER_ID_KEY = createStorageKey('platform', 'user-id', USER_ID_VERSION);

export function createUserId(random = Math.random) {
  const chunk = () => Math.floor(random() * 36 ** 4).toString(36).padStart(4, '0');
  return `gtf-${chunk()}-${chunk()}-${chunk()}`;
}

export function loadUserIdentity(storage: StorageAdapter = localStorage): UserIdentity {
  const existing = readVersioned<UserIdentity | null>(storage, USER_ID_KEY, null, USER_ID_VERSION);
  if (existing?.userId) return existing;
  const created = { userId: createUserId() };
  writeVersioned(storage, USER_ID_KEY, created, USER_ID_VERSION);
  return created;
}

export function saveUserIdentity(identity: UserIdentity, storage: StorageAdapter = localStorage) {
  writeVersioned(storage, USER_ID_KEY, identity, USER_ID_VERSION);
}

export function exportLocalData<TContent>(data: Omit<LocalDataExport<TContent>, 'exportedAt'>) {
  return JSON.stringify({ ...data, exportedAt: new Date().toISOString() }, null, 2);
}

export function importLocalData<TContent>(raw: string): LocalDataExport<TContent> | null {
  try {
    const parsed = JSON.parse(raw) as LocalDataExport<TContent>;
    if (!parsed || typeof parsed !== 'object' || !parsed.user?.userId) return null;
    return parsed;
  } catch {
    return null;
  }
}
