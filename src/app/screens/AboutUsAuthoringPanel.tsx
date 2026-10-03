import { ArrowLeft, Check, EyeOff, Play } from 'lucide-react';
import type { LocalProfile } from '../../core/profiles/profiles';
import { Button } from '../../core/ui/Button';
import { ABOUT_US_MAX_LENGTH } from '../../game/about-us';
import type { Translate } from '../app-types';
import type { AboutUsAuthoringController } from '../hooks/useAboutUsAuthoring';
import { PassDevicePanel } from './PassDevicePanel';
import { ScreenHeader } from './ScreenHeader';
import styles from '../App.module.css';

// W17-01: four truths and one lie per player, written in turn on one device.
export function AboutUsAuthoringPanel({
  t,
  authoring,
  getProfileForName,
  setupError,
  onStart
}: {
  t: Translate;
  authoring: AboutUsAuthoringController;
  getProfileForName: (name: string) => LocalProfile | null;
  setupError: string;
  onStart: () => void;
}) {
  const progress = t('aboutUs.progress', { current: Math.min(authoring.index + 1, authoring.names.length), total: authoring.names.length });

  return (
    <div className={styles.panel}>
      <ScreenHeader screen="play" title={t('modes.aboutUs.title')}>
        <p>{t('aboutUs.subtitle')}</p>
      </ScreenHeader>

      {authoring.step === 'handoff' ? (
        <PassDevicePanel
          t={t}
          name={authoring.authorName}
          profile={getProfileForName(authoring.authorName)}
          kicker={progress}
          actionLabel={t('aboutUs.startWriting')}
          onReady={authoring.startWriting}
        />
      ) : null}

      {authoring.step === 'writing' && authoring.entry ? (
        <form
          className={styles.authoringForm}
          onSubmit={event => {
            event.preventDefault();
            authoring.confirmEntry();
          }}
        >
          <p className={styles.kicker}>{progress}</p>
          <h2 className={styles.pageTitle}>{t('aboutUs.writeTitle', { name: authoring.authorName })}</h2>
          <p className={styles.helperText}>{t('aboutUs.writeHint')}</p>
          <ol className={styles.authoringList}>
            {authoring.entry.statements.map((statement, statementIndex) => {
              const isLie = authoring.entry?.lieIndex === statementIndex;
              return (
                <li key={statementIndex} data-lie={isLie ? 'true' : undefined}>
                  <label className={styles.field}>
                    <span>{t('aboutUs.statementLabel', { number: statementIndex + 1 })}</span>
                    <input
                      value={statement}
                      maxLength={ABOUT_US_MAX_LENGTH}
                      autoComplete="off"
                      onChange={event => authoring.setStatement(statementIndex, event.target.value)}
                    />
                  </label>
                  <label className={styles.lieToggle}>
                    <input
                      type="radio"
                      name="about-us-lie"
                      checked={isLie}
                      onChange={() => authoring.setLie(statementIndex)}
                    />
                    <span>{t('aboutUs.lieLabel')}</span>
                  </label>
                </li>
              );
            })}
          </ol>
          {authoring.issues.length ? (
            <ul className={styles.errorText} role="alert">
              {authoring.issues.map(issue => <li key={issue}>{t(`aboutUs.issue.${issue}`)}</li>)}
            </ul>
          ) : null}
          <div className={styles.authoringActions}>
            <Button variant="ghost" icon={<ArrowLeft size={18} />} onClick={authoring.cancel}>{t('aboutUs.cancel')}</Button>
            <Button type="submit" icon={<EyeOff size={18} />}>{t('aboutUs.confirm')}</Button>
          </div>
        </form>
      ) : null}

      {authoring.step === 'done' ? (
        <div className={styles.turnPanel}>
          <Check size={34} aria-hidden="true" />
          <h2 className={styles.pageTitle}>{t('aboutUs.doneTitle')}</h2>
          <p>{t('aboutUs.doneHint', { count: authoring.names.length })}</p>
          {setupError ? <p className={styles.errorText} role="alert">{setupError}</p> : null}
          <div className={styles.authoringActions}>
            <Button variant="ghost" icon={<ArrowLeft size={18} />} onClick={authoring.cancel}>{t('aboutUs.cancel')}</Button>
            <Button icon={<Play size={18} />} onClick={onStart}>{t('setup.start')}</Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
