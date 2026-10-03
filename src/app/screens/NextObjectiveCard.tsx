import { Target } from 'lucide-react';
import type { Translate } from '../app-types';
import type { NextObjective } from '../progress-tracks';
import { CategoryArt } from './CategoryArt';
import styles from '../App.module.css';

// W13-04: the closest unfinished step, shown after a match.
export function NextObjectiveCard({
  t,
  objective,
  categoryLabel
}: {
  t: Translate;
  objective: NextObjective | null;
  categoryLabel: (categoryId: string) => string;
}) {
  if (!objective) return null;
  const { track } = objective;
  return (
    <div className={styles.objectiveCard} role="status">
      {track.categoryId ? <CategoryArt categoryId={track.categoryId} /> : <Target size={20} />}
      <div>
        <strong>{t('tracks.nextObjective')}</strong>
        <span>{t(track.objectiveKey, {
          remaining: objective.remaining,
          target: objective.nextTarget,
          category: track.categoryId ? categoryLabel(track.categoryId) : '',
          difficulty: track.difficulty ? t(`setup.${track.difficulty}`) : ''
        })}</span>
        <progress value={objective.progress} max={objective.nextTarget} />
      </div>
    </div>
  );
}
