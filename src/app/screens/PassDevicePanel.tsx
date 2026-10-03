import { EyeOff, Hand } from 'lucide-react';
import type { LocalProfile } from '../../core/profiles/profiles';
import { Button } from '../../core/ui/Button';
import type { Translate } from '../app-types';
import { PlayerAvatar } from './ProfileAvatar';
import styles from '../App.module.css';

// W15-04: hand-off screen between players sharing one device. It covers the
// board, so the next player never sees the previous pick.
export function PassDevicePanel({
  t,
  name,
  members = [],
  profile,
  kicker,
  actionLabel,
  onReady
}: {
  t: Translate;
  name: string;
  // Team members, when the device goes to a team.
  members?: string[];
  profile: LocalProfile | null;
  kicker?: string;
  actionLabel?: string;
  onReady: () => void;
}) {
  return (
    <div className={styles.passPanel} data-color={profile?.color}>
      {kicker ? <p className={styles.kicker}>{kicker}</p> : null}
      <div className={styles.passAvatar} aria-hidden="true">
        {members.length ? <Hand size={34} /> : <PlayerAvatar profile={profile} size="lg" />}
      </div>
      <h2 className={styles.pageTitle}>{t('juice.pass.title', { name })}</h2>
      {members.length ? <p className={styles.passMembers}>{members.join(' · ')}</p> : null}
      <p><EyeOff size={16} aria-hidden="true" /> {t('juice.pass.hint')}</p>
      <Button icon={<Hand size={18} />} onClick={onReady}>
        {actionLabel ?? t('juice.pass.ready', { name })}
      </Button>
    </div>
  );
}
