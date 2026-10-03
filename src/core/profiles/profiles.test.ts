import { describe, expect, it } from 'vitest';
import type { StorageAdapter } from '../storage/storage';
import {
  addProfile,
  findProfileByName,
  loadProfiles,
  PROFILE_AVATARS,
  PROFILES_KEY,
  removeProfile,
  saveProfiles,
  updateProfile
} from './profiles';

function createMemoryStorage(): StorageAdapter {
  const values = new Map<string, string>();
  return {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: key => values.delete(key)
  };
}

describe('local family profiles', () => {
  it('creates profiles with unique names and default avatar and color', () => {
    const created = addProfile({ profiles: [] }, { name: '  Ana  ', nickname: 'Aninha' }, { id: 'p1', now: 'now' });
    expect(created.profile).toEqual({ id: 'p1', name: 'Ana', nickname: 'Aninha', avatar: PROFILE_AVATARS[0], color: 'coral', createdAt: 'now' });
    expect(addProfile(created.model, { name: 'ana' }).error).toBe('name-taken');
    expect(addProfile(created.model, { name: '   ' }).error).toBe('name-required');
    expect(findProfileByName(created.model, ' ANA ')?.id).toBe('p1');
  });

  it('edits and removes profiles', () => {
    let model = addProfile({ profiles: [] }, { name: 'Ana' }, { id: 'p1' }).model;
    model = addProfile(model, { name: 'Bruno' }, { id: 'p2' }).model;
    expect(updateProfile(model, 'p2', { name: 'ana' }).error).toBe('name-taken');
    expect(updateProfile(model, 'missing', { name: 'Caio' }).error).toBe('not-found');
    const updated = updateProfile(model, 'p2', { name: 'Bruno', avatar: 'owl', color: 'teal' });
    expect(updated.profile).toMatchObject({ avatar: 'owl', color: 'teal' });
    // Unknown avatar or color falls back to the list.
    expect(updateProfile(model, 'p2', { name: 'Bruno', avatar: 'x', color: 'neon' }).profile).toMatchObject({ avatar: PROFILE_AVATARS[0], color: 'coral' });
    expect(removeProfile(updated.model, 'p1').profiles.map(profile => profile.id)).toEqual(['p2']);
  });

  it('falls back for missing, invalid, and wrong-version data and drops broken entries', () => {
    const storage = createMemoryStorage();
    expect(loadProfiles(storage)).toEqual({ profiles: [] });
    storage.setItem(PROFILES_KEY, JSON.stringify({ version: 7, value: { profiles: [{ id: 'p1', name: 'Ana' }] } }));
    expect(loadProfiles(storage)).toEqual({ profiles: [] });
    storage.setItem(PROFILES_KEY, '{oops');
    expect(loadProfiles(storage)).toEqual({ profiles: [] });
    storage.setItem(PROFILES_KEY, JSON.stringify({
      version: 1,
      value: { profiles: [{ id: 'p1', name: 'Ana' }, { id: 'p2', name: 'ANA' }, { name: 'No id' }, null] }
    }));
    expect(loadProfiles(storage).profiles.map(profile => profile.id)).toEqual(['p1']);

    saveProfiles(addProfile({ profiles: [] }, { name: 'Caio' }, { id: 'p3' }).model, storage);
    expect(loadProfiles(storage).profiles[0].name).toBe('Caio');
  });

  it('offers 24 avatars and maps the emoji avatars saved before W16-02', () => {
    expect(PROFILE_AVATARS).toHaveLength(24);
    expect(new Set(PROFILE_AVATARS).size).toBe(24);
    const storage = createMemoryStorage();
    storage.setItem(PROFILES_KEY, JSON.stringify({
      version: 1,
      value: { profiles: [{ id: 'p1', name: 'Ana', avatar: '🐙' }, { id: 'p2', name: 'Bia', avatar: '🛸' }, { id: 'p3', name: 'Caio', avatar: 'ghost' }] }
    }));
    expect(loadProfiles(storage).profiles.map(profile => profile.avatar)).toEqual(['octopus', PROFILE_AVATARS[1], 'ghost']);
  });
});
