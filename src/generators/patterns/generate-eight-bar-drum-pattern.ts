import { RelativeKickOffbeatPatterns } from '@generators/patterns/relative-kick-offbeat-patterns';
import { takeRandom } from '@utils/take-random';

const takeRelativeDrumPattern = (pattern: string): string => {
  const relativePatterns = RelativeKickOffbeatPatterns[pattern];

  if (!relativePatterns) {
    return pattern;
  }

  if (relativePatterns.length === 0) {
    return pattern;
  }

  return takeRandom(relativePatterns);
};

export const generateEightBarDrumPattern = (bodyDrumPattern: string): string => {
  const bar2 = takeRelativeDrumPattern(bodyDrumPattern);
  const bar3 = takeRelativeDrumPattern(bodyDrumPattern);
  const bar4 = takeRelativeDrumPattern(bodyDrumPattern);
  const bar6 = takeRelativeDrumPattern(bodyDrumPattern);
  const bar8 = takeRelativeDrumPattern(bodyDrumPattern);

  return [bodyDrumPattern, bar2, bar3, bar4, bodyDrumPattern, bar6, bar3, bar8].join('');
};
