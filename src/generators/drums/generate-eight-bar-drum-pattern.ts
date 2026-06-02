import { RelativePatterns } from './relative-patterns';
import { takeRandom } from '../../utils/take-random';
import type { RandomSource } from '../../utils/pick-weighted';

const takeRelativeDrumPattern = (pattern: string, random: RandomSource): string => {
  const relativePatterns = RelativePatterns[pattern] ?? [pattern];

  return takeRandom(relativePatterns, random);
};

export const generateEightBarDrumPattern = (
  bodyDrumPattern: string,
  random: RandomSource = Math.random,
): string => {
  const bar2 = takeRelativeDrumPattern(bodyDrumPattern, random);
  const bar3 = takeRelativeDrumPattern(bodyDrumPattern, random);
  const bar4 = takeRelativeDrumPattern(bodyDrumPattern, random);
  const bar6 = takeRelativeDrumPattern(bodyDrumPattern, random);
  const bar8 = takeRelativeDrumPattern(bodyDrumPattern, random);

  return [bodyDrumPattern, bar2, bar3, bar4, bodyDrumPattern, bar6, bar3, bar8].join('');
};
