const QuarterPositions = [0, 4, 8, 12];
const EighthPositions = [2, 6, 10, 14];
const EighthGridPositions = [0, 2, 4, 6, 8, 10, 12, 14];
const SixteenthPositions = [1, 3, 5, 7, 9, 11, 13, 15];

const hasBeatAt = (pattern: string, position: number): boolean => pattern[position] !== '-';

const hasAnyBeatAt = (pattern: string, positions: number[]): boolean =>
  positions.some((position) => hasBeatAt(pattern, position));

const countBeatsAt = (pattern: string, positions: number[]): number =>
  positions.filter((position) => hasBeatAt(pattern, position)).length;

const countMissingBeatsAt = (pattern: string, positions: number[]): number =>
  positions.filter((position) => !hasBeatAt(pattern, position)).length;

export const getPatternSyncopationScore = (pattern: string): number => {
  const hasEighthBeats = hasAnyBeatAt(pattern, EighthPositions);
  const hasSixteenthBeats = hasAnyBeatAt(pattern, SixteenthPositions);

  if (!hasEighthBeats && !hasSixteenthBeats) {
    return 0;
  }

  const missingQuarterBeatCount = countMissingBeatsAt(pattern, QuarterPositions);
  const missingEighthGridBeatCount = countMissingBeatsAt(pattern, EighthGridPositions);
  const missingEighthOffbeatCount = countMissingBeatsAt(pattern, EighthPositions);
  const sixteenthBeatCount = countBeatsAt(pattern, SixteenthPositions);

  if (hasSixteenthBeats) {
    return sixteenthBeatCount * 8 + missingQuarterBeatCount * 8 + missingEighthOffbeatCount * 2;
  }

  return missingEighthGridBeatCount;
};
