import type { ReactNode } from 'react';
import styles from '../App.module.css';

type ScreenProps = {
  children: ReactNode;
};

export function HomeScreen({ children }: ScreenProps) {
  return <section className={styles.hero}>{children}</section>;
}

export function SetupScreen({ children }: ScreenProps) {
  return <div className={styles.panel}>{children}</div>;
}

export function GameBoardScreen({ children }: ScreenProps) {
  return <div className={styles.gameBoard}>{children}</div>;
}

export function LeaderboardScreen({ children }: ScreenProps) {
  return <section className={styles.panel}>{children}</section>;
}

export function AchievementsScreen({ children }: ScreenProps) {
  return <section className={styles.panel}>{children}</section>;
}

export function PacksScreen({ children }: ScreenProps) {
  return <section className={styles.panel}>{children}</section>;
}

export function MultiDeviceScreen({ children }: ScreenProps) {
  return <section className={styles.panel}>{children}</section>;
}

export function GrowthScreen({ children }: ScreenProps) {
  return <section className={styles.panel}>{children}</section>;
}

export function SettingsScreen({ children }: ScreenProps) {
  return <section className={styles.panel}>{children}</section>;
}
