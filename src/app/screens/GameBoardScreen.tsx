import { Eye, MessageCircleHeart, MonitorUp, Play, RotateCcw, Sparkles, Theater, Tv } from 'lucide-react';
import type { MutableRefObject } from 'react';
import type { LocalProfile } from '../../core/profiles/profiles';
import { Button } from '../../core/ui/Button';
import { isEveryoneGuessesMode } from '../../game/modes';
import { getVisibleStatementCount } from '../../game/rules';
import type { GuessTheFakeRound } from '../../game/types';
import type { LocalizeText, Translate } from '../app-types';
import type { GrowthController } from '../hooks/useGrowth';
import type { MatchController } from '../hooks/useMatch';
import type { MultiDeviceController } from '../hooks/useMultiDevice';
import { getFinalMood } from '../mascot';
import { getMatchHighlights, getPodium } from '../match-summary';
import { BluffBriefingPanel } from './BluffBriefingPanel';
import { CategoryArt } from './CategoryArt';
import { ConfettiBurst } from './ConfettiBurst';
import { FinalResultPanel } from './FinalResultPanel';
import { Mascot } from './Mascot';
import { PassDevicePanel } from './PassDevicePanel';
import { PlayerAvatar } from './ProfileAvatar';
import { RoundMenu } from './RoundMenu';
import { RoundResultPanel } from './RoundResultPanel';
import { RoundTimer } from './RoundTimer';
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
  statementButtonRefs,
  saveAsPack
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
  saveAsPack?: { status: string; onSave: () => void };
}) {
  const { gameState, timerSeconds, activeSubjectName: subjectName, solo, specialRound, handoffSubject, bluffer } = match;
  const bluffMaster = gameState.modeId === 'bluff-master';
  const everyoneGuesses = isEveryoneGuessesMode(gameState.modeId);
  const isTeams = gameState.modeId === 'teams';
  const roundLabel = t('game.round', {
    current: Math.min(gameState.currentRoundIndex + 1, gameState.totalRounds),
    total: gameState.totalRounds
  });
  const readyLabel = isTeams
    ? t('game.readyTeam', { name: subjectName })
    : t('game.readyPlayer', { name: subjectName });
  const avatarFor = (name: string) => <PlayerAvatar profile={getProfileForName(name)} size="sm" />;
  const scoreLines = isTeams
    ? gameState.teams.map(team => ({ id: team.id, label: t('game.teamScore', { name: team.name, score: team.score }), avatar: undefined }))
    : gameState.players.map(player => ({ id: player.id, label: `${player.name}: ${player.score}`, avatar: avatarFor(player.name) }));
  const teamMembers = (teamName: string) => {
    const team = gameState.teams.find(candidate => candidate.name === teamName);
    return team ? team.playerIds.map(id => gameState.players.find(player => player.id === id)?.name ?? '').filter(Boolean) : [];
  };
  const soloPlayer = gameState.players[0];
  const soloStreak = soloPlayer ? gameState.currentStreakByPlayer[soloPlayer.id] ?? 0 : 0;
  const answeredRounds = gameState.currentRoundIndex + (gameState.phase === 'revealed' ? 1 : 0);
  const visibleCount = getVisibleStatementCount(gameState);
  const showSpecial = Boolean(specialRound) && gameState.phase !== 'finished';
  const anyCorrect = Object.values(gameState.roundGuesses).some(guess => guess.correct);
  const onTable = gameState.phase === 'playing' || gameState.phase === 'discussing' || gameState.phase === 'revealed';
  const handingOff = gameState.phase === 'playing' && Boolean(handoffSubject);
  const finished = gameState.phase === 'finished';
  const celebrate = finished && (solo ? Boolean(match.soloOutcome?.isNewRecord) : true);
  const { podium, rest } = finished && !solo ? getPodium(gameState) : { podium: [], rest: [] };

  return (
    <div className={styles.gameBoard} data-phase={gameState.phase}>
      <header className={styles.gameHeader}>
        <div className={styles.gameHeaderTitle}>
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
          {bluffer && gameState.phase !== 'finished' ? (
            <div className={styles.bluffBanner} role="note">
              {bluffMaster ? <Theater size={18} /> : <MessageCircleHeart size={18} />}
              <strong>{t(bluffMaster ? 'bluff.masterBanner' : 'bluff.aboutUsBanner', { name: bluffer.name })}</strong>
              <span>{t(bluffMaster ? 'bluff.masterBannerHint' : 'bluff.aboutUsBannerHint', { name: bluffer.name })}</span>
            </div>
          ) : null}
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
              <div className={styles.scoreRow}>
                <div className={styles.scoreStrip} aria-label={t('juice.scoreboard')}>
                  {scoreLines.map(line => <span key={line.id}>{line.avatar}{line.label}</span>)}
                </div>
                <RoundMenu
                  t={t}
                  items={[
                    {
                      id: 'recalibrate',
                      icon: <RotateCcw size={16} />,
                      label: t('game.recalibrateScores'),
                      controls: 'score-reset-confirmation',
                      onSelect: match.requestScoreReset
                    },
                    { id: 'presenter-window', icon: <MonitorUp size={16} />, label: t('presenter.openWindow'), onSelect: presenter.openPresenterWindow },
                    { id: 'presenter', icon: <Tv size={16} />, label: t('presenter.open'), onSelect: presenter.openPresenter }
                  ]}
                />
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

      {gameState.phase === 'intro' && bluffMaster && bluffer && round ? (
        <BluffBriefingPanel
          key={gameState.currentRoundIndex}
          t={t}
          masterName={bluffer.name}
          profile={getProfileForName(bluffer.name)}
          fakeText={text(round.statements.find(statement => statement.id === round.fakeStatementId)?.text)}
          kicker={roundLabel}
          onReady={match.beginTurn}
        />
      ) : null}

      {gameState.phase === 'intro' && gameState.modeId === 'about-us' && bluffer ? (
        <div className={styles.turnPanel}>
          <PlayerAvatar profile={getProfileForName(bluffer.name)} size="lg" />
          <p className={styles.kicker}>{roundLabel}</p>
          <h2 className={styles.pageTitle}>{t('bluff.aboutUsIntro', { name: bluffer.name })}</h2>
          <p>{t('bluff.aboutUsIntroHint', { name: bluffer.name })}</p>
          <Button icon={<Play size={18} />} onClick={match.beginTurn}>{t('game.startTurn')}</Button>
        </div>
      ) : null}

      {gameState.phase === 'intro' && match.passDevice && !bluffer ? (
        <PassDevicePanel
          t={t}
          name={subjectName}
          members={isTeams ? teamMembers(subjectName) : []}
          profile={isTeams ? null : getProfileForName(subjectName)}
          kicker={roundLabel}
          actionLabel={t('game.startTurn')}
          onReady={match.beginTurn}
        />
      ) : null}

      {gameState.phase === 'intro' && !match.passDevice && !bluffer ? (
        <div className={styles.turnPanel}>
          <Mascot mood="thinking" size="lg" />
          <p className={styles.kicker}>{roundLabel}</p>
          <h2 className={styles.pageTitle}>{readyLabel}</h2>
          <p>{t('game.prepareHint')}</p>
          <Button icon={<Play size={18} />} onClick={match.beginTurn}>{t('game.startTurn')}</Button>
        </div>
      ) : null}

      {gameState.phase === 'preparing' ? (
        <div className={styles.turnPanel}>
          <div className={styles.countdown} role="timer" aria-label={t('juice.countdown', { seconds: timerSeconds })}>
            <strong key={timerSeconds} aria-hidden="true">{timerSeconds}</strong>
          </div>
          <h2 className={styles.pageTitle}>{t('game.preparation')}</h2>
          <p>{readyLabel}</p>
          <Button onClick={match.showStatementsNow}>{t('game.revealBoard')}</Button>
        </div>
      ) : null}

      {handingOff && handoffSubject ? (
        <PassDevicePanel
          t={t}
          name={handoffSubject.name}
          profile={getProfileForName(handoffSubject.name)}
          kicker={roundLabel}
          onReady={match.confirmHandoff}
        />
      ) : null}

      {round && onTable && !handingOff ? (
        <>
          <div className={styles.roundToolbar}>
            <span className={styles.categoryTag}>
              <CategoryArt categoryId={round.categoryId} size="sm" />
              {categoryLabel(round.categoryId)}
            </span>
            <p className={styles.prompt}>
              {gameState.phase === 'revealed'
                ? t('game.revealedPrompt')
                : gameState.phase === 'discussing'
                  ? t('moments.prompt')
                  : everyoneGuesses
                    ? t('game.chooseFakeAll', { name: subjectName })
                    : t('game.chooseFake')}
            </p>
            {gameState.phase === 'playing' && visibleCount < round.statements.length ? (
              <button className={styles.inlineTool} type="button" onClick={match.showNextClue}>
                <Eye size={16} /> {t('specials.gradual-clue.revealNext', { visible: visibleCount, total: round.statements.length })}
              </button>
            ) : null}
            {gameState.phase === 'playing' ? (
              <RoundTimer t={t} seconds={timerSeconds} totalSeconds={match.roundTimeSeconds} />
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
            hideSelection={everyoneGuesses}
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

      {gameState.phase === 'revealed' && anyCorrect ? <ConfettiBurst key={`round-${gameState.currentRoundIndex}`} /> : null}
      {celebrate ? <ConfettiBurst key="final" /> : null}

      {finished && solo ? (
        <SoloResultPanel
          t={t}
          mood={getFinalMood({
            solo: true,
            isNewRecord: Boolean(match.soloOutcome?.isNewRecord),
            correct: gameState.correctGuessesInMatch,
            totalRounds: gameState.totalRounds
          })}
          outcome={match.soloOutcome}
          points={soloPlayer?.score ?? 0}
          correct={gameState.correctGuessesInMatch}
          totalRounds={gameState.totalRounds}
          bestStreak={gameState.longestStreakInMatch}
          nextObjective={match.nextObjective}
          categoryLabel={categoryLabel}
          shareStatus={growth.growthStatus}
          onShare={growth.shareResult}
          onPlayAgain={match.rematch}
          onNewChallenge={() => match.openCleanSetup()}
        />
      ) : null}

      {finished && !solo ? (
        <FinalResultPanel
          t={t}
          text={text}
          winnerNames={match.winners.map(player => player.name)}
          podium={podium}
          rest={rest}
          highlights={getMatchHighlights(gameState)}
          avatarFor={avatarFor}
          nextObjective={match.nextObjective}
          categoryLabel={categoryLabel}
          shareStatus={growth.growthStatus}
          onShare={growth.shareResult}
          onRematch={match.rematch}
          onNewSetup={() => match.openCleanSetup()}
          saveAsPack={gameState.modeId === 'about-us' ? saveAsPack : undefined}
        />
      ) : null}
    </div>
  );
}
