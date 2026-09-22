import { CheckCircle2, XCircle } from 'lucide-react';
import type { Translate } from '../app-types';
import styles from '../App.module.css';

export function ScoreResetFeedback({
  id,
  status,
  t,
  onConfirm,
  onCancel
}: {
  id: string;
  status: 'confirm' | 'done' | null;
  t: Translate;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (status === 'confirm') {
    return (
      <div className={styles.scoreResetPanel} id={id} role="group" aria-label={t('game.recalibrateConfirmTitle')}>
        <div>
          <strong>{t('game.recalibrateConfirmTitle')}</strong>
          <p>{t('game.recalibrateConfirmDescription')}</p>
        </div>
        <div className={styles.scoreResetActions}>
          <button type="button" className={styles.inlineTool} onClick={onConfirm}>
            <CheckCircle2 size={16} /> {t('game.recalibrateConfirm')}
          </button>
          <button type="button" className={styles.inlineTool} onClick={onCancel}>
            <XCircle size={16} /> {t('game.recalibrateCancel')}
          </button>
        </div>
      </div>
    );
  }

  if (status === 'done') {
    return (
      <p className={styles.scoreResetNotice} role="status">
        <CheckCircle2 size={16} /> {t('game.recalibrateDone')}
      </p>
    );
  }

  return null;
}
