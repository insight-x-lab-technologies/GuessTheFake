import { Cog, Play, RotateCcw } from 'lucide-react';
import type { Language } from '../../core/i18n/i18n';
import { Button } from '../../core/ui/Button';
import type { Translate } from '../app-types';
import { getLanguageLabel } from '../browser';
import { ScreenHeader } from './ScreenHeader';
import styles from '../App.module.css';

export function NewMatchChoiceScreen({
  t,
  matchLanguageNotice,
  currentLanguage,
  onContinue,
  onRestart,
  onOpenSetup
}: {
  t: Translate;
  matchLanguageNotice: Language | null;
  currentLanguage: Language;
  onContinue: () => void;
  onRestart: () => void;
  onOpenSetup: () => void;
}) {
  return (
    <div className={styles.panel}>
      <ScreenHeader screen="play" kicker={t('newMatchChoice.kicker')} title={t('newMatchChoice.title')}>
        <p>{t('newMatchChoice.description')}</p>
        {matchLanguageNotice ? (
          <p className={styles.helperText}>
            {t('newMatchChoice.languageNotice', {
              match: getLanguageLabel(matchLanguageNotice),
              current: getLanguageLabel(currentLanguage)
            })}
          </p>
        ) : null}
      </ScreenHeader>
      <div className={styles.choiceGrid}>
        <article className={styles.smallCard}>
          <Play size={22} />
          <h3 className={styles.cardTitle}>{t('newMatchChoice.continueTitle')}</h3>
          <p>{t('newMatchChoice.continueDescription')}</p>
          <Button variant="secondary" icon={<Play size={18} />} onClick={onContinue}>
            {t('newMatchChoice.continueAction')}
          </Button>
        </article>
        <article className={styles.smallCard}>
          <RotateCcw size={22} />
          <h3 className={styles.cardTitle}>{t('newMatchChoice.restartTitle')}</h3>
          <p>{t('newMatchChoice.restartDescription')}</p>
          <Button variant="danger" icon={<RotateCcw size={18} />} onClick={onRestart}>
            {t('newMatchChoice.restartAction')}
          </Button>
        </article>
        <article className={styles.smallCard}>
          <Cog size={22} />
          <h3 className={styles.cardTitle}>{t('newMatchChoice.setupTitle')}</h3>
          <p>{t('newMatchChoice.setupDescription')}</p>
          <Button variant="ghost" icon={<Cog size={18} />} onClick={onOpenSetup}>
            {t('newMatchChoice.setupAction')}
          </Button>
        </article>
      </div>
    </div>
  );
}
