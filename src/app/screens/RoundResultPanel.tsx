import { CheckCircle2, ThumbsDown, ThumbsUp, XCircle } from 'lucide-react';
import type { ReactNode } from 'react';
import type { ContentRating } from '../../core/content-feedback/content-feedback';
import { Button } from '../../core/ui/Button';
import type { GuessTheFakeRound, GuessTheFakeState } from '../../game/types';
import type { LocalizeText, Translate } from '../app-types';
import styles from '../App.module.css';

export function RoundResultPanel({
  t,
  text,
  round,
  gameState,
  feedbackRating,
  onRate,
  onContinue
}: {
  t: Translate;
  text: LocalizeText;
  round: GuessTheFakeRound;
  gameState: GuessTheFakeState;
  feedbackRating: ContentRating | null;
  onRate: (rating: ContentRating) => void;
  onContinue: () => void;
}) {
  const guesses = Object.values(gameState.roundGuesses);
  const anyCorrect = guesses.some(guess => guess.correct);
  const feedbackOptions: Array<{ rating: ContentRating; icon: ReactNode; labelKey: string }> = [
    { rating: 'up', icon: <ThumbsUp size={16} />, labelKey: 'game.feedbackGood' },
    { rating: 'down', icon: <ThumbsDown size={16} />, labelKey: 'game.feedbackBad' },
    { rating: 'skip', icon: <XCircle size={16} />, labelKey: 'game.feedbackSkip' }
  ];

  return (
    <div className={styles.resultPanel} data-layout="mobile-stack">
      {anyCorrect ? <CheckCircle2 size={28} /> : <XCircle size={28} />}
      <div>
        <h3 className={styles.cardTitle}>{anyCorrect ? t('game.correct') : t('game.wrong')}</h3>
        <p>{text(round.explanation)}</p>
        <div className={styles.guessSummary} aria-label={t('game.allGuesses')}>
          {guesses.map(guess => (
            <span key={guess.playerId ?? guess.teamId}>
              {guess.correct ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
              <b>{guess.playerName ?? guess.teamName}</b>
              {t('game.scoreBreakdown', {
                points: guess.pointsAwarded,
                bonus: guess.speedBonus,
                multiplier: guess.streakMultiplier
              })}
            </span>
          ))}
        </div>
        <div className={styles.feedbackActions} aria-label={t('game.feedbackLabel')}>
          {feedbackOptions.map(option => (
            <button
              key={option.rating}
              type="button"
              aria-pressed={feedbackRating === option.rating}
              onClick={() => onRate(option.rating)}
            >
              {option.icon} {t(option.labelKey)}
            </button>
          ))}
        </div>
      </div>
      <Button onClick={onContinue}>
        {gameState.currentRoundIndex + 1 >= gameState.totalRounds ? t('game.finish') : t('game.nextRound')}
      </Button>
    </div>
  );
}
