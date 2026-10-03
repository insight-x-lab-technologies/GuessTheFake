import { Flame, Medal, RotateCcw, Settings2, Share2, Target } from 'lucide-react';
import { Button } from '../../core/ui/Button';
import type { Translate } from '../app-types';
import type { SoloOutcome } from '../hooks/useMatch';
import type { NextObjective } from '../progress-tracks';
import { NextObjectiveCard } from './NextObjectiveCard';
import styles from '../App.module.css';

export function SoloResultPanel({
  t,
  outcome,
  points,
  correct,
  totalRounds,
  bestStreak,
  nextObjective,
  categoryLabel,
  shareStatus,
  onShare,
  onPlayAgain,
  onNewChallenge
}: {
  t: Translate;
  outcome: SoloOutcome | null;
  points: number;
  correct: number;
  totalRounds: number;
  bestStreak: number;
  nextObjective: NextObjective | null;
  categoryLabel: (categoryId: string) => string;
  shareStatus: string;
  onShare: () => void;
  onPlayAgain: () => void;
  onNewChallenge: () => void;
}) {
  const previous = outcome?.previous ?? null;
  return (
    <div className={styles.finalPanel}>
      <Medal size={34} />
      <p className={styles.kicker}>{t('solo.finalKicker')}</p>
      <h2 className={styles.pageTitle}>{t('solo.finalPoints', { points })}</h2>
      {outcome?.isNewRecord ? (
        <p className={styles.recordBadge} data-state="new">{t('solo.newRecord')}</p>
      ) : previous ? (
        <p className={styles.recordBadge}>{t('solo.recordCompare', {
          points: previous.points,
          difference: previous.points - points
        })}</p>
      ) : null}
      <div className={styles.finalScores}>
        <span><Target size={16} /> {t('solo.correctOf', { correct, total: totalRounds })}</span>
        <span><Flame size={16} /> {t('solo.bestStreak', { streak: bestStreak })}</span>
      </div>
      <NextObjectiveCard t={t} objective={nextObjective} categoryLabel={categoryLabel} />
      <div className={styles.actionCluster}>
        <Button icon={<RotateCcw size={18} />} onClick={onPlayAgain}>{t('solo.playAgain')}</Button>
        <Button variant="secondary" icon={<Share2 size={18} />} onClick={onShare}>
          {t('share.resultAction')}
        </Button>
        <Button variant="ghost" icon={<Settings2 size={18} />} onClick={onNewChallenge}>{t('solo.newChallenge')}</Button>
      </div>
      {shareStatus ? <p className={styles.helperText} role="status">{shareStatus}</p> : null}
    </div>
  );
}
