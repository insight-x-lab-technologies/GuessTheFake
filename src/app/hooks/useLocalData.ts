import { useState } from 'react';
import { normalizeAchievementState } from '../../core/achievements/achievements';
import { normalizeContentFeedback } from '../../core/content-feedback/content-feedback';
import { exportLeaderboard, importLeaderboard } from '../../core/leaderboard/leaderboard';
import { normalizeSettings, type PlatformSettings } from '../../core/settings/settings';
import {
  exportLocalData,
  importLocalData,
  loadUserIdentity,
  saveUserIdentity,
  type UserIdentity
} from '../../core/user-data/user-data';
import type { GuessTheFakePackContent } from '../../game/types';
import type { Translate } from '../app-types';
import { downloadJson, readTextFile } from '../browser';
import type { PacksController } from './usePacks';
import type { ProgressController } from './useProgress';

export type LocalDataController = ReturnType<typeof useLocalData>;

// Import/export of every local store, plus the leaderboard file actions.
export function useLocalData({
  t,
  settings,
  setSettings,
  progress,
  packs
}: {
  t: Translate;
  settings: PlatformSettings;
  setSettings: (settings: PlatformSettings) => void;
  progress: ProgressController;
  packs: PacksController;
}) {
  const [userIdentity, setUserIdentity] = useState<UserIdentity>(() => {
    if (typeof localStorage === 'undefined') return { userId: 'gtf-local-demo' };
    return loadUserIdentity();
  });
  const [dataStatus, setDataStatus] = useState('');

  function exportAllData() {
    downloadJson(
      'guess-the-fake-data.json',
      exportLocalData({
        user: userIdentity,
        settings,
        leaderboard: progress.leaderboard,
        achievements: progress.achievementState,
        installedPacks: packs.installedPacks,
        contentFeedback: progress.contentFeedback
      })
    );
    setDataStatus(t('settings.dataExported'));
  }

  function importAllData(file: File) {
    readTextFile(file, raw => {
      const data = importLocalData<GuessTheFakePackContent>(raw);
      if (!data) {
        setDataStatus(t('settings.dataInvalid'));
        return;
      }
      setUserIdentity(data.user);
      saveUserIdentity(data.user);
      setSettings(normalizeSettings(data.settings));
      progress.setLeaderboard(data.leaderboard);
      progress.setAchievementState(normalizeAchievementState(data.achievements));
      packs.setInstalledPacks(data.installedPacks);
      if (data.contentFeedback) progress.setContentFeedback(normalizeContentFeedback(data.contentFeedback));
      setDataStatus(t('settings.dataImported'));
    }, () => setDataStatus(t('settings.dataInvalid')));
  }

  function exportLeaderboardFile() {
    downloadJson('guess-the-fake-leaderboard.json', exportLeaderboard(progress.leaderboard));
  }

  function importLeaderboardFromFile(file: File) {
    readTextFile(file, raw => {
      const imported = importLeaderboard(raw);
      if (!imported) {
        setDataStatus(t('leaderboard.importError'));
        return;
      }
      progress.setLeaderboard(imported);
      setDataStatus(t('leaderboard.imported'));
    }, () => setDataStatus(t('leaderboard.importError')));
  }

  function resetLeaderboard() {
    progress.setLeaderboard({ entries: [] });
  }

  return {
    userIdentity,
    dataStatus,
    exportAllData,
    importAllData,
    exportLeaderboardFile,
    importLeaderboardFromFile,
    resetLeaderboard
  };
}
