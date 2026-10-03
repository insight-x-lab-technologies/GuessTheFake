import { ListChecks, Route, ThumbsUp } from 'lucide-react';
import { GAME_MODES } from '../../game/modes';
import type { Translate } from '../app-types';
import type { ProgressController } from '../hooks/useProgress';
import type { ProgressTrackView } from '../progress-tracks';
import { CategoryArt } from './CategoryArt';
import { Mascot } from './Mascot';
import { Medal } from './Medal';
import { ScreenHeader } from './ScreenHeader';
import styles from '../App.module.css';

export function AchievementsScreen({
  t,
  progress,
  trackViews = [],
  categoryLabel = id => id
}: {
  t: Translate;
  progress: Pick<
    ProgressController,
    'achievementView' | 'achievementModeFilter' | 'setAchievementModeFilter' | 'contentFeedbackSummary'
  >;
  trackViews?: ProgressTrackView[];
  categoryLabel?: (categoryId: string) => string;
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
        <div className={styles.emptyState}>
          <Mascot mood="suspicious" />
          <p className={styles.helperText} role="status">
            {t('achievements.modeEmpty', { mode: selectedMode ? t(selectedMode.titleKey) : '' })}
          </p>
        </div>
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
      {view.hasData && trackViews.length ? (
        <section className={styles.trackSection} aria-label={t('tracks.title')}>
          <h3 className={styles.cardTitle}><Route size={18} /> {t('tracks.title')}</h3>
          <p className={styles.helperText}>{t('tracks.subtitle')}</p>
          <div className={styles.trackGrid}>
            {trackViews.map(({ track, progress: value, completedSteps, totalSteps, nextTarget }) => (
              <article key={track.id} className={styles.trackCard} data-group={track.group}>
                <header>
                  {track.categoryId ? <CategoryArt categoryId={track.categoryId} size="sm" /> : null}
                  <span className={styles.trackGroup}>{t(`tracks.group.${track.group}`)}</span>
                </header>
                <b>{t(track.titleKey, {
                  category: track.categoryId ? categoryLabel(track.categoryId) : '',
                  difficulty: track.difficulty ? t(`setup.${track.difficulty}`) : ''
                })}</b>
                <progress value={nextTarget ? value : 1} max={nextTarget ?? 1} />
                <span>
                  {t('tracks.level', { level: completedSteps, total: totalSteps })}
                  {' · '}
                  {nextTarget ? `${value} / ${nextTarget}` : t('tracks.complete')}
                </span>
                {track.tableOnly ? <small>{t('tracks.tableOnly')}</small> : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}
      {view.hasData ? (
        <div className={styles.cardGrid}>
          {view.items.map(({ definition, progress: value, unlocked }) => (
            <article
              key={definition.id}
              className={`${styles.smallCard} ${unlocked ? styles.unlockedCard : ''}`}
              data-rarity={definition.rarity ?? 'bronze'}
            >
              <Medal rarity={definition.rarity} locked={!unlocked} />
              <h3 className={styles.cardTitle}>{t(definition.titleKey)}</h3>
              <span className={styles.rarityLabel} data-rarity={definition.rarity ?? 'bronze'}>
                {t('art.medal.label', { rarity: t(`art.medal.${definition.rarity ?? 'bronze'}`) })}
              </span>
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
