import { Clock, Eye, MonitorUp, Play, RotateCcw, Sparkles, Tv } from 'lucide-react';
import type { MutableRefObject } from 'react';
import type { LocalProfile } from '../../core/profiles/profiles';
import { Button } from '../../core/ui/Button';
import { getVisibleStatementCount } from '../../game/rules';
import type { GuessTheFakeRound } from '../../game/types';
import type { LocalizeText, Translate } from '../app-types';
import type { GrowthController } from '../hooks/useGrowth';
import type { MatchController } from '../hooks/useMatch';
import type { MultiDeviceController } from '../hooks/useMultiDevice';
import { FinalResultPanel } from './FinalResultPanel';
import { ProfileAvatar } from './ProfileAvatar';
import { RoundResultPanel } from './RoundResultPanel';
import { ScoreResetFeedback } from './ScoreResetFeedback';
import { SoloResultPanel } from './SoloResultPanel';
import { StatementGrid } from './StatementGrid';
import { TableMomentPanel } from './TableMomentPanel';
import styles from '../App.module.css';

export function GameBoardScreen({
  t,
  text,
  match,
  round,
  growth,
  presenter,
  categoryLabel,
  getProfileForName,
  statementButtonRefs
}: {
  t: Translate;
  text: LocalizeText;
  match: MatchController;
  // Null once the match is finished: the round index moves past the last round.
  round: GuessTheFakeRound | null;
  growth: Pick<GrowthController, 'growthStatus' | 'shareResult'>;
  presenter: Pick<MultiDeviceController, 'openPresenter' | 'openPresenterWindow'>;
  categoryLabel: (categoryId: string) => string;
  getProfileForName: (name: string) => LocalProfile | null;
  statementButtonRefs: MutableRefObject<Array<HTMLButtonElement | null>>;
}) {
  const { gameState, timerSeconds, activeSubjectName: subjectName, solo, specialRound } = match;
  const isTeams = gameState.modeId === 'teams';
  const roundLabel = t('game.round', {
    current: Math.min(gameState.currentRoundIndex + 1, gameState.totalRounds),
    total: gameState.totalRounds
  });
  const readyLabel = isTeams
    ? t('game.readyTeam', { name: subjectName })
    : t('game.readyPlayer', { name: subjectName });
  const avatarFor = (name: string) => {
    const profile = getProfileForName(name);
    return profile ? <ProfileAvatar profile={profile} size="sm" /> : undefined;
  };
  const scoreLines = isTeams
    ? gameState.teams.map(team => ({ id: team.id, label: t('game.teamScore', { name: team.name, score: team.score }), avatar: undefined }))
    : gameState.players.map(player => ({ id: player.id, label: `${player.name}: ${player.score}`, avatar: avatarFor(player.name) }));
  const soloPlayer = gameState.players[0];
  const soloStreak = soloPlayer ? gameState.currentStreakByPlayer[soloPlayer.id] ?? 0 : 0;
  const answeredRounds = gameState.currentRoundIndex + (gameState.phase === 'revealed' ? 1 : 0);
  const visibleCount = getVisibleStatementCount(gameState);
  const showSpecial = Boolean(specialRound) && gameState.phase !== 'finished';

  return (
    <div className={styles.gameBoard}>
      <header className={styles.gameHeader}>
        <div>
          {solo ? (
            <h2 className={styles.pageTitle}>{roundLabel}</h2>
          ) : (
            <>
              <p className={styles.kicker}>{roundLabel}</p>
              <h2 className={styles.pageTitle}>
                {isTeams ? t('game.activeTeam', { name: subjectName }) : t('game.activePlayer', { name: subjectName })}
              </h2>
            </>
          )}
          {showSpecial && specialRound ? (
            <div className={styles.specialBanner} role="note">
              <Sparkles size={18} />
              <strong>{t(`specials.${specialRound}.title`)}</strong>
              <span>
                {specialRound === 'category-challenge' && round
                  ? t('specials.category-challenge.categoryLine', { category: categoryLabel(round.categoryId) })
                  : t(`specials.${specialRound}.description`)}
              </span>
            </div>
          ) : null}
        </div>
        <div className={styles.scoreArea}>
          {solo ? (
            <div className={styles.scoreStrip} aria-label={t('solo.statsLabel')}>
              <span>{t('solo.points', { points: soloPlayer?.score ?? 0 })}</span>
              <span>{t('solo.correctOf', { correct: gameState.correctGuessesInMatch, total: answeredRounds })}</span>
              <span>{t('solo.streak', { streak: soloStreak })}</span>
            </div>
          ) : (
            <>
              <div className={styles.scoreStrip}>
                {scoreLines.map(line => <span key={line.id}>{line.avatar}{line.label}</span>)}
                <button
                  aria-controls="score-reset-confirmation"
                  aria-expanded={match.scoreResetStatus === 'confirm'}
                  className={styles.inlineTool}
                  type="button"
                  onClick={match.requestScoreReset}
                >
                  <RotateCcw size={16} /> {t('game.recalibrateScores')}
                </button>
                <button className={styles.inlineTool} type="button" onClick={presenter.openPresenterWindow}>
                  <MonitorUp size={16} /> {t('presenter.openWindow')}
                </button>
                <button className={styles.inlineTool} type="button" onClick={presenter.openPresenter}>
                  <Tv size={16} /> {t('presenter.open')}
                </button>
              </div>
              <ScoreResetFeedback
                id="score-reset-confirmation"
                status={match.scoreResetStatus}
                t={t}
                onConfirm={match.resetScores}
                onCancel={match.cancelScoreReset}
              />
            </>
          )}
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

      {round && (gameState.phase === 'playing' || gameState.phase === 'discussing' || gameState.phase === 'revealed') ? (
        <>
          <div className={styles.roundToolbar}>
            <p className={styles.prompt}>
              {gameState.phase === 'revealed'
                ? t('game.revealedPrompt')
                : gameState.phase === 'discussing'
                  ? t('moments.prompt')
                  : gameState.modeId === 'all-guess'
                    ? t('game.chooseFakeAll', { name: subjectName })
                    : t('game.chooseFake')}
            </p>
            {gameState.phase === 'playing' && visibleCount < round.statements.length ? (
              <button className={styles.inlineTool} type="button" onClick={match.showNextClue}>
                <Eye size={16} /> {t('specials.gradual-clue.revealNext', { visible: visibleCount, total: round.statements.length })}
              </button>
            ) : null}
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
            visibleCount={visibleCount}
            changing={Boolean(match.changingSubjectId)}
            onChoose={match.chooseStatement}
          />
        </>
      ) : null}

      {gameState.phase === 'discussing' ? (
        <TableMomentPanel
          t={t}
          gameState={gameState}
          changingSubjectId={match.changingSubjectId}
          onVote={match.voteInMoment}
          onStartChange={match.startChangingGuess}
          onReveal={match.revealMoment}
        />
      ) : null}

      {round && gameState.phase === 'revealed' ? (
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

      {gameState.phase === 'finished' && solo ? (
        <SoloResultPanel
          t={t}
          outcome={match.soloOutcome}
          points={soloPlayer?.score ?? 0}
          correct={gameState.correctGuessesInMatch}
          totalRounds={gameState.totalRounds}
          bestStreak={gameState.longestStreakInMatch}
          nextObjective={match.nextObjective}
          categoryLabel={categoryLabel}
          shareStatus={growth.growthStatus}
          onShare={growth.shareResult}
          onPlayAgain={match.replaySoloChallenge}
          onNewChallenge={() => match.openCleanSetup()}
        />
      ) : null}

      {gameState.phase === 'finished' && !solo ? (
        <FinalResultPanel
          t={t}
          winnerNames={match.winners.map(player => player.name)}
          scoreLines={scoreLines}
          nextObjective={match.nextObjective}
          categoryLabel={categoryLabel}
          shareStatus={growth.growthStatus}
          onShare={growth.shareResult}
          onPlayAgain={() => match.openCleanSetup()}
        />
      ) : null}
    </div>
  );
}
