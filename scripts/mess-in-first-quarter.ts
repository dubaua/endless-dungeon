export default function isBadPattern(pattern: string): boolean {
  const first = Array.from(pattern.slice(0, 4)).filter((char) => char !== '-').length;
  const second = Array.from(pattern.slice(4, 8)).filter((char) => char !== '-').length;
  const third = Array.from(pattern.slice(8, 12)).filter((char) => char !== '-').length;
  const last = Array.from(pattern.slice(12, 16)).filter((char) => char !== '-').length;

  const offbeatCount = Array.from(pattern).filter((i) => i === 'o' || i === 'O' || i === 'x').length;
  const kickCount = Array.from(pattern).filter((i) => i === 'k' || i === 'x').length;

  const hasMoreBeatsInEdgeQuarter = [second, third, last].every((i) => first > i);

  const hasMoreOffbeatsTotal = offbeatCount > kickCount;

  const hasOffbeatsInFirst = Array.from(pattern.slice(0, 4)).some((i) => i === 'o' || i === 'O' || i === 'x');

  return hasMoreBeatsInEdgeQuarter && hasMoreOffbeatsTotal && hasOffbeatsInFirst;
}
