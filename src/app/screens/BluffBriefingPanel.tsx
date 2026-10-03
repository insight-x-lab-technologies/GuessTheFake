import { Eye, EyeOff, Hand, Theater } from 'lucide-react';
import { useState } from 'react';
import type { LocalProfile } from '../../core/profiles/profiles';
import { Button } from '../../core/ui/Button';
import type { Translate } from '../app-types';
import { PlayerAvatar } from './ProfileAvatar';
import styles from '../App.module.css';

// W17-02: only the bluff master looks; the fake shows behind a tap.
export function BluffBriefingPanel({
  t,
  masterName,
  profile,
  fakeText,
  kicker,
  onReady
}: {
  t: Translate;
  masterName: string;
  profile: LocalProfile | null;
  fakeText: string;
  kicker: string;
  onReady: () => void;
}) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div className={styles.passPanel} data-color={profile?.color}>
      <p className={styles.kicker}>{kicker}</p>
      <div className={styles.passAvatar} aria-hidden="true">
        <PlayerAvatar profile={profile} size="lg" />
      </div>
      <h2 className={styles.pageTitle}>{t('bluff.briefingTitle', { name: masterName })}</h2>
      <p><EyeOff size={16} aria-hidden="true" /> {t('bluff.briefingHint')}</p>
      {revealed ? (
        <>
          <p className={styles.briefingFake} role="status">
            <Theater size={18} aria-hidden="true" /> {fakeText}
          </p>
          <p>{t('bluff.briefingDefend')}</p>
          <Button icon={<Hand size={18} />} onClick={onReady}>{t('bluff.briefingReady')}</Button>
        </>
      ) : (
        <Button variant="secondary" icon={<Eye size={18} />} onClick={() => setRevealed(true)}>
          {t('bluff.briefingReveal')}
        </Button>
      )}
    </div>
  );
}
