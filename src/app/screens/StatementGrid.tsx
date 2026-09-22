import type { KeyboardEvent, MutableRefObject } from 'react';
import type { GuessTheFakeRound, GuessTheFakeState } from '../../game/types';
import { getNextStatementFocusIndex, getStatementShortcutIndex } from '../accessibility';
import type { LocalizeText, Translate } from '../app-types';
import styles from '../App.module.css';

export function StatementGrid({
  t,
  text,
  round,
  gameState,
  buttonRefs,
  onChoose
}: {
  t: Translate;
  text: LocalizeText;
  round: GuessTheFakeRound;
  gameState: GuessTheFakeState;
  buttonRefs: MutableRefObject<Array<HTMLButtonElement | null>>;
  onChoose: (statementId: string) => void;
}) {
  const revealed = gameState.phase === 'revealed';

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (gameState.phase !== 'playing') return;
    const shortcutIndex = getStatementShortcutIndex(event.key, round.statements.length);
    if (shortcutIndex !== null) {
      event.preventDefault();
      onChoose(round.statements[shortcutIndex].id);
      return;
    }

    const direction = event.key === 'ArrowRight' || event.key === 'ArrowDown'
      ? 'next'
      : event.key === 'ArrowLeft' || event.key === 'ArrowUp'
        ? 'previous'
        : null;
    if (!direction) return;

    const currentIndex = buttonRefs.current.findIndex(button => button === document.activeElement);
    const nextIndex = getNextStatementFocusIndex(currentIndex, direction, round.statements.length);
    event.preventDefault();
    buttonRefs.current[nextIndex]?.focus();
  }

  return (
    <div className={styles.statementGrid} onKeyDown={handleKeyDown}>
      <p id="statement-keyboard-hint" className={styles.visuallyHidden}>
        {t('game.statementKeyboardHint')}
      </p>
      {round.statements.map((statement, index) => {
        const guessesForStatement = Object.values(gameState.roundGuesses).filter(
          guess => guess.selectedStatementId === statement.id
        );
        const pickedNames = guessesForStatement
          .map(guess => guess.teamName ?? guess.playerName)
          .filter(Boolean)
          .join(', ');
        const isSelected = gameState.selectedStatementId === statement.id;
        const isPicked = guessesForStatement.length > 0;
        const isFake = round.fakeStatementId === statement.id;
        const stateClass = revealed && isFake
          ? styles.statementFake
          : revealed && isPicked
            ? styles.statementWrong
            : '';
        return (
          <button
            key={statement.id}
            ref={element => {
              buttonRefs.current[index] = element;
            }}
            aria-describedby="statement-keyboard-hint"
            aria-disabled={revealed}
            aria-keyshortcuts={`${index + 1}`}
            aria-label={`${t('game.statementOptionLabel', { number: index + 1 })}: ${text(statement.text).replace(/\d+/g, '').trim()}`}
            aria-pressed={gameState.phase === 'playing' ? isSelected : undefined}
            className={`${styles.statementCard} ${stateClass}`}
            onClick={() => onChoose(statement.id)}
            type="button"
          >
            <span>{index + 1}</span>
            <strong>{text(statement.text)}</strong>
            {revealed && isFake ? <em>{t('game.fakeLabel')}</em> : null}
            {revealed && isSelected && !pickedNames ? <em>{t('game.selectedLabel')}</em> : null}
            {revealed && pickedNames ? <em>{t('game.pickedByLabel', { names: pickedNames })}</em> : null}
          </button>
        );
      })}
    </div>
  );
}
