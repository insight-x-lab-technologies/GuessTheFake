import { AtSign, CheckCircle2, ListChecks, Play, Star } from 'lucide-react';
import { Button } from '../../core/ui/Button';
import { GAME_MODES } from '../../game/modes';
import type { GuessTheFakeDifficulty, GuessTheFakeModeId } from '../../game/types';
import type { LocalizeText, Translate } from '../app-types';
import type { MatchSetupController } from '../hooks/useMatchSetup';
import { ScreenHeader } from './ScreenHeader';
import styles from '../App.module.css';

export function SetupScreen({
  t,
  text,
  setup,
  contentStatus,
  onStart
}: {
  t: Translate;
  text: LocalizeText;
  setup: MatchSetupController;
  contentStatus: 'loading' | 'ready' | 'error';
  onStart: () => void;
}) {
  const available = setup.playableRounds.length;
  const selectedRounds = available ? setup.roundCount : 0;
  const contentMessage = contentStatus === 'loading'
    ? t('setup.contentLoading')
    : available === 0 && !setup.setupError ? t('setup.contentEmpty') : '';
  const categoryPreview = setup.availableCategories.slice(0, 6).map(category => text(category.title, category.id));

  return (
    <div className={styles.panel}>
      <ScreenHeader screen="play" title={t('setup.title')}>
        <p>{t('setup.subtitle')}</p>
      </ScreenHeader>
      <div className={styles.setupLayout}>
        <section className={styles.setupPrimary} aria-label={t('setup.optionsTitle')}>
          <article className={styles.smallCard}>
            <ListChecks size={22} />
            <h3 className={styles.cardTitle}>{t('setup.mode')}</h3>
            <div className={styles.modeGrid}>
              {GAME_MODES.map(mode => (
                <button
                  key={mode.id}
                  type="button"
                  aria-pressed={setup.selectedModeId === mode.id}
                  className={styles.modeCard}
                  onClick={() => setup.selectMode(mode.id as GuessTheFakeModeId)}
                >
                  <strong>{t(mode.titleKey)}</strong>
                  <span>{t(mode.descriptionKey)}</span>
                  {setup.selectedModeId === mode.id ? (
                    <span className={styles.modeSelected}>
                      <CheckCircle2 size={14} /> {t('setup.selected')}
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
            <label className={styles.visuallyHidden}>
              {t('setup.mode')}
              <select
                value={setup.selectedModeId}
                onChange={event => setup.selectMode(event.target.value as GuessTheFakeModeId)}
              >
                {GAME_MODES.map(mode => (
                  <option key={mode.id} value={mode.id}>{t(mode.titleKey)}</option>
                ))}
              </select>
            </label>
          </article>

          <article className={styles.smallCard}>
            <AtSign size={22} />
            <h3 className={styles.cardTitle}>{t('setup.players')}</h3>
            <label className={styles.field}>
              <span>{t('setup.playersHint')}</span>
              <input value={setup.playerNames} onChange={event => setup.setPlayerNames(event.target.value)} />
            </label>
          </article>

          <article className={styles.smallCard}>
            <Star size={22} />
            <h3 className={styles.cardTitle}>{t('setup.filtersTitle')}</h3>
            <div className={styles.setupFieldsGrid}>
              <label className={styles.field}>
                <span>{t('setup.rounds')}</span>
                <input
                  min={1}
                  max={available || 1}
                  type="number"
                  value={setup.roundCountInput}
                  onChange={event => setup.changeRoundCount(event.target.value)}
                />
              </label>
              <label className={styles.field}>
                <span>{t('setup.category')}</span>
                <select value={setup.selectedCategoryId} onChange={event => setup.setSelectedCategoryId(event.target.value)}>
                  <option value="all">{t('setup.allCategories')}</option>
                  {setup.availableCategories.map(category => (
                    <option key={category.id} value={category.id}>{text(category.title, category.id)}</option>
                  ))}
                </select>
              </label>
              <label className={styles.field}>
                <span>{t('setup.difficulty')}</span>
                <select
                  value={setup.selectedDifficulty}
                  onChange={event => setup.setSelectedDifficulty(event.target.value as GuessTheFakeDifficulty | 'all')}
                >
                  <option value="all">{t('setup.allDifficulties')}</option>
                  <option value="easy">{t('setup.easy')}</option>
                  <option value="medium">{t('setup.medium')}</option>
                  <option value="hard">{t('setup.hard')}</option>
                </select>
              </label>
            </div>
          </article>
        </section>

        <aside className={styles.setupSummary} aria-label={t('setup.summaryTitle')}>
          <article className={styles.metricCard}>
            <span>{t('setup.summaryTitle')}</span>
            <strong className={styles.metricText}>{t(setup.selectedMode.titleKey)}</strong>
            <p>{t('setup.summaryLine', {
              players: Math.max(setup.players.length, 1),
              rounds: selectedRounds,
              available
            })}</p>
          </article>
          <article className={styles.smallCard}>
            <h3 className={styles.cardTitle}>{t('setup.contentStatusTitle')}</h3>
            <p className={setup.setupError || setup.contentIsLow || contentMessage ? styles.errorText : styles.helperText} role="status">
              {setup.setupError || contentMessage || t(setup.contentIsLow ? 'setup.contentLow' : 'setup.availableRounds', {
                available,
                selected: selectedRounds
              })}
            </p>
            <div className={styles.compactRows}>
              <span><b>{t('setup.easy')}</b>{setup.difficultyCounts.easy}</span>
              <span><b>{t('setup.medium')}</b>{setup.difficultyCounts.medium}</span>
              <span><b>{t('setup.hard')}</b>{setup.difficultyCounts.hard}</span>
            </div>
          </article>
          <article className={styles.smallCard}>
            <h3 className={styles.cardTitle}>{t('setup.previewTitle')}</h3>
            <div className={styles.tagList}>
              {categoryPreview.length
                ? categoryPreview.map(category => <span key={category}>{category}</span>)
                : <span>{t('packs.empty')}</span>}
            </div>
          </article>
          <Button icon={<Play size={18} />} onClick={onStart} disabled={contentStatus === 'loading'}>{t('setup.start')}</Button>
        </aside>
      </div>
    </div>
  );
}
