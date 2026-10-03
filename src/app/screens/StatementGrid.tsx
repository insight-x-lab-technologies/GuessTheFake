import { CheckCircle2 } from 'lucide-react';
import type { CSSProperties, KeyboardEvent, MutableRefObject } from 'react';
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
  visibleCount = round.statements.length,
  changing = false,
  hideSelection = false,
  onChoose
}: {
  t: Translate;
  text: LocalizeText;
  round: GuessTheFakeRound;
  gameState: GuessTheFakeState;
  buttonRefs: MutableRefObject<Array<HTMLButtonElement | null>>;
  // `gradual-clue`: statements past this index stay face down.
  visibleCount?: number;
  // Table moment `change-mind`: a statement click replaces a guess.
  changing?: boolean;
  // `all-guess`: the previous player's pick must not show to the next one.
  hideSelection?: boolean;
  onChoose: (statementId: string) => void;
}) {
  const revealed = gameState.phase === 'revealed';
  const discussing = gameState.phase === 'discussing';
  const interactive = gameState.phase === 'playing' || (discussing && changing);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!interactive) return;
    const shortcutIndex = getStatementShortcutIndex(event.key, Math.min(visibleCount, round.statements.length));
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
        if (index >= visibleCount) {
          return (
            <button
              key={statement.id}
              ref={element => {
                buttonRefs.current[index] = element;
              }}
              aria-disabled="true"
              aria-label={t('specials.gradual-clue.hiddenLabel', { number: index + 1 })}
              className={`${styles.statementCard} ${styles.statementHidden}`}
              type="button"
            >
              <span>{index + 1}</span>
              <strong>?</strong>
            </button>
          );
        }
        const guessesForStatement = Object.values(gameState.roundGuesses).filter(
          guess => guess.selectedStatementId === statement.id
        );
        const pickedNames = guessesForStatement
          .map(guess => guess.teamName ?? guess.playerName)
          .filter(Boolean)
          .join(', ');
        const isSelected = !hideSelection && gameState.selectedStatementId === statement.id;
        const isPicked = guessesForStatement.length > 0;
        const isFake = round.fakeStatementId === statement.id;
        const stateClass = revealed && isFake
          ? styles.statementFake
          : revealed && isPicked
            ? styles.statementWrong
            : revealed
              ? styles.statementTrue
              : '';
        return (
          <button
            key={statement.id}
            ref={element => {
              buttonRefs.current[index] = element;
            }}
            aria-describedby="statement-keyboard-hint"
            aria-disabled={!interactive}
            aria-keyshortcuts={`${index + 1}`}
            aria-label={`${t('game.statementOptionLabel', { number: index + 1 })}: ${text(statement.text).replace(/\d+/g, '').trim()}`}
            aria-pressed={gameState.phase === 'playing' ? isSelected : undefined}
            className={`${styles.statementCard} ${stateClass} ${discussing && isPicked ? styles.statementPicked : ''}`}
            style={revealed ? { '--cascade-index': index } as CSSProperties : undefined}
            onClick={() => {
              if (interactive) onChoose(statement.id);
            }}
            type="button"
          >
            <span>{index + 1}</span>
            <strong>{text(statement.text)}</strong>
            {revealed && isFake ? (
              <svg className={styles.fakeStamp} viewBox="0 0 168 64" aria-hidden="true">
                <rect x="5" y="5" width="158" height="54" rx="9" />
                <text x="84" y="44">{t('juice.stamp')}</text>
              </svg>
            ) : null}
            {revealed && !isFake ? <CheckCircle2 className={styles.trueMark} size={20} aria-hidden="true" /> : null}
            {revealed && isFake ? <em>{t('game.fakeLabel')}</em> : null}
            {revealed && isSelected && !pickedNames ? <em>{t('game.selectedLabel')}</em> : null}
            {(revealed || discussing) && pickedNames ? <em>{t('game.pickedByLabel', { names: pickedNames })}</em> : null}
          </button>
        );
      })}
    </div>
  );
}
