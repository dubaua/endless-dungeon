import { takeRandom } from '../../utils/take-random';
import { RelativeHatsPatterns } from './relative-hats-patterns';

const takeRelativeHatsPattern = (pattern: string): string => {
  const relativePatterns = RelativeHatsPatterns[pattern] ?? [pattern];

  return takeRandom(relativePatterns);
};

export const generateEightBarHatsPattern = (bodyHatsPattern: string): string => {
  const bar2 = takeRelativeHatsPattern(bodyHatsPattern);
  const bar3 = takeRelativeHatsPattern(bodyHatsPattern);
  const bar4 = takeRelativeHatsPattern(bodyHatsPattern);
  const bar6 = takeRelativeHatsPattern(bodyHatsPattern);
  const bar8 = takeRelativeHatsPattern(bodyHatsPattern);

  return [bodyHatsPattern, bar2, bar3, bar4, bodyHatsPattern, bar6, bar3, bar8].join('');
};
