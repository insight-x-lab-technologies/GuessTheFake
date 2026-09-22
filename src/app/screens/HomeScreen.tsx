import { Play, ShieldCheck, Sparkles, Trophy } from 'lucide-react';
import { Button } from '../../core/ui/Button';
import type { Translate } from '../app-types';
import styles from '../App.module.css';

const homePreviewKeys = [
  'home.previewOne',
  'home.previewTwo',
  'home.previewThree',
  'home.previewFour',
  'home.previewFive'
];

export function HomeScreen({ t, onNewMatch }: { t: Translate; onNewMatch: () => void }) {
  return (
    <section className={styles.hero}>
      <div className={styles.heroCopy}>
        <p className={styles.kicker}>{t('app.kicker')}</p>
        <h2 className={styles.heroTitle}>{t('game.description')}</h2>
        <p>{t('home.subtitle')}</p>
        <Button icon={<Play size={18} />} onClick={onNewMatch}>
          {t('app.newGame')}
        </Button>
      </div>
      <div className={`${styles.contextArt} ${styles.contextHome}`} aria-label={t('visual.homeArt')}>
        <Sparkles size={28} />
        <Trophy size={32} />
        <ShieldCheck size={26} />
      </div>
      <div className={styles.statementPreview} aria-label={t('home.previewLabel')}>
        {homePreviewKeys.map(previewKey => (
          <div key={previewKey}>{t(previewKey)}</div>
        ))}
      </div>
    </section>
  );
}
