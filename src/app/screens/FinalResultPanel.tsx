import { Drama, Flame, PackagePlus, RotateCcw, Settings2, Share2, Zap } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import { Button } from '../../core/ui/Button';
import type { LocalizeText, Translate } from '../app-types';
import type { MatchHighlight, PodiumEntry } from '../match-summary';
import type { NextObjective } from '../progress-tracks';
import { Mascot } from './Mascot';
import { NextObjectiveCard } from './NextObjectiveCard';
import styles from '../App.module.css';

// Podium slots left to right: 2nd, 1st, 3rd.
const PODIUM_ORDER = [1, 0, 2];

export function FinalResultPanel({
  t,
  text,
  winnerNames,
  podium,
  rest,
  highlights,
  avatarFor,
  nextObjective,
  categoryLabel,
  shareStatus,
  onShare,
  onRematch,
  onNewSetup,
  saveAsPack
}: {
  t: Translate;
  text: LocalizeText;
  winnerNames: string[];
  podium: PodiumEntry[];
  rest: PodiumEntry[];
  highlights: MatchHighlight[];
  avatarFor: (name: string) => ReactNode;
  nextObjective: NextObjective | null;
  categoryLabel: (categoryId: string) => string;
  shareStatus: string;
  onShare: () => void;
  onRematch: () => void;
  onNewSetup: () => void;
  // W17-01: "about us" rounds can become a local pack.
  saveAsPack?: { status: string; onSave: () => void };
}) {
  return (
    <div className={styles.finalPanel}>
      <Mascot mood="celebrating" size="lg" />
      <p className={styles.kicker}>{t('juice.podium.kicker')}</p>
      <h2 className={styles.pageTitle}>{winnerNames.join(', ')}</h2>
      <ol className={styles.podium} aria-label={t('juice.podium.label')}>
        {PODIUM_ORDER.filter(index => podium[index]).map(index => {
          const entry = podium[index];
          return (
            <li
              key={entry.id}
              data-place={entry.rank}
              style={{ '--podium-delay': `${index * 180}ms` } as CSSProperties}
            >
              <span className={styles.podiumAvatar}>{avatarFor(entry.name)}</span>
              <b>{entry.name}</b>
              <span className={styles.podiumScore}>{t('juice.podium.points', { points: entry.score })}</span>
              <span className={styles.podiumStep} aria-label={t('juice.podium.place', { place: entry.rank })}>
                {entry.rank}
              </span>
            </li>
          );
        })}
      </ol>
      {rest.length ? (
        <div className={styles.finalScores}>
          {rest.map(entry => (
            <span key={entry.id}>
              {avatarFor(entry.name)}
              {t('juice.podium.restLine', { place: entry.rank, name: entry.name, points: entry.score })}
            </span>
          ))}
        </div>
      ) : null}
      {highlights.length ? (
        <ul className={styles.highlightList} aria-label={t('juice.highlights.label')}>
          {highlights.map(highlight => (
            <li key={highlight.kind}>
              {highlight.kind === 'fastest' ? <Zap size={18} aria-hidden="true" /> : null}
              {highlight.kind === 'longest-streak' ? <Flame size={18} aria-hidden="true" /> : null}
              {highlight.kind === 'best-bluff' ? <Drama size={18} aria-hidden="true" /> : null}
              <span>
                <b>{t(`juice.highlights.${highlight.kind}`)}</b>
                {highlight.kind === 'fastest'
                  ? t('juice.highlights.fastestLine', { name: highlight.name, seconds: highlight.seconds })
                  : highlight.kind === 'longest-streak'
                    ? t('juice.highlights.streakLine', { name: highlight.name, streak: highlight.streak })
                    : t('juice.highlights.bluffLine', { text: text(highlight.text), count: highlight.fooled })}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
      <NextObjectiveCard t={t} objective={nextObjective} categoryLabel={categoryLabel} />
      <div className={styles.actionCluster}>
        <Button icon={<RotateCcw size={18} />} onClick={onRematch}>{t('juice.rematch')}</Button>
        <Button variant="secondary" icon={<Share2 size={18} />} onClick={onShare}>
          {t('share.resultAction')}
        </Button>
        {saveAsPack ? (
          <Button variant="secondary" icon={<PackagePlus size={18} />} onClick={saveAsPack.onSave} disabled={Boolean(saveAsPack.status)}>
            {t('aboutUs.saveAsPack')}
          </Button>
        ) : null}
        <Button variant="ghost" icon={<Settings2 size={18} />} onClick={onNewSetup}>{t('game.playAgain')}</Button>
      </div>
      {shareStatus ? <p className={styles.helperText} role="status">{shareStatus}</p> : null}
      {saveAsPack?.status ? <p className={styles.helperText} role="status">{saveAsPack.status}</p> : null}
    </div>
  );
}
