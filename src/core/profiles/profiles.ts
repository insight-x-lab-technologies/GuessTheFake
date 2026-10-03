import { createStorageKey, readVersioned, writeVersioned, type StorageAdapter } from '../storage/storage';

// W13-03: local family profiles. No account, nothing leaves the device
// except through the local data export.

export type LocalProfile = {
  id: string;
  name: string;
  nickname: string;
  avatar: ProfileAvatarId;
  color: ProfileColor;
  createdAt: string;
};

export type ProfilesModel = {
  profiles: LocalProfile[];
};

// W16-02: avatar ids, drawn as SVG by the shell. The first twelve replace
// the emoji avatars of W13-03 one to one (see LEGACY_EMOJI_AVATARS).
export const PROFILE_AVATARS = [
  'fox', 'panda', 'owl', 'octopus', 'lion', 'turtle', 'penguin', 'unicorn', 'bee', 'whale', 'cactus', 'rocket',
  'cat', 'dog', 'frog', 'bear', 'rabbit', 'koala', 'monkey', 'pig', 'chick', 'robot', 'alien', 'ghost'
] as const;
export type ProfileAvatarId = typeof PROFILE_AVATARS[number];

// Profiles saved before W16-02 hold an emoji; loading maps it to its id, so
// no storage version bump is needed.
export const LEGACY_EMOJI_AVATARS: Record<string, ProfileAvatarId> = {
  '🦊': 'fox',
  '🐼': 'panda',
  '🦉': 'owl',
  '🐙': 'octopus',
  '🦁': 'lion',
  '🐢': 'turtle',
  '🐧': 'penguin',
  '🦄': 'unicorn',
  '🐝': 'bee',
  '🐳': 'whale',
  '🌵': 'cactus',
  '🚀': 'rocket'
};
export const PROFILE_COLORS = ['coral', 'amber', 'lime', 'teal', 'sky', 'violet', 'rose', 'slate'] as const;
export type ProfileColor = typeof PROFILE_COLORS[number];

export const PROFILE_NAME_MAX = 24;
export const PROFILE_NICKNAME_MAX = 24;
export const PROFILES_LIMIT = 24;

export const PROFILES_VERSION = 1;
export const PROFILES_KEY = createStorageKey('platform', 'profiles', PROFILES_VERSION);

export type ProfileInput = {
  name: string;
  nickname?: string;
  avatar?: string;
  color?: string;
};

export type ProfileError = 'name-required' | 'name-taken' | 'limit' | 'not-found';

export function createEmptyProfiles(): ProfilesModel {
  return { profiles: [] };
}

export function normalizeProfileName(name: string) {
  return name.trim().toLocaleLowerCase();
}

export function findProfileByName(model: ProfilesModel, name: string) {
  const key = normalizeProfileName(name);
  return key ? model.profiles.find(profile => normalizeProfileName(profile.name) === key) ?? null : null;
}

export function createProfileId(random = Math.random) {
  return `profile-${Math.floor(random() * 36 ** 6).toString(36).padStart(6, '0')}`;
}

export function addProfile(
  model: ProfilesModel,
  input: ProfileInput,
  options: { id?: string; now?: string } = {}
): { model: ProfilesModel; profile: LocalProfile | null; error: ProfileError | null } {
  const name = input.name.trim().slice(0, PROFILE_NAME_MAX);
  if (!name) return { model, profile: null, error: 'name-required' };
  if (findProfileByName(model, name)) return { model, profile: null, error: 'name-taken' };
  if (model.profiles.length >= PROFILES_LIMIT) return { model, profile: null, error: 'limit' };
  const profile: LocalProfile = {
    id: options.id ?? createProfileId(),
    name,
    nickname: (input.nickname ?? '').trim().slice(0, PROFILE_NICKNAME_MAX),
    avatar: normalizeAvatar(input.avatar, model.profiles.length),
    color: normalizeColor(input.color, model.profiles.length),
    createdAt: options.now ?? new Date().toISOString()
  };
  return { model: { profiles: [...model.profiles, profile] }, profile, error: null };
}

export function updateProfile(
  model: ProfilesModel,
  id: string,
  input: ProfileInput
): { model: ProfilesModel; profile: LocalProfile | null; error: ProfileError | null } {
  const current = model.profiles.find(profile => profile.id === id);
  if (!current) return { model, profile: null, error: 'not-found' };
  const name = input.name.trim().slice(0, PROFILE_NAME_MAX);
  if (!name) return { model, profile: null, error: 'name-required' };
  const taken = findProfileByName(model, name);
  if (taken && taken.id !== id) return { model, profile: null, error: 'name-taken' };
  const profile: LocalProfile = {
    ...current,
    name,
    nickname: (input.nickname ?? current.nickname).trim().slice(0, PROFILE_NICKNAME_MAX),
    avatar: normalizeAvatar(input.avatar ?? current.avatar, 0),
    color: normalizeColor(input.color ?? current.color, 0)
  };
  return {
    model: { profiles: model.profiles.map(existing => (existing.id === id ? profile : existing)) },
    profile,
    error: null
  };
}

export function removeProfile(model: ProfilesModel, id: string): ProfilesModel {
  return { profiles: model.profiles.filter(profile => profile.id !== id) };
}

export function normalizeProfiles(value: unknown): ProfilesModel {
  const list = (value as ProfilesModel | null)?.profiles;
  if (!Array.isArray(list)) return createEmptyProfiles();
  const seen = new Set<string>();
  const profiles: LocalProfile[] = [];
  list.forEach((candidate, index) => {
    if (!candidate || typeof candidate !== 'object') return;
    const profile = candidate as Partial<LocalProfile>;
    if (typeof profile.id !== 'string' || typeof profile.name !== 'string' || !profile.name.trim()) return;
    const key = normalizeProfileName(profile.name);
    if (seen.has(key) || profiles.some(existing => existing.id === profile.id)) return;
    seen.add(key);
    profiles.push({
      id: profile.id,
      name: profile.name.trim().slice(0, PROFILE_NAME_MAX),
      nickname: typeof profile.nickname === 'string' ? profile.nickname.slice(0, PROFILE_NICKNAME_MAX) : '',
      avatar: normalizeAvatar(profile.avatar, index),
      color: normalizeColor(profile.color, index),
      createdAt: typeof profile.createdAt === 'string' ? profile.createdAt : new Date(0).toISOString()
    });
  });
  return { profiles: profiles.slice(0, PROFILES_LIMIT) };
}

export function loadProfiles(storage: StorageAdapter = localStorage): ProfilesModel {
  return normalizeProfiles(readVersioned<unknown>(storage, PROFILES_KEY, null, PROFILES_VERSION));
}

export function saveProfiles(model: ProfilesModel, storage: StorageAdapter = localStorage) {
  writeVersioned(storage, PROFILES_KEY, normalizeProfiles(model), PROFILES_VERSION);
}

export function isProfileAvatarId(value: unknown): value is ProfileAvatarId {
  return PROFILE_AVATARS.includes(value as ProfileAvatarId);
}

function normalizeAvatar(value: unknown, index: number): ProfileAvatarId {
  if (isProfileAvatarId(value)) return value;
  const legacy = typeof value === 'string' ? LEGACY_EMOJI_AVATARS[value] : undefined;
  return legacy ?? PROFILE_AVATARS[index % PROFILE_AVATARS.length];
}

function normalizeColor(value: unknown, index: number): ProfileColor {
  return PROFILE_COLORS.includes(value as ProfileColor) ? value as ProfileColor : PROFILE_COLORS[index % PROFILE_COLORS.length];
}
