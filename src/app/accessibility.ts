export function getStatementShortcutIndex(key: string, statementCount: number): number | null {
  if (!Number.isInteger(statementCount) || statementCount < 1) return null;
  const numeric = Number(key);
  if (!Number.isInteger(numeric) || numeric < 1 || numeric > statementCount) return null;
  return numeric - 1;
}

export function getNextStatementFocusIndex(
  currentIndex: number,
  direction: 'next' | 'previous',
  statementCount: number
): number {
  if (!Number.isInteger(statementCount) || statementCount < 1) return 0;
  if (!Number.isInteger(currentIndex) || currentIndex < 0 || currentIndex >= statementCount) return 0;
  const delta = direction === 'next' ? 1 : -1;
  return (currentIndex + delta + statementCount) % statementCount;
}
