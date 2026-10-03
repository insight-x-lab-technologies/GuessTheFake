import type { LocalProfile } from '../../core/profiles/profiles';
import playerDefaultUrl from '../../assets/player-default.svg';
import { AvatarArt } from './AvatarArt';
import styles from '../App.module.css';

// W16-02: SVG avatar on the profile color. Decorative: the name is always
// next to it.
export function ProfileAvatar({
  profile,
  size = 'md'
}: {
  profile: Pick<LocalProfile, 'avatar' | 'color'>;
  size?: 'sm' | 'md' | 'lg';
}) {
  return (
    <span className={styles.profileAvatar} data-color={profile.color} data-size={size} aria-hidden="true">
      <AvatarArt avatar={profile.avatar} />
    </span>
  );
}

// Players without a profile keep the illustrated default portrait.
export function PlayerAvatar({
  profile,
  size = 'md'
}: {
  profile: Pick<LocalProfile, 'avatar' | 'color'> | null;
  size?: 'sm' | 'md' | 'lg';
}) {
  if (profile) return <ProfileAvatar profile={profile} size={size} />;
  return (
    <span className={styles.profileAvatar} data-size={size} data-default="true" aria-hidden="true">
      <img src={playerDefaultUrl} alt="" />
    </span>
  );
}
