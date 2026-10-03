import { BadgeCheck, Pencil, Save, Trash2, UserPlus, X } from 'lucide-react';
import { PROFILE_AVATARS, PROFILE_COLORS, PROFILE_NAME_MAX, PROFILE_NICKNAME_MAX } from '../../core/profiles/profiles';
import { Button } from '../../core/ui/Button';
import type { Translate } from '../app-types';
import type { ProfilesController } from '../hooks/useProfiles';
import { AvatarArt } from './AvatarArt';
import { Mascot } from './Mascot';
import { Medal } from './Medal';
import { ProfileAvatar } from './ProfileAvatar';
import { ScreenHeader } from './ScreenHeader';
import styles from '../App.module.css';

export function ProfilesScreen({
  t,
  profiles,
  challengeLabel
}: {
  t: Translate;
  profiles: ProfilesController;
  challengeLabel: (challengeKey: string) => string;
}) {
  const { draft } = profiles;
  const editing = Boolean(draft.id);

  return (
    <section className={styles.panel}>
      <ScreenHeader screen="profiles" title={t('profiles.title')}>
        <p>{t('profiles.subtitle')}</p>
      </ScreenHeader>
      {profiles.profileStatus ? <p className={styles.helperText} role="status">{profiles.profileStatus}</p> : null}
      <div className={styles.profilesLayout}>
        <form
          className={styles.smallCard}
          aria-label={editing ? t('profiles.editTitle') : t('profiles.createTitle')}
          onSubmit={event => {
            event.preventDefault();
            profiles.saveDraft();
          }}
        >
          <UserPlus size={22} />
          <h3 className={styles.cardTitle}>{editing ? t('profiles.editTitle') : t('profiles.createTitle')}</h3>
          <label className={styles.field}>
            <span>{t('profiles.name')}</span>
            <input
              value={draft.name}
              maxLength={PROFILE_NAME_MAX}
              onChange={event => profiles.updateDraft({ name: event.target.value })}
            />
          </label>
          <label className={styles.field}>
            <span>{t('profiles.nickname')}</span>
            <input
              value={draft.nickname}
              maxLength={PROFILE_NICKNAME_MAX}
              onChange={event => profiles.updateDraft({ nickname: event.target.value })}
            />
          </label>
          <fieldset className={styles.pickerField}>
            <legend>{t('profiles.avatar')}</legend>
            <div className={styles.avatarPicker} data-color={draft.color || PROFILE_COLORS[0]}>
              {PROFILE_AVATARS.map(avatar => (
                <button
                  key={avatar}
                  type="button"
                  aria-pressed={draft.avatar === avatar}
                  aria-label={t('profiles.avatarOption', { avatar: t(`art.avatars.${avatar}`) })}
                  title={t(`art.avatars.${avatar}`)}
                  onClick={() => profiles.updateDraft({ avatar })}
                >
                  <AvatarArt avatar={avatar} />
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className={styles.pickerField}>
            <legend>{t('profiles.color')}</legend>
            <div className={styles.colorPicker}>
              {PROFILE_COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  data-color={color}
                  aria-pressed={draft.color === color}
                  aria-label={t(`profiles.colors.${color}`)}
                  onClick={() => profiles.updateDraft({ color })}
                />
              ))}
            </div>
          </fieldset>
          <div className={styles.actionCluster}>
            <Button type="submit" icon={<Save size={18} />}>{editing ? t('profiles.save') : t('profiles.create')}</Button>
            {editing ? (
              <Button type="button" variant="ghost" icon={<X size={18} />} onClick={profiles.cancelDraft}>{t('profiles.cancel')}</Button>
            ) : null}
          </div>
        </form>

        {profiles.profileCards.length ? (
          <div className={styles.profileList}>
            {profiles.profileCards.map(({ profile, stats, trophies, bestSolo, soloRecordCount }) => (
              <article key={profile.id} className={styles.profileCard} data-color={profile.color}>
                <header>
                  <ProfileAvatar profile={profile} size="lg" />
                  <div>
                    <h3 className={styles.cardTitle}>{profile.name}</h3>
                    {profile.nickname ? <span>{profile.nickname}</span> : null}
                  </div>
                </header>
                <div className={styles.compactRows}>
                  <span><b>{t('profiles.stats.matches')}</b>{stats.matches}</span>
                  <span><b>{t('profiles.stats.wins')}</b>{stats.wins}</span>
                  <span><b>{t('profiles.stats.points')}</b>{stats.points}</span>
                  <span><b>{t('profiles.stats.correct')}</b>{t('profiles.stats.correctValue', { correct: stats.correct, rounds: stats.rounds })}</span>
                  <span>
                    <b>{t('profiles.stats.solo')}</b>
                    {bestSolo
                      ? t('profiles.stats.soloValue', { points: bestSolo.points, challenge: challengeLabel(bestSolo.challengeKey), count: soloRecordCount })
                      : t('profiles.stats.soloEmpty')}
                  </span>
                </div>
                <div>
                  <p className={styles.helperText}>
                    <BadgeCheck size={16} /> {t('profiles.trophies', { unlocked: trophies.unlockedCount, total: trophies.totalCount })}
                  </p>
                  <div className={styles.tagList}>
                    {trophies.items.filter(item => item.unlocked).map(item => (
                      <span key={item.definition.id} className={styles.medalTag}>
                        <Medal rarity={item.definition.rarity} size="sm" />
                        {t(item.definition.titleKey)}
                      </span>
                    ))}
                  </div>
                </div>
                <div className={styles.feedbackActions}>
                  <button type="button" onClick={() => profiles.editProfile(profile.id)}>
                    <Pencil size={16} /> {t('profiles.edit')}
                  </button>
                  <button type="button" onClick={() => profiles.deleteProfile(profile.id)}>
                    <Trash2 size={16} /> {t('profiles.remove')}
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <Mascot mood="thinking" />
            <p className={styles.helperText}>{t('profiles.empty')}</p>
          </div>
        )}
      </div>
    </section>
  );
}
