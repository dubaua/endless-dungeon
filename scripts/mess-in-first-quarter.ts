export default function isBadPattern(pattern: string): boolean {
  const first = Array.from(pattern.slice(0, 4)).filter((char) => char !== '-').length;
  const second = Array.from(pattern.slice(4, 8)).filter((char) => char !== '-').length;
  const third = Array.from(pattern.slice(8, 12)).filter((char) => char !== '-').length;
  const last = Array.from(pattern.slice(12, 16)).filter((char) => char !== '-').length;

  const snareCount = Array.from(pattern).filter((i) => i === 's').length;
  const kickCount = Array.from(pattern).filter((i) => i === 'k').length;

  const hasMoreBeatsInEdgeQuarter = [second, third, last].every((i) => first > i);

  const hasMoreSnaresTotal = snareCount > kickCount;

  const hasSnaresInFirst = Array.from(pattern.slice(0, 4)).some((i) => i === 's');

  return hasMoreBeatsInEdgeQuarter && hasMoreSnaresTotal && hasSnaresInFirst;
}
