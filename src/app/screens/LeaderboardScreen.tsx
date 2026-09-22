import { AtSign, Download, ListChecks, RotateCcw, Star, Trophy, Upload } from 'lucide-react';
import { useRef } from 'react';
import type { LeaderboardSort } from '../../core/leaderboard/leaderboard';
import { Button } from '../../core/ui/Button';
import { GAME_MODES } from '../../game/modes';
import type { Translate } from '../app-types';
import type { LocalDataController } from '../hooks/useLocalData';
import type { ProgressController } from '../hooks/useProgress';
import { ResponsiveActions, ScreenHeader } from './ScreenHeader';
import styles from '../App.module.css';

export function LeaderboardScreen({
  t,
  progress,
  localData
}: {
  t: Translate;
  progress: ProgressController;
  localData: LocalDataController;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const summary = progress.leaderboardSummary;

  return (
    <section className={styles.panel}>
      <ScreenHeader
        screen="leaderboard"
        title={t('leaderboard.title')}
        aside={(
          <ResponsiveActions label={t('app.actions')} name="leaderboard">
            <Button variant="ghost" icon={<Download size={18} />} onClick={localData.exportLeaderboardFile}>
              {t('leaderboard.export')}
            </Button>
            <Button variant="secondary" icon={<Upload size={18} />} onClick={() => fileInputRef.current?.click()}>
              {t('leaderboard.import')}
            </Button>
            <Button variant="danger" icon={<RotateCcw size={18} />} onClick={localData.resetLeaderboard}>
              {t('leaderboard.reset')}
            </Button>
          </ResponsiveActions>
        )}
      >
        <p>{t('leaderboard.subtitle')}</p>
      </ScreenHeader>
      <input
        ref={fileInputRef}
        hidden
        type="file"
        accept="application/json,.json"
        onChange={event => {
          const file = event.target.files?.[0];
          if (file) localData.importLeaderboardFromFile(file);
          event.currentTarget.value = '';
        }}
      />
      <div className={styles.controlsGrid}>
        <label className={styles.field}>
          <span>{t('leaderboard.sort')}</span>
          <select value={progress.leaderboardSort} onChange={event => progress.setLeaderboardSort(event.target.value as LeaderboardSort)}>
            <option value="wins">{t('leaderboard.sortWins')}</option>
            <option value="points">{t('leaderboard.sortPoints')}</option>
            <option value="matches">{t('leaderboard.sortMatches')}</option>
            <option value="winRate">{t('leaderboard.sortWinRate')}</option>
          </select>
        </label>
        <label className={styles.field}>
          <span>{t('leaderboard.mode')}</span>
          <select value={progress.leaderboardModeFilter} onChange={event => progress.setLeaderboardModeFilter(event.target.value)}>
            <option value="all">{t('leaderboard.allModes')}</option>
            {GAME_MODES.map(mode => (
              <option key={mode.id} value={mode.id}>{t(mode.titleKey)}</option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          <span>{t('leaderboard.player')}</span>
          <select value={progress.selectedLeaderboardPlayer} onChange={event => progress.setSelectedLeaderboardPlayer(event.target.value)}>
            <option value="">{t('leaderboard.allPlayers')}</option>
            {progress.leaderboardPlayers.map(playerName => (
              <option key={playerName} value={playerName}>{playerName}</option>
            ))}
          </select>
        </label>
      </div>
      <div className={styles.statGrid}>
        <article className={styles.metricCard}>
          <ListChecks size={18} />
          <span>{t('leaderboard.summary')}</span>
          <strong>{summary.matches}</strong>
        </article>
        <article className={styles.metricCard}>
          <Trophy size={18} />
          <span>{t('leaderboard.bestWinRate')}</span>
          <strong>{summary.bestWinRate}%</strong>
        </article>
        <article className={styles.metricCard}>
          <AtSign size={18} />
          <span>{t('leaderboard.players')}</span>
          <strong>{summary.players}</strong>
        </article>
        <article className={styles.metricCard}>
          <Star size={18} />
          <span>{t('leaderboard.averagePoints')}</span>
          <strong>{summary.averagePoints}</strong>
        </article>
        {progress.playerDetail ? (
          <article className={styles.metricCard}>
            <span>{t('leaderboard.playerDetail', { name: progress.playerDetail.playerName })}</span>
            <strong>{progress.playerDetail.points}</strong>
          </article>
        ) : null}
      </div>
      {progress.leaderboardEntries.length ? (
        <div className={styles.list}>
          {progress.leaderboardEntries.map((entry, index) => (
            <div key={`${entry.gameId}-${entry.modeId}-${entry.playerName}`} className={styles.listRow}>
              <div className={styles.rankIdentity}>
                <strong>{index + 1}</strong>
                <div>
                  <b>{entry.playerName}</b>
                  <span>{entry.gameId} · {entry.modeId}</span>
                </div>
              </div>
              <span>{t('leaderboard.rowStats', {
                wins: entry.wins,
                points: entry.points,
                matches: entry.matches,
                winRate: Math.round((entry.wins / entry.matches) * 100)
              })}</span>
            </div>
          ))}
        </div>
      ) : (
        <p>{t('leaderboard.empty')}</p>
      )}
      {localData.dataStatus ? <p className={styles.helperText}>{localData.dataStatus}</p> : null}
    </section>
  );
}
