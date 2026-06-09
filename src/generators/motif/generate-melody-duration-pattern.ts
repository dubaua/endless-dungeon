import type { MelodyDurationPattern } from '@generators/motif/melody-duration-pattern.type';
import { pickWeighted } from '@utils/pick-weighted';

type Props = {
  noteGapBias: number;
  noteLengthVariationBias: number;
};

const BarSteps = 16;
const MinDurationSteps = 2;
const MaxRestSteps = 4;
// value is measured in 1/16 steps
const DurationWeights = [
  // 2 = 2/16 = 1/8
  { value: 2, weight: 6 },
  // 4 = 1/4
  { value: 4, weight: 3 },
  // 8 = 1/2
  { value: 8, weight: 1 },
] as const;

const getAvailableDurationSteps = (remainingSteps: number): number[] => {
  return DurationWeights.map(({ value }) => value).filter((steps) => {
    const nextRemainingSteps = remainingSteps - steps;

    return (
      steps <= remainingSteps &&
      (nextRemainingSteps === 0 || nextRemainingSteps >= MinDurationSteps)
    );
  });
};

const takeDurationSteps = (remainingSteps: number, noteLengthVariationBias: number): number => {
  return pickWeighted(
    getAvailableDurationSteps(remainingSteps).map((steps) => ({
      value: steps,
      weight:
        (DurationWeights.find((duration) => duration.value === steps)?.weight ?? 1) *
        (steps === MinDurationSteps ? 1 : noteLengthVariationBias),
    })),
  );
};

export const generateMelodyDurationPattern = ({
  noteGapBias,
  noteLengthVariationBias,
}: Props): MelodyDurationPattern => {
  const pattern: MelodyDurationPattern = [];
  let remainingSteps = BarSteps;
  let hasNote = false;
  let restSteps = 0;

  while (remainingSteps > 0) {
    const steps = takeDurationSteps(remainingSteps, noteLengthVariationBias);
    const isLastStep = remainingSteps - steps === 0;
    const restChance = noteGapBias * 0.25;
    const isRest: boolean =
      hasNote && !isLastStep && restSteps + steps <= MaxRestSteps && Math.random() < restChance;

    pattern.push({ isRest, steps });
    remainingSteps -= steps;
    restSteps += isRest ? steps : 0;
    hasNote = hasNote || !isRest;
  }

  return pattern;
};
