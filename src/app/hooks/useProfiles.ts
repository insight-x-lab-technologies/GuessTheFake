import { useEffect, useMemo, useState } from 'react';
import {
  addProfile,
  findProfileByName,
  loadProfiles,
  removeProfile,
  saveProfiles,
  updateProfile,
  type LocalProfile,
  type ProfileError,
  type ProfileInput,
  type ProfilesModel
} from '../../core/profiles/profiles';
import { getCountersProgressView, createDefaultAchievementCounters } from '../../core/achievements/achievements';
import { getProfileIdFromSoloKey, getSoloPlayerKey, listSoloRecords, migrateSoloRecordsToProfile } from '../../game/solo-records';
import { achievementDefinitions } from '../achievement-definitions';
import type { Translate } from '../app-types';
import { getPlayerCounterKey } from '../match-summary';
import type { ProgressController } from './useProgress';

export type ProfilesController = ReturnType<typeof useProfiles>;

export type ProfileDraft = { id: string | null; name: string; nickname: string; avatar: string; color: string };

const emptyDraft: ProfileDraft = { id: null, name: '', nickname: '', avatar: '', color: '' };

// W13-03: local family profiles, their stats, and the editor form.
export function useProfiles({
  t,
  progress
}: {
  t: Translate;
  progress: Pick<ProgressController, 'leaderboard' | 'achievementState' | 'soloRecords' | 'setSoloRecords'>;
}) {
  const [profiles, setProfilesState] = useState<ProfilesModel>(() => {
    if (typeof localStorage === 'undefined') return { profiles: [] };
    return loadProfiles();
  });
  const [draft, setDraft] = useState<ProfileDraft>(emptyDraft);
  const [profileStatus, setProfileStatus] = useState('');

  useEffect(() => {
    if (typeof localStorage !== 'undefined') saveProfiles(profiles);
  }, [profiles]);

  const soloRows = useMemo(() => listSoloRecords(progress.soloRecords), [progress.soloRecords]);

  const profileCards = useMemo(() => profiles.profiles.map(profile => {
    const tableEntries = progress.leaderboard.entries
      .filter(entry => entry.playerName.toLocaleLowerCase() === profile.name.toLocaleLowerCase());
    const counters = progress.achievementState.playerCounters[getPlayerCounterKey(profile.name)]
      ?? createDefaultAchievementCounters();
    const trophies = getCountersProgressView(counters, achievementDefinitions);
    const records = soloRows.filter(row => getProfileIdFromSoloKey(row.playerKey) === profile.id);
    return {
      profile,
      stats: {
        matches: tableEntries.reduce((total, entry) => total + entry.matches, 0),
        wins: tableEntries.reduce((total, entry) => total + entry.wins, 0),
        points: tableEntries.reduce((total, entry) => total + entry.points, 0),
        correct: counters.correctGuesses,
        rounds: counters.roundsPlayed
      },
      trophies,
      bestSolo: records[0] ?? null,
      soloRecordCount: records.length
    };
  }), [profiles.profiles, progress.achievementState.playerCounters, progress.leaderboard.entries, soloRows]);

  function setProfiles(next: ProfilesModel) {
    setProfilesState(next);
  }

  function getProfileForName(name: string): LocalProfile | null {
    return findProfileByName(profiles, name);
  }

  // Solo record key: the profile id when the name has a profile.
  function getSoloKeyForName(name: string) {
    return getSoloPlayerKey(name, getProfileForName(name)?.id ?? null);
  }

  function reportError(error: ProfileError) {
    setProfileStatus(t(`profiles.error.${error}`));
  }

  function saveDraft() {
    const input: ProfileInput = {
      name: draft.name,
      nickname: draft.nickname,
      avatar: draft.avatar || undefined,
      color: draft.color || undefined
    };
    if (draft.id) {
      const previousName = profiles.profiles.find(profile => profile.id === draft.id)?.name ?? '';
      const updated = updateProfile(profiles, draft.id, input);
      if (updated.error) return reportError(updated.error);
      setProfiles(updated.model);
      if (updated.profile && previousName.toLocaleLowerCase() !== updated.profile.name.toLocaleLowerCase()) {
        progress.setSoloRecords(migrateSoloRecordsToProfile(progress.soloRecords, updated.profile.name, updated.profile.id));
      }
      setDraft(emptyDraft);
      setProfileStatus(t('profiles.saved'));
      return;
    }
    const created = addProfile(profiles, input);
    if (created.error || !created.profile) return reportError(created.error ?? 'name-required');
    setProfiles(created.model);
    // Records kept under this name now belong to the profile.
    progress.setSoloRecords(migrateSoloRecordsToProfile(progress.soloRecords, created.profile.name, created.profile.id));
    setDraft(emptyDraft);
    setProfileStatus(t('profiles.created'));
  }

  function editProfile(id: string) {
    const profile = profiles.profiles.find(candidate => candidate.id === id);
    if (!profile) return;
    setDraft({ id, name: profile.name, nickname: profile.nickname, avatar: profile.avatar, color: profile.color });
    setProfileStatus('');
  }

  function deleteProfile(id: string) {
    setProfiles(removeProfile(profiles, id));
    if (draft.id === id) setDraft(emptyDraft);
    setProfileStatus(t('profiles.removed'));
  }

  return {
    profiles,
    setProfiles,
    profileCards,
    draft,
    updateDraft: (patch: Partial<ProfileDraft>) => setDraft(current => ({ ...current, ...patch })),
    cancelDraft: () => setDraft(emptyDraft),
    saveDraft,
    editProfile,
    deleteProfile,
    profileStatus,
    getProfileForName,
    getSoloKeyForName
  };
}
