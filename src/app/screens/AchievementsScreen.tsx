import { BadgeCheck, ListChecks, ThumbsUp } from 'lucide-react';
import { GAME_MODES } from '../../game/modes';
import type { Translate } from '../app-types';
import type { ProgressController } from '../hooks/useProgress';
import { ScreenHeader } from './ScreenHeader';
import styles from '../App.module.css';

export function AchievementsScreen({
  t,
  progress
}: {
  t: Translate;
  progress: Pick<
    ProgressController,
    'achievementView' | 'achievementModeFilter' | 'setAchievementModeFilter' | 'contentFeedbackSummary'
  >;
}) {
  const { achievementView: view, contentFeedbackSummary: feedback } = progress;
  const selectedMode = GAME_MODES.find(mode => mode.id === progress.achievementModeFilter);

  return (
    <section className={styles.panel}>
      <ScreenHeader
        screen="achievements"
        title={t('achievements.title')}
        aside={(
          <div className={styles.sessionCode}>
            {t('achievements.completion', {
              unlocked: view.summary.unlockedCount,
              total: view.summary.totalCount,
              percent: view.summary.completionPercent
            })}
          </div>
        )}
      >
        <p>{t('achievements.subtitle')}</p>
      </ScreenHeader>
      <div className={styles.controlsGrid}>
        <label className={styles.field}>
          <span>{t('achievements.modeFilter')}</span>
          <select
            value={progress.achievementModeFilter}
            onChange={event => progress.setAchievementModeFilter(event.target.value)}
          >
            <option value="all">{t('achievements.allModes')}</option>
            {GAME_MODES.map(mode => (
              <option key={mode.id} value={mode.id}>{t(mode.titleKey)}</option>
            ))}
          </select>
        </label>
      </div>
      {view.hasData ? (
        <div className={styles.statGrid}>
          <article className={styles.metricCard}>
            <span>{t('achievements.matches')}</span>
            <strong>{view.counters.matchesFinished}</strong>
          </article>
          <article className={styles.metricCard}>
            <span>{t('achievements.streakMetric')}</span>
            <strong>{view.counters.longestStreak}</strong>
          </article>
          <article className={styles.metricCard}>
            <span>{t('achievements.categoriesMetric')}</span>
            <strong>{Object.keys(view.counters.categoriesPlayed).length}</strong>
          </article>
          <article className={styles.metricCard}>
            <span>{t('achievements.feedbackMetric')}</span>
            <strong>{view.counters.contentFeedbackCount}</strong>
          </article>
          <article className={styles.metricCard}>
            <span>{t('achievements.next')}</span>
            <strong className={styles.metricText}>
              {view.summary.nextLocked ? t(view.summary.nextLocked.titleKey) : t('achievements.allUnlocked')}
            </strong>
          </article>
        </div>
      ) : (
        <p className={styles.helperText} role="status">
          {t('achievements.modeEmpty', { mode: selectedMode ? t(selectedMode.titleKey) : '' })}
        </p>
      )}
      <div className={styles.insightGrid}>
        <article className={styles.smallCard}>
          <ThumbsUp size={22} />
          <h3 className={styles.cardTitle}>{t('feedbackStats.title')}</h3>
          <p>{t('feedbackStats.summary', {
            up: feedback.ratings.up,
            down: feedback.ratings.down,
            skip: feedback.ratings.skip
          })}</p>
          <div className={styles.compactRows}>
            {feedback.byCategory.length
              ? feedback.byCategory.slice(0, 4).map(row => (
                <span key={row.id}>
                  <b>{row.id}</b>
                  {t('feedbackStats.row', { total: row.total, up: row.up, down: row.down, skip: row.skip })}
                </span>
              ))
              : <span>{t('feedbackStats.empty')}</span>}
          </div>
        </article>
        <article className={styles.smallCard}>
          <ListChecks size={22} />
          <h3 className={styles.cardTitle}>{t('feedbackStats.difficultyTitle')}</h3>
          <div className={styles.compactRows}>
            {feedback.byDifficulty.length
              ? feedback.byDifficulty.map(row => (
                <span key={row.id}>
                  <b>{t(`setup.${row.id}`)}</b>
                  {t('feedbackStats.row', { total: row.total, up: row.up, down: row.down, skip: row.skip })}
                </span>
              ))
              : <span>{t('feedbackStats.empty')}</span>}
          </div>
        </article>
      </div>
      {view.hasData ? (
        <div className={styles.cardGrid}>
          {view.items.map(({ definition, progress: value, unlocked }) => (
            <article key={definition.id} className={`${styles.smallCard} ${unlocked ? styles.unlockedCard : ''}`}>
              <BadgeCheck size={22} />
              <h3 className={styles.cardTitle}>{t(definition.titleKey)}</h3>
              <p>{t(definition.descriptionKey)}</p>
              <progress value={value} max={definition.target} />
              <span>{unlocked ? t('achievements.unlocked') : `${value} / ${definition.target}`}</span>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
