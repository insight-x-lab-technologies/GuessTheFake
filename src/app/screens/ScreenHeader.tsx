import type { ReactNode } from 'react';
import type { Screen } from '../app-types';
import { getScreenIcon, screenToneClass } from '../navigation';
import styles from '../App.module.css';

export function ScreenHeader({
  screen,
  title,
  kicker,
  children,
  aside
}: {
  screen: Screen;
  title: string;
  kicker?: string;
  children?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <div className={styles.pageHeader}>
      <div className={`${styles.screenMark} ${styles[screenToneClass[screen]]}`} aria-hidden="true">
        {getScreenIcon(screen, 20)}
      </div>
      <div className={styles.pageHeaderText}>
        {kicker ? <p className={styles.kicker}>{kicker}</p> : null}
        <h2 className={styles.pageTitle}>{title}</h2>
        {children}
      </div>
      {aside}
    </div>
  );
}

// Desktop shows the actions inline; mobile tucks them into a closed disclosure.
export function ResponsiveActions({
  children,
  label,
  name
}: {
  children: ReactNode;
  label: string;
  name: string;
}) {
  return (
    <>
      <div className={`${styles.actionCluster} ${styles.desktopActions}`}>{children}</div>
      <details className={styles.mobileActionDisclosure} data-mobile-actions={name}>
        <summary>{label}</summary>
        <div className={styles.actionCluster}>{children}</div>
      </details>
    </>
  );
}
