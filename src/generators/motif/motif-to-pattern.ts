import type { TrackDna } from '@generators/dna/track-dna';
import type { PatternStep } from '@sequencer';
import type { Motif } from '@generators/motif/motif.type';
import { generateMelodyDurationPattern } from '@generators/motif/generate-melody-duration-pattern';
import type { MelodyDurationPattern } from '@generators/motif/melody-duration-pattern.type';
import { getMode } from '@harmony/get-mode';
import { getModeDegreeNote } from '@harmony/get-mode-degree-note';

const SecondBarIndex = 1;
const ThirdBarIndex = 2;
const SixthBarIndex = 5;
const SeventhBarIndex = 6;

const copyDurationPattern = (
  durationPatterns: MelodyDurationPattern[],
  sourceIndex: number,
  targetIndex: number,
): void => {
  const sourcePattern = durationPatterns[sourceIndex];

  if (!sourcePattern || !durationPatterns[targetIndex]) {
    return;
  }

  durationPatterns[targetIndex] = sourcePattern.map((step) => ({ ...step }));
};

export const motifToPattern = (motif: Motif, trackDna: TrackDna): PatternStep[] => {
  const mode = getMode(trackDna.modeName);
  const durationPatterns = motif.map(() =>
    generateMelodyDurationPattern({
      noteGapBias: trackDna.noteGapBias,
      noteLengthVariationBias: trackDna.noteLengthVariationBias,
    }),
  );

  copyDurationPattern(durationPatterns, SecondBarIndex, SixthBarIndex);
  copyDurationPattern(durationPatterns, ThirdBarIndex, SeventhBarIndex);

  return motif.flatMap((bar, barIndex) => {
    const durationPattern = durationPatterns[barIndex] ?? [];
    let degreeIndex = 0;

    return durationPattern.map(({ isRest, steps }) => {
      if (isRest) {
        return [null, steps];
      }

      const degree = bar.steps[degreeIndex] ?? bar.steps[bar.steps.length - 1] ?? 0;
      degreeIndex += 1;

      return [getModeDegreeNote(trackDna.rootNote, mode, degree), steps];
    });
  });
};
