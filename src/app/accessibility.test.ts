import { describe, expect, it } from 'vitest';
import { getNextStatementFocusIndex, getStatementShortcutIndex } from './accessibility';

describe('statement keyboard helpers', () => {
  it('maps numeric shortcuts to statement indexes', () => {
    expect(getStatementShortcutIndex('1', 5)).toBe(0);
    expect(getStatementShortcutIndex('5', 5)).toBe(4);
  });

  it('rejects shortcuts outside the statement range', () => {
    expect(getStatementShortcutIndex('0', 5)).toBeNull();
    expect(getStatementShortcutIndex('6', 5)).toBeNull();
    expect(getStatementShortcutIndex('ArrowRight', 5)).toBeNull();
    expect(getStatementShortcutIndex('1', 0)).toBeNull();
  });

  it('wraps arrow focus through the statement list', () => {
    expect(getNextStatementFocusIndex(0, 'previous', 5)).toBe(4);
    expect(getNextStatementFocusIndex(4, 'next', 5)).toBe(0);
    expect(getNextStatementFocusIndex(2, 'next', 5)).toBe(3);
  });
});
