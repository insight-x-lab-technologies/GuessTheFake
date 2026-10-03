import { Palette, Play, User, X } from 'lucide-react';
import type { SeasonalSuggestion } from '../../core/themes/seasonal';
import { Button } from '../../core/ui/Button';
import type { Translate } from '../app-types';
import { Mascot } from './Mascot';
import styles from '../App.module.css';

const homePreviewKeys = [
  'home.previewOne',
  'home.previewTwo',
  'home.previewThree',
  'home.previewFour',
  'home.previewFive'
];

export function HomeScreen({
  t,
  seasonalSuggestion = null,
  onNewMatch,
  onPlaySolo,
  onApplySeasonal = () => {},
  onDismissSeasonal = () => {}
}: {
  t: Translate;
  // W16-05: offered only in season, until applied or dismissed.
  seasonalSuggestion?: SeasonalSuggestion | null;
  onNewMatch: () => void;
  onPlaySolo: () => void;
  onApplySeasonal?: () => void;
  onDismissSeasonal?: () => void;
}) {
  return (
    <section className={styles.hero}>
      {seasonalSuggestion ? (
        <aside className={styles.seasonalCard} aria-label={t(`art.seasonal.${seasonalSuggestion.season.id}.title`)}>
          <Mascot mood="celebrating" size="sm" />
          <div>
            <strong>{t(`art.seasonal.${seasonalSuggestion.season.id}.title`)}</strong>
            <span>{t(`art.seasonal.${seasonalSuggestion.season.id}.body`)}</span>
          </div>
          <div className={styles.actionCluster}>
            <Button variant="secondary" icon={<Palette size={16} />} onClick={onApplySeasonal}>{t('art.seasonal.apply')}</Button>
            <Button variant="ghost" icon={<X size={16} />} onClick={onDismissSeasonal}>{t('art.seasonal.dismiss')}</Button>
          </div>
        </aside>
      ) : null}
      <div className={styles.heroCopy}>
        <p className={styles.kicker}>{t('app.kicker')}</p>
        <h2 className={styles.heroTitle}>{t('game.description')}</h2>
        <p>{t('home.subtitle')}</p>
        <div className={styles.actionCluster}>
          <Button icon={<Play size={18} />} onClick={onNewMatch}>
            {t('app.newGame')}
          </Button>
          <Button variant="secondary" icon={<User size={18} />} onClick={onPlaySolo}>
            {t('solo.playSolo')}
          </Button>
        </div>
      </div>
      <div className={`${styles.contextArt} ${styles.contextHome}`} aria-label={t('visual.homeArt')}>
        <Mascot mood="suspicious" size="lg" />
      </div>
      <div className={styles.statementPreview} aria-label={t('home.previewLabel')}>
        {homePreviewKeys.map(previewKey => (
          <div key={previewKey}>{t(previewKey)}</div>
        ))}
      </div>
    </section>
  );
}
