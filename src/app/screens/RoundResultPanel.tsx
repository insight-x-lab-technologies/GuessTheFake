import { CheckCircle2, ThumbsDown, ThumbsUp, XCircle } from 'lucide-react';
import type { ReactNode } from 'react';
import type { ContentRating } from '../../core/content-feedback/content-feedback';
import { Button } from '../../core/ui/Button';
import { isSoloMode } from '../../game/modes';
import { ABOUT_US_CATEGORY_ID } from '../../game/about-us';
import { getBluffOutcome, getCurrentSpecialRound, getVoteCandidates, TABLE_VOTE_BONUS } from '../../game/rules';
import type { GuessResult, GuessTheFakeRound, GuessTheFakeState } from '../../game/types';
import type { LocalizeText, Translate } from '../app-types';
import { useCountUp } from '../hooks/useCountUp';
import { getRevealMood } from '../mascot';
import { Mascot } from './Mascot';
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
  const solo = isSoloMode(gameState.modeId);
  const special = getCurrentSpecialRound(gameState);
  const votedId = gameState.tableMoment?.kind === 'vote' ? gameState.tableMoment.votedSubjectId : null;
  const voted = votedId ? getVoteCandidates(gameState).find(candidate => candidate.id === votedId) : null;
  const bluff = getBluffOutcome(gameState);
  // W17-01: table rounds are not builtin content, nothing to rate.
  const tableRound = round.categoryId === ABOUT_US_CATEGORY_ID;
  const explanation = text(round.explanation);
  const feedbackOptions: Array<{ rating: ContentRating; icon: ReactNode; labelKey: string }> = [
    { rating: 'up', icon: <ThumbsUp size={16} />, labelKey: 'game.feedbackGood' },
    { rating: 'down', icon: <ThumbsDown size={16} />, labelKey: 'game.feedbackBad' },
    { rating: 'skip', icon: <XCircle size={16} />, labelKey: 'game.feedbackSkip' }
  ];

  return (
    <div className={styles.resultPanel} data-layout="mobile-stack">
      <Mascot mood={getRevealMood(anyCorrect)} />
      <div>
        <h3 className={styles.cardTitle}>{anyCorrect ? t('game.correct') : t('game.wrong')}</h3>
        {explanation ? <p>{explanation}</p> : null}
        {bluff ? (
          <p className={styles.specialNote} role="status">
            {bluff.fooledNames.length
              ? t('bluff.result', { name: bluff.blufferName, count: bluff.fooledNames.length, points: bluff.points, names: bluff.fooledNames.join(', ') })
              : t('bluff.resultNone', { name: bluff.blufferName })}
          </p>
        ) : null}
        {special ? <p className={styles.specialNote}>{t(`specials.${special}.result`)}</p> : null}
        {voted ? <p className={styles.specialNote}>{t('moments.vote.result', { name: voted.name, bonus: TABLE_VOTE_BONUS })}</p> : null}
        <div className={styles.guessSummary} aria-label={solo ? t('solo.yourGuess') : t('game.allGuesses')}>
          {guesses.map(guess => (
            <span key={guess.playerId ?? guess.teamId}>
              {guess.correct ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
              <b>{solo ? t('solo.yourGuess') : guess.playerName ?? guess.teamName}</b>
              <GuessPoints t={t} guess={guess} />
              {guess.changedMind ? <i>{t('moments.change-mind.changed')}</i> : null}
            </span>
          ))}
        </div>
        {tableRound ? null : <div className={styles.feedbackActions} aria-label={t('game.feedbackLabel')}>
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
        </div>}
      </div>
      <Button onClick={onContinue}>
        {gameState.currentRoundIndex + 1 >= gameState.totalRounds ? t('game.finish') : t('game.nextRound')}
      </Button>
    </div>
  );
}

// W15-03: points count up; a positive speed bonus floats above them.
function GuessPoints({ t, guess }: { t: Translate; guess: GuessResult }) {
  const points = useCountUp(guess.pointsAwarded);
  return (
    <>
      {t(guess.pointsAwarded < 0 ? 'game.scoreLoss' : 'game.scoreBreakdown', {
        points,
        loss: Math.abs(points),
        bonus: guess.speedBonus,
        multiplier: guess.streakMultiplier
      })}
      {guess.speedBonus > 0 ? (
        <i className={styles.bonusFloat} aria-hidden="true">{t('juice.bonusFloat', { bonus: guess.speedBonus })}</i>
      ) : null}
    </>
  );
}
