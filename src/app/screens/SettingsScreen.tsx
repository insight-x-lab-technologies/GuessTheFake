import { Cog, Download, RotateCcw, Upload, Volume2 } from 'lucide-react';
import { useRef } from 'react';
import { SUPPORTED_LANGUAGES, type Language } from '../../core/i18n/i18n';
import { FONT_SCALE_OPTIONS, type FontScale, type PlatformSettings } from '../../core/settings/settings';
import { THEMES, type ThemeId } from '../../core/themes/themes';
import { Button } from '../../core/ui/Button';
import type { Translate } from '../app-types';
import { getLanguageLabel } from '../browser';
import type { LocalDataController } from '../hooks/useLocalData';
import { ScoreResetFeedback } from './ScoreResetFeedback';
import { ScreenHeader } from './ScreenHeader';
import styles from '../App.module.css';

export function SettingsScreen({
  t,
  settings,
  updateSettings,
  matchLanguageNotice,
  scoreReset,
  onPreviewSound,
  localData
}: {
  t: Translate;
  settings: PlatformSettings;
  updateSettings: (next: Partial<PlatformSettings>) => void;
  // Language of a match still running in a previous language, if any.
  matchLanguageNotice: Language | null;
  scoreReset: {
    status: 'confirm' | 'done' | null;
    request: () => void;
    confirm: () => void;
    cancel: () => void;
  };
  onPreviewSound: () => void;
  localData: LocalDataController;
}) {
  const dataFileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <section className={styles.panel}>
      <ScreenHeader screen="settings" title={t('settings.title')}>
        <p>{t('settings.subtitle')}</p>
      </ScreenHeader>
      <div className={styles.settingsGrid}>
        <article className={styles.smallCard}>
          <Cog size={22} />
          <h3 className={styles.cardTitle}>{t('settings.identityTitle')}</h3>
          <label className={styles.field}>
            <span>{t('settings.language')}</span>
            <select value={settings.language} onChange={event => updateSettings({ language: event.target.value as Language })}>
              {SUPPORTED_LANGUAGES.map(language => (
                <option key={language} value={language}>
                  {getLanguageLabel(language)}
                </option>
              ))}
            </select>
            {matchLanguageNotice ? (
              <p className={styles.helperText}>
                {t('settings.languageAppliesNextMatch', {
                  match: getLanguageLabel(matchLanguageNotice),
                  current: getLanguageLabel(settings.language)
                })}
              </p>
            ) : null}
          </label>
          <label className={styles.field}>
            <span>{t('settings.theme')}</span>
            <select value={settings.theme} onChange={event => updateSettings({ theme: event.target.value as ThemeId })}>
              {THEMES.map(theme => (
                <option key={theme.id} value={theme.id}>{t(theme.labelKey)}</option>
              ))}
            </select>
          </label>
          <div className={styles.themePreviewGrid} aria-label={t('settings.themePreviewTitle')}>
            {THEMES.map(theme => (
              <button
                key={theme.id}
                type="button"
                className={styles.themePreview}
                data-preview-theme={theme.id}
                aria-pressed={settings.theme === theme.id}
                aria-label={t('settings.themePreviewAction', { theme: t(theme.labelKey) })}
                title={t('settings.themePreviewAction', { theme: t(theme.labelKey) })}
                onClick={() => updateSettings({ theme: theme.id })}
              >
                <span className={styles.themePreviewHeader}>
                  <b>{t(theme.labelKey)}</b>
                  <i>{settings.theme === theme.id ? t('settings.themePreviewActive') : t('settings.themePreviewApply')}</i>
                </span>
                <span className={styles.themePreviewBoard} aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
                <span className={styles.themePreviewFooter} aria-hidden="true">
                  <span>{t('settings.themePreviewScore')}</span>
                  <span>{t('settings.themePreviewCorrect')}</span>
                </span>
              </button>
            ))}
          </div>
          <label className={styles.field}>
            <span>{t('settings.fontScale')}</span>
            <select value={settings.fontScale} onChange={event => updateSettings({ fontScale: event.target.value as FontScale })}>
              {FONT_SCALE_OPTIONS.map(scale => (
                <option key={scale} value={scale}>{t(`settings.fontScale${scale[0].toUpperCase()}${scale.slice(1)}`)}</option>
              ))}
            </select>
          </label>
        </article>

        <article className={styles.smallCard}>
          <h3 className={styles.cardTitle}>{t('settings.gameplayTitle')}</h3>
          <label className={styles.rangeField}>
            <span>{t('settings.roundTime')}: {settings.roundTimeSeconds}s</span>
            <input type="range" min={20} max={120} step={10} value={settings.roundTimeSeconds} onChange={event => updateSettings({ roundTimeSeconds: Number(event.target.value) })} />
          </label>
          <label className={styles.rangeField}>
            <span>{t('settings.preparationTime')}: {settings.preparationTimeSeconds}s</span>
            <input type="range" min={1} max={10} step={1} value={settings.preparationTimeSeconds} onChange={event => updateSettings({ preparationTimeSeconds: Number(event.target.value) })} />
          </label>
          <label className={styles.switchField}>
            <input type="checkbox" checked={settings.autoStartRounds} onChange={event => updateSettings({ autoStartRounds: event.target.checked })} />
            <span>{t('settings.autoStart')}</span>
          </label>
          <label className={styles.switchField}>
            <input type="checkbox" checked={settings.shuffleRounds} onChange={event => updateSettings({ shuffleRounds: event.target.checked })} />
            <span>{t('settings.shuffle')}</span>
          </label>
        </article>

        <article className={styles.smallCard}>
          <h3 className={styles.cardTitle}>{t('settings.scoringTitle')}</h3>
          <label className={styles.field}>
            <span>{t('settings.correctPoints')}</span>
            <input type="number" value={settings.correctGuessPoints} onChange={event => updateSettings({ correctGuessPoints: Number(event.target.value) })} />
          </label>
          <label className={styles.field}>
            <span>{t('settings.wrongPenalty')}</span>
            <input type="number" value={settings.wrongGuessPenalty} onChange={event => updateSettings({ wrongGuessPenalty: Number(event.target.value) })} />
          </label>
          <label className={styles.field}>
            <span>{t('settings.speedBonus')}</span>
            <input type="number" min={0} value={settings.speedBonusPoints} onChange={event => updateSettings({ speedBonusPoints: Number(event.target.value) })} />
          </label>
          <Button
            variant="ghost"
            icon={<RotateCcw size={18} />}
            aria-controls="settings-score-reset-confirmation"
            aria-expanded={scoreReset.status === 'confirm'}
            onClick={scoreReset.request}
          >
            {t('game.recalibrateScores')}
          </Button>
          <ScoreResetFeedback
            id="settings-score-reset-confirmation"
            status={scoreReset.status}
            t={t}
            onConfirm={scoreReset.confirm}
            onCancel={scoreReset.cancel}
          />
        </article>

        <article className={styles.smallCard}>
          <h3 className={styles.cardTitle}>{t('settings.mediaTitle')}</h3>
          <label className={styles.switchField}>
            <input type="checkbox" checked={settings.soundEnabled} onChange={event => updateSettings({ soundEnabled: event.target.checked })} />
            <span>{t('settings.sound')}</span>
          </label>
          <label className={styles.rangeField}>
            <span>{t('settings.soundVolume')}: {Math.round(settings.soundVolume * 100)}%</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={settings.soundVolume}
              onChange={event => updateSettings({ soundVolume: Number(event.target.value) })}
            />
          </label>
          <label className={styles.switchField}>
            <input type="checkbox" checked={settings.musicEnabled} onChange={event => updateSettings({ musicEnabled: event.target.checked })} />
            <span>{t('settings.music')}</span>
          </label>
          <label className={styles.rangeField}>
            <span>{t('settings.musicVolume')}: {Math.round(settings.musicVolume * 100)}%</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={settings.musicVolume}
              onChange={event => updateSettings({ musicVolume: Number(event.target.value) })}
            />
          </label>
          <Button
            variant="secondary"
            icon={<Volume2 size={18} />}
            onClick={onPreviewSound}
            data-audio-skip="true"
          >
            {t('settings.previewSound')}
          </Button>
        </article>

        <article className={styles.smallCard}>
          <h3 className={styles.cardTitle}>{t('settings.dataTitle')}</h3>
          <p>{t('settings.userId', { id: localData.userIdentity.userId })}</p>
          <div className={styles.actionCluster}>
            <Button variant="ghost" icon={<Download size={18} />} onClick={localData.exportAllData}>{t('settings.exportData')}</Button>
            <Button variant="secondary" icon={<Upload size={18} />} onClick={() => dataFileInputRef.current?.click()}>{t('settings.importData')}</Button>
          </div>
          <input
            ref={dataFileInputRef}
            hidden
            type="file"
            accept="application/json,.json"
            onChange={event => {
              const file = event.target.files?.[0];
              if (file) localData.importAllData(file);
              event.currentTarget.value = '';
            }}
          />
          {localData.dataStatus ? <p className={styles.helperText}>{localData.dataStatus}</p> : null}
        </article>
      </div>
    </section>
  );
}
