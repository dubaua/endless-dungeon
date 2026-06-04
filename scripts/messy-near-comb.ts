export default function isBadPattern(pattern: string): boolean {
  const hasStrongStandaloneSnares =
    [0, 2, 6, 10, 12, 14].filter(
      (index) => pattern[index] === 's' && pattern[index - 1] === '-' && pattern[index + 1] === '-',
    ).length >= 3;
  const isComb = /.-.-.-.-.-.-.-.-/.test(pattern);

  return hasStrongStandaloneSnares && !isComb;
}
