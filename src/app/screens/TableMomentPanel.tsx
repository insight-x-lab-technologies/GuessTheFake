import { Eye, MessageCircle, Repeat2, Vote } from 'lucide-react';
import { Button } from '../../core/ui/Button';
import { getVoteCandidates, TABLE_VOTE_BONUS } from '../../game/rules';
import type { GuessTheFakeState } from '../../game/types';
import type { Translate } from '../app-types';
import styles from '../App.module.css';

// W13-01: the moment between the last guess and the reveal.
export function TableMomentPanel({
  t,
  gameState,
  changingSubjectId,
  onVote,
  onStartChange,
  onReveal
}: {
  t: Translate;
  gameState: GuessTheFakeState;
  changingSubjectId: string | null;
  onVote: (subjectId: string) => void;
  onStartChange: (subjectId: string | null) => void;
  onReveal: () => void;
}) {
  const moment = gameState.tableMoment;
  if (!moment) return null;
  const guesses = Object.entries(gameState.roundGuesses);
  const icon = moment.kind === 'vote' ? <Vote size={28} /> : moment.kind === 'change-mind' ? <Repeat2 size={28} /> : <MessageCircle size={28} />;

  return (
    <div className={styles.momentPanel} role="region" aria-label={t('moments.label')}>
      {icon}
      <div>
        <p className={styles.kicker}>{t('moments.label')}</p>
        <h3 className={styles.cardTitle}>{t(`moments.${moment.kind}.title`)}</h3>
        <p>{t(`moments.${moment.kind}.description`, { bonus: TABLE_VOTE_BONUS })}</p>

        {moment.kind === 'vote' ? (
          <div className={styles.momentChoices} aria-label={t('moments.vote.title')}>
            {getVoteCandidates(gameState).map(candidate => (
              <button
                key={candidate.id}
                type="button"
                aria-pressed={moment.votedSubjectId === candidate.id}
                onClick={() => onVote(candidate.id)}
              >
                {candidate.name}
              </button>
            ))}
          </div>
        ) : null}

        {moment.kind === 'change-mind' ? (
          <div className={styles.momentChoices}>
            {guesses.map(([subjectId, guess]) => {
              const name = guess.teamName ?? guess.playerName ?? subjectId;
              const used = moment.changedSubjectIds.includes(subjectId);
              const active = changingSubjectId === subjectId;
              return (
                <button
                  key={subjectId}
                  type="button"
                  aria-pressed={active}
                  disabled={used}
                  onClick={() => onStartChange(active ? null : subjectId)}
                >
                  {used ? t('moments.change-mind.used', { name }) : t('moments.change-mind.action', { name })}
                </button>
              );
            })}
          </div>
        ) : null}
        {changingSubjectId ? <p className={styles.helperText} role="status">{t('moments.change-mind.pick')}</p> : null}
      </div>
      <Button icon={<Eye size={18} />} onClick={onReveal}>{t('moments.reveal')}</Button>
    </div>
  );
}
