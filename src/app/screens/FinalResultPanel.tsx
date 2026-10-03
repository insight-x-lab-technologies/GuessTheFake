import { Share2, Trophy } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '../../core/ui/Button';
import type { Translate } from '../app-types';
import type { NextObjective } from '../progress-tracks';
import { NextObjectiveCard } from './NextObjectiveCard';
import styles from '../App.module.css';

export function FinalResultPanel({
  t,
  winnerNames,
  scoreLines,
  nextObjective,
  categoryLabel,
  shareStatus,
  onShare,
  onPlayAgain
}: {
  t: Translate;
  winnerNames: string[];
  scoreLines: Array<{ id: string; label: string; avatar?: ReactNode }>;
  nextObjective: NextObjective | null;
  categoryLabel: (categoryId: string) => string;
  shareStatus: string;
  onShare: () => void;
  onPlayAgain: () => void;
}) {
  return (
    <div className={styles.finalPanel}>
      <Trophy size={34} />
      <h2 className={styles.pageTitle}>{winnerNames.join(', ')}</h2>
      <div className={styles.finalScores}>
        {scoreLines.map(line => <span key={line.id}>{line.avatar}{line.label}</span>)}
      </div>
      <NextObjectiveCard t={t} objective={nextObjective} categoryLabel={categoryLabel} />
      <div className={styles.actionCluster}>
        <Button variant="secondary" icon={<Share2 size={18} />} onClick={onShare}>
          {t('share.resultAction')}
        </Button>
        <Button onClick={onPlayAgain}>{t('game.playAgain')}</Button>
      </div>
      {shareStatus ? <p className={styles.helperText} role="status">{shareStatus}</p> : null}
    </div>
  );
}
