export default function isBadPattern(pattern: string): boolean {
  const snareCount = Array.from(pattern).filter((i) => i === 's').length;
  const kickCount = Array.from(pattern).filter((i) => i === 'k').length;
  const hasSnaresOnThreeStrong = [4, 8, 12].every((p) => pattern.charAt(p) === 's');
  const hasMoreSnaresTotal = snareCount > kickCount;
  const hasStandaloneSnares = /-s-/.test(pattern);
  return hasSnaresOnThreeStrong && hasMoreSnaresTotal && hasStandaloneSnares;
}
