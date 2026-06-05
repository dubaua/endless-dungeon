export default function isBadPattern(pattern: string): boolean {
  const offbeatCount = Array.from(pattern).filter((i) => i === 'o' || i === 'O' || i === 'x').length;
  const kickCount = Array.from(pattern).filter((i) => i === 'k' || i === 'x').length;
  const hasOffbeatsOnThreeStrong = [4, 8, 12].every((p) => {
    const step = pattern.charAt(p);

    return step === 'o' || step === 'O' || step === 'x';
  });
  const hasMoreOffbeatsTotal = offbeatCount > kickCount;
  const hasStandaloneOffbeats = /-[oO]-/.test(pattern);
  return hasOffbeatsOnThreeStrong && hasMoreOffbeatsTotal && hasStandaloneOffbeats;
}
