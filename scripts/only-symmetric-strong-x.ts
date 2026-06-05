export default function isBadPattern(pattern: string): boolean {
  const xPositions = Array.from(pattern)
    .map((char, index) => (char === 'x' ? index : -1))
    .filter((index) => index !== -1);

  if (xPositions.length === 0) {
    return false;
  }

  return xPositions.length !== 2 || !xPositions.includes(4) || !xPositions.includes(12);
}
