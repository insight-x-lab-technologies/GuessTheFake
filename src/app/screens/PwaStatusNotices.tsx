import { CloudOff, RefreshCw, WifiOff, XCircle } from 'lucide-react';
import type { Translate } from '../app-types';
import type { PwaStatusController } from '../hooks/usePwaStatus';
import styles from '../App.module.css';

// Update toast, "ready offline" toast and the offline pill (W14-04). The
// toasts share the corner with the trophy toast, so they wait while it shows.
export function PwaStatusNotices({
  t,
  pwa,
  toastSlotBusy
}: {
  t: Translate;
  pwa: PwaStatusController;
  toastSlotBusy: boolean;
}) {
  return (
    <>
      {!toastSlotBusy && pwa.updateReady ? (
        <aside className={`${styles.toast} ${styles.toastWithAction}`} role="status" aria-live="polite">
          <RefreshCw size={20} />
          <div>
            <strong>{t('app.updateReady')}</strong>
            <span>{t('app.updateHint')}</span>
          </div>
          <button type="button" className={styles.toastAction} onClick={pwa.applyUpdate}>
            {t('app.updateAction')}
          </button>
          <button type="button" onClick={pwa.dismissUpdate} aria-label={t('app.dismiss')}>
            <XCircle size={16} />
          </button>
        </aside>
      ) : null}

      {!toastSlotBusy && !pwa.updateReady && pwa.offlineReady ? (
        <aside className={styles.toast} role="status" aria-live="polite">
          <CloudOff size={20} />
          <div>
            <strong>{t('app.offlineReady')}</strong>
            <span>{t('app.offlineReadyHint')}</span>
          </div>
          <button type="button" onClick={pwa.dismissOfflineReady} aria-label={t('app.dismiss')}>
            <XCircle size={16} />
          </button>
        </aside>
      ) : null}

      {!pwa.online ? (
        <p className={styles.offlinePill} role="status" title={t('app.offlineHint')}>
          <WifiOff size={14} aria-hidden="true" />
          <span>{t('app.offline')}</span>
          <span className={styles.visuallyHidden}>{t('app.offlineHint')}</span>
        </p>
      ) : null}
    </>
  );
}
