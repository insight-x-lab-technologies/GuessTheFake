import type { ProfilesModel } from '../core/profiles/profiles';
import { getProfileIdFromSoloKey, parseSoloChallengeKey } from '../game/solo-records';
import type { Translate } from './app-types';

// "5 rounds · Science · Hard · special rounds" for a solo challenge key.
export function formatSoloChallenge(challengeKey: string, t: Translate, categoryLabel: (categoryId: string) => string) {
  const challenge = parseSoloChallengeKey(challengeKey);
  return [
    t('solo.challengeRounds', { rounds: challenge.totalRounds }),
    categoryLabel(challenge.categoryId),
    challenge.difficulty === 'all' ? t('setup.allDifficulties') : t(`setup.${challenge.difficulty}`),
    ...(challenge.specialRounds ? [t('specials.short')] : []),
    ...(challenge.kids ? [t('kids.short')] : []),
    ...(challenge.packIds?.length ? [t('solo.challengePacks', { count: challenge.packIds.length })] : [])
  ].join(' · ');
}

// Profile name for `profile:<id>` keys; the stored name otherwise.
export function formatSoloPlayer(playerKey: string, profiles: ProfilesModel) {
  const profileId = getProfileIdFromSoloKey(playerKey);
  if (!profileId) return playerKey;
  return profiles.profiles.find(profile => profile.id === profileId)?.name ?? playerKey;
}
