import { CheckCircle2, Clock, Sparkles, Trophy, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import type { MultiplayerGameSnapshot } from '../../core/multiplayer/multiplayer';
import type { Translate } from '../app-types';
import styles from '../App.module.css';

// W13-06: room view for a TV or projector. It only reads a snapshot, so the
// same view serves the host's own screen and a joined display device.
export function PresenterView({
  t,
  snapshot,
  onClose
}: {
  t: Translate;
  snapshot: MultiplayerGameSnapshot | null;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const board = snapshot?.board ?? null;
  const ranking = snapshot ? [...snapshot.scoreboard].sort((a, b) => b.score - a.score) : [];
  const finished = snapshot?.phase === 'finished';

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className={styles.presenter} role="dialog" aria-modal="true" aria-label={t('presenter.title')} data-phase={snapshot?.phase ?? 'waiting'}>
      <header className={styles.presenterHeader}>
        <div>
          <p className={styles.kicker}>{t('game.title')}</p>
          <h2>
            {snapshot && snapshot.roundNumber > 0
              ? t('game.round', { current: snapshot.roundNumber, total: snapshot.totalRounds })
              : t('presenter.title')}
          </h2>
        </div>
        {board?.badge ? <span className={styles.presenterBadge}><Sparkles size={22} /> {board.badge}</span> : null}
        {snapshot && (snapshot.phase === 'playing' || snapshot.phase === 'preparing') ? (
          <div className={styles.presenterTimer} aria-label={t('game.timeLeft', { seconds: snapshot.timerSeconds })}>
            <Clock size={28} />
            <strong>{snapshot.timerSeconds}</strong>
          </div>
        ) : null}
        <button ref={closeRef} className={styles.presenterClose} type="button" onClick={onClose} aria-label={t('presenter.close')}>
          <X size={22} /> <span>{t('presenter.close')}</span>
        </button>
      </header>

      {!snapshot ? (
        <p className={styles.presenterPrompt}>{t('multiDevice.waiting')}</p>
      ) : board ? (
        <section className={styles.presenterBoard}>
          <p className={styles.presenterPrompt}>{board.prompt}{board.caption ? <span> · {board.caption}</span> : null}</p>
          <ol className={styles.presenterStatements}>
            {board.items.map((item, index) => (
              <li key={item.id} data-state={item.state}>
                <span className={styles.presenterNumber}>{index + 1}</span>
                <strong>{item.state === 'hidden' ? '?' : item.text}</strong>
                {item.label ? <em>{item.state === 'fake' ? <CheckCircle2 size={20} /> : null} {item.label}</em> : null}
              </li>
            ))}
          </ol>
          {board.explanation ? <p className={styles.presenterExplanation}>{board.explanation}</p> : null}
        </section>
      ) : (
        <section className={styles.presenterBoard}>
          <p className={styles.presenterPrompt}>
            {finished ? t('presenter.finalTitle') : t('presenter.turn', { name: snapshot.activeSubjectName })}
          </p>
        </section>
      )}

      {snapshot ? (
        <ol className={styles.presenterScores} aria-label={t('presenter.scoreboard')}>
          {ranking.map((row, index) => (
            <li key={row.name} data-leader={index === 0 && row.score > 0 ? 'true' : 'false'}>
              {index === 0 && row.score > 0 ? <Trophy size={22} /> : <span>{index + 1}</span>}
              <b>{row.name}</b>
              <strong>{row.score}</strong>
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}
