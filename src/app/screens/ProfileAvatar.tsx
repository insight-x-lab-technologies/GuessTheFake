import type { LocalProfile } from '../../core/profiles/profiles';
import styles from '../App.module.css';

// Emoji on the profile color. Decorative: the name is always next to it.
export function ProfileAvatar({
  profile,
  size = 'md'
}: {
  profile: Pick<LocalProfile, 'avatar' | 'color'>;
  size?: 'sm' | 'md' | 'lg';
}) {
  return (
    <span className={styles.profileAvatar} data-color={profile.color} data-size={size} aria-hidden="true">
      {profile.avatar}
    </span>
  );
}
