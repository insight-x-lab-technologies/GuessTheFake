import { Clock, Play, RotateCcw } from 'lucide-react';
import type { MutableRefObject } from 'react';
import { Button } from '../../core/ui/Button';
import type { GuessTheFakeRound } from '../../game/types';
import type { LocalizeText, Translate } from '../app-types';
import type { GrowthController } from '../hooks/useGrowth';
import type { MatchController } from '../hooks/useMatch';
import { FinalResultPanel } from './FinalResultPanel';
import { RoundResultPanel } from './RoundResultPanel';
import { ScoreResetFeedback } from './ScoreResetFeedback';
import { StatementGrid } from './StatementGrid';
import styles from '../App.module.css';

export function GameBoardScreen({
  t,
  text,
  match,
  round,
  growth,
  statementButtonRefs
}: {
  t: Translate;
  text: LocalizeText;
  match: MatchController;
  round: GuessTheFakeRound;
  growth: Pick<GrowthController, 'growthStatus' | 'shareResult'>;
  statementButtonRefs: MutableRefObject<Array<HTMLButtonElement | null>>;
}) {
  const { gameState, timerSeconds, activeSubjectName: subjectName } = match;
  const isTeams = gameState.modeId === 'teams';
  const roundLabel = t('game.round', {
    current: Math.min(gameState.currentRoundIndex + 1, gameState.totalRounds),
    total: gameState.totalRounds
  });
  const readyLabel = isTeams
    ? t('game.readyTeam', { name: subjectName })
    : t('game.readyPlayer', { name: subjectName });
  const scoreLines = isTeams
    ? gameState.teams.map(team => ({ id: team.id, label: t('game.teamScore', { name: team.name, score: team.score }) }))
    : gameState.players.map(player => ({ id: player.id, label: `${player.name}: ${player.score}` }));

  return (
    <div className={styles.gameBoard}>
      <header className={styles.gameHeader}>
        <div>
          <p className={styles.kicker}>{roundLabel}</p>
          <h2 className={styles.pageTitle}>
            {isTeams ? t('game.activeTeam', { name: subjectName }) : t('game.activePlayer', { name: subjectName })}
          </h2>
        </div>
        <div className={styles.scoreArea}>
          <div className={styles.scoreStrip}>
            {scoreLines.map(line => <span key={line.id}>{line.label}</span>)}
            <button
              aria-controls="score-reset-confirmation"
              aria-expanded={match.scoreResetStatus === 'confirm'}
              className={styles.inlineTool}
              type="button"
              onClick={match.requestScoreReset}
            >
              <RotateCcw size={16} /> {t('game.recalibrateScores')}
            </button>
          </div>
          <ScoreResetFeedback
            id="score-reset-confirmation"
            status={match.scoreResetStatus}
            t={t}
            onConfirm={match.resetScores}
            onCancel={match.cancelScoreReset}
          />
        </div>
      </header>

      {gameState.phase === 'intro' ? (
        <div className={styles.turnPanel}>
          <div className={styles.timerBadge}><Clock size={26} /></div>
          <p className={styles.kicker}>{roundLabel}</p>
          <h2 className={styles.pageTitle}>{readyLabel}</h2>
          <p>{t('game.prepareHint')}</p>
          <Button icon={<Play size={18} />} onClick={match.beginTurn}>{t('game.startTurn')}</Button>
        </div>
      ) : null}

      {gameState.phase === 'preparing' ? (
        <div className={styles.turnPanel}>
          <div className={styles.timerRing}>
            <strong>{timerSeconds}</strong>
            <span>{t('game.secondsLabel')}</span>
          </div>
          <h2 className={styles.pageTitle}>{t('game.preparation')}</h2>
          <p>{readyLabel}</p>
          <Button onClick={match.showStatementsNow}>{t('game.revealBoard')}</Button>
        </div>
      ) : null}

      {gameState.phase === 'playing' || gameState.phase === 'revealed' ? (
        <>
          <div className={styles.roundToolbar}>
            <p className={styles.prompt}>
              {gameState.phase === 'revealed'
                ? t('game.revealedPrompt')
                : gameState.modeId === 'all-guess'
                  ? t('game.chooseFakeAll', { name: subjectName })
                  : t('game.chooseFake')}
            </p>
            {gameState.phase === 'playing' ? (
              <span className={styles.timerPill}><Clock size={16} /> {t('game.timeLeft', { seconds: timerSeconds })}</span>
            ) : null}
          </div>
          <StatementGrid
            t={t}
            text={text}
            round={round}
            gameState={gameState}
            buttonRefs={statementButtonRefs}
            onChoose={match.chooseStatement}
          />
        </>
      ) : null}

      {gameState.phase === 'revealed' ? (
        <RoundResultPanel
          t={t}
          text={text}
          round={round}
          gameState={gameState}
          feedbackRating={match.currentRoundFeedbackRating}
          onRate={match.rateCurrentRound}
          onContinue={match.continueRound}
        />
      ) : null}

      {gameState.phase === 'finished' ? (
        <FinalResultPanel
          t={t}
          winnerNames={match.winners.map(player => player.name)}
          scoreLines={scoreLines}
          shareStatus={growth.growthStatus}
          onShare={growth.shareResult}
          onPlayAgain={() => match.openCleanSetup()}
        />
      ) : null}
    </div>
  );
}
