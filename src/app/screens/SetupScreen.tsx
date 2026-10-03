import { AtSign, Baby, CheckCircle2, Lightbulb, ListChecks, MessageCircleHeart, Play, Sparkles, Star, Trophy } from 'lucide-react';
import type { LocalProfile } from '../../core/profiles/profiles';
import { Button } from '../../core/ui/Button';
import { GAME_MODES } from '../../game/modes';
import type { GuessTheFakeDifficulty, GuessTheFakeModeId } from '../../game/types';
import type { LocalizeText, Translate } from '../app-types';
import { SUGGESTION_MINUTE_OPTIONS, type MatchSetupController } from '../hooks/useMatchSetup';
import { CategoryArt } from './CategoryArt';
import { ProfileAvatar } from './ProfileAvatar';
import { ScreenHeader } from './ScreenHeader';
import styles from '../App.module.css';

export function SetupScreen({
  t,
  text,
  setup,
  profiles,
  contentStatus,
  onStart
}: {
  t: Translate;
  text: LocalizeText;
  setup: MatchSetupController;
  profiles: LocalProfile[];
  contentStatus: 'loading' | 'ready' | 'error';
  onStart: () => void;
}) {
  const available = setup.playableRounds.length;
  const selectedRounds = available ? setup.roundCount : 0;
  const contentMessage = contentStatus === 'loading'
    ? t('setup.contentLoading')
    : available === 0 && !setup.setupError ? t('setup.contentEmpty') : '';
  const categoryPreview = setup.availableCategories.slice(0, 6).map(category => text(category.title, category.id));
  const categoryLabel = (id: string) => {
    if (id === 'all') return t('setup.allCategories');
    const category = setup.availableCategories.find(candidate => candidate.id === id);
    return category ? text(category.title, id) : id;
  };
  const difficultyLabel = (difficulty: string) => (difficulty === 'all' ? t('setup.allDifficulties') : t(`setup.${difficulty}`));
  const suggestion = setup.suggestion;
  const suggestedMode = GAME_MODES.find(mode => mode.id === suggestion.modeId);
  const selectedNames = setup.solo ? [setup.soloPlayerName.trim()] : setup.tablePlayers;
  // W17-01: the table writes the rounds, so packs and filters do not apply.
  const aboutUs = setup.selectedModeId === 'about-us';

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
            <h3 className={styles.cardTitle}>{setup.solo ? t('solo.playerTitle') : t('setup.players')}</h3>
            {setup.solo ? (
              <label className={styles.field}>
                <span>{t('solo.nameLabel')}</span>
                <input
                  value={setup.soloPlayerName}
                  placeholder={t('solo.namePlaceholder')}
                  onChange={event => setup.setSoloPlayerName(event.target.value)}
                />
              </label>
            ) : (
              <label className={styles.field}>
                <span>{t('setup.playersHint')}</span>
                <input value={setup.playerNames} onChange={event => setup.setPlayerNames(event.target.value)} />
              </label>
            )}
            {profiles.length ? (
              <div className={styles.profileChips} aria-label={t('profiles.pickLabel')}>
                {profiles.map(profile => {
                  const picked = selectedNames.some(name => name.toLocaleLowerCase() === profile.name.toLocaleLowerCase());
                  return (
                    <button
                      key={profile.id}
                      type="button"
                      aria-pressed={picked}
                      onClick={() => setup.addPlayerName(profile.name)}
                    >
                      <ProfileAvatar profile={profile} size="sm" />
                      <span>{profile.name}</span>
                    </button>
                  );
                })}
              </div>
            ) : null}
          </article>

          {aboutUs ? (
            <article className={styles.smallCard}>
              <MessageCircleHeart size={22} />
              <h3 className={styles.cardTitle}>{t('aboutUs.setupTitle')}</h3>
              <p className={styles.helperText}>{t('aboutUs.setupNote', { count: Math.max(setup.tablePlayers.length, 2) })}</p>
            </article>
          ) : null}

          <article className={styles.smallCard} hidden={aboutUs}>
            <Star size={22} />
            <h3 className={styles.cardTitle}>{t('setup.filtersTitle')}</h3>
            <label className={styles.switchField}>
              <input
                type="checkbox"
                checked={setup.kidsModeEnabled}
                onChange={event => setup.setKidsModeEnabled(event.target.checked)}
              />
              <span>
                <b><Baby size={16} aria-hidden="true" /> {t('kids.toggle')}</b>
                <small>{t('kids.toggleHint')}</small>
              </span>
            </label>
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
              <label className={styles.visuallyHidden}>
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
            <fieldset className={styles.pickerField}>
              <legend>{t('setup.category')}</legend>
              <div className={styles.categoryChips}>
                {[{ id: 'all' }, ...setup.availableCategories].map(category => (
                  <button
                    key={category.id}
                    type="button"
                    aria-pressed={setup.selectedCategoryId === category.id}
                    onClick={() => setup.setSelectedCategoryId(category.id)}
                  >
                    {category.id === 'all' ? null : <CategoryArt categoryId={category.id} size="sm" />}
                    <span>{categoryLabel(category.id)}</span>
                  </button>
                ))}
              </div>
            </fieldset>
          </article>

          <article className={styles.smallCard}>
            <Sparkles size={22} />
            <h3 className={styles.cardTitle}>{t('setup.variationsTitle')}</h3>
            <label className={styles.switchField}>
              <input
                type="checkbox"
                checked={setup.specialRoundsEnabled}
                onChange={event => setup.setSpecialRoundsEnabled(event.target.checked)}
              />
              <span>
                <b>{t('specials.toggle')}</b>
                <small>{t(setup.solo ? 'specials.toggleHintSolo' : 'specials.toggleHint')}</small>
              </span>
            </label>
            {!setup.solo ? (
              <label className={styles.switchField}>
                <input
                  type="checkbox"
                  checked={setup.tableMomentsEnabled}
                  onChange={event => setup.setTableMomentsEnabled(event.target.checked)}
                />
                <span>
                  <b>{t('moments.toggle')}</b>
                  <small>{t('moments.toggleHint')}</small>
                </span>
              </label>
            ) : null}
          </article>
        </section>

        <aside className={styles.setupSummary} aria-label={t('setup.summaryTitle')}>
          <article className={styles.metricCard}>
            <span>{t('setup.summaryTitle')}</span>
            <strong className={styles.metricText}>{t(setup.selectedMode.titleKey)}</strong>
            <p>{aboutUs
              ? t('aboutUs.summaryLine', { players: Math.max(setup.players.length, 1) })
              : setup.solo
              ? t('solo.summaryLine', { rounds: selectedRounds, available })
              : t('setup.summaryLine', {
                players: Math.max(setup.players.length, 1),
                rounds: selectedRounds,
                available
              })}</p>
            {setup.solo ? (
              <p className={styles.recordLine} role="status">
                <Trophy size={16} />
                {setup.soloRecord
                  ? t('solo.recordLine', {
                    points: setup.soloRecord.points,
                    correct: setup.soloRecord.correct,
                    total: setup.soloRecord.totalRounds
                  })
                  : t('solo.firstTime')}
              </p>
            ) : null}
          </article>
          <article className={styles.smallCard} aria-label={t('suggest.title')}>
            <h3 className={styles.cardTitle}><Lightbulb size={18} /> {t('suggest.title')}</h3>
            {!setup.solo ? (
              <label className={styles.field}>
                <span>{t('suggest.minutes')}</span>
                <select
                  value={setup.suggestionMinutes}
                  onChange={event => setup.setSuggestionMinutes(Number(event.target.value))}
                >
                  {SUGGESTION_MINUTE_OPTIONS.map(minutes => (
                    <option key={minutes} value={minutes}>{t('suggest.minutesOption', { minutes })}</option>
                  ))}
                </select>
              </label>
            ) : null}
            <p className={styles.helperText}>{t('suggest.summary', {
              mode: suggestedMode ? t(suggestedMode.titleKey) : suggestion.modeId,
              rounds: suggestion.roundCount,
              difficulty: difficultyLabel(suggestion.difficulty),
              category: categoryLabel(suggestion.categoryId)
            })}</p>
            <ul className={styles.reasonList}>
              {suggestion.reasons.map(reason => (
                <li key={reason.key}>{t(reason.key, {
                  ...reason.params,
                  ...(reason.params?.category ? { category: categoryLabel(String(reason.params.category)) } : {})
                })}</li>
              ))}
            </ul>
            <Button variant="secondary" icon={<Lightbulb size={18} />} onClick={setup.applySuggestion}>
              {t('suggest.apply')}
            </Button>
            {setup.suggestionApplied ? <p className={styles.helperText} role="status">{t('suggest.applied')}</p> : null}
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
          {aboutUs && setup.setupError ? <p className={styles.errorText} role="alert">{setup.setupError}</p> : null}
          <Button icon={<Play size={18} />} onClick={onStart} disabled={contentStatus === 'loading' && !aboutUs}>
            {aboutUs ? t('aboutUs.startWritingAll') : t('setup.start')}
          </Button>
        </aside>
      </div>
    </div>
  );
}
