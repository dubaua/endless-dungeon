import type { GenerateMotifBarOptions, MotifContour } from '@generators/motif/motif.type';
import { generateMotif } from '@generators/motif/generate-motif';
import { getRandomInt } from '@utils/get-random-int';

export type GenerateMotifOptions = GenerateMotifBarOptions;

type Props = GenerateMotifOptions & {
  bars: number;
};

const FirstBarIndex = 0;
const ThirdBarIndex = 2;
const FifthBarIndex = 4;
const MinCopiedSteps = 2;

const copyMotifBar = (motif: MotifContour, sourceIndex: number, targetIndex: number): void => {
  const sourceBar = motif[sourceIndex];

  if (!sourceBar || !motif[targetIndex]) {
    return;
  }

  motif[targetIndex] = {
    steps: [...sourceBar.steps],
    stepEvents: sourceBar.stepEvents.map((events) => [...events]),
  };
};

const mutateMotifBarPrefix = (
  motif: MotifContour,
  sourceIndex: number,
  targetIndex: number,
): void => {
  const sourceBar = motif[sourceIndex];
  const targetBar = motif[targetIndex];

  if (!sourceBar || !targetBar) {
    return;
  }

  const copiedSteps = getRandomInt(
    Math.min(MinCopiedSteps, sourceBar.steps.length),
    sourceBar.steps.length,
  );

  motif[targetIndex] = {
    steps: [
      ...sourceBar.steps.slice(0, copiedSteps),
      ...targetBar.steps.slice(copiedSteps),
    ],
    stepEvents: [
      ...sourceBar.stepEvents.slice(0, copiedSteps).map((events) => [...events]),
      ...targetBar.stepEvents.slice(copiedSteps),
    ],
  };
};

export const generateBlockMotif = (options: Props): MotifContour => {
  const { bars, startDegree, ...restOptions } = options;
  const barOptions: GenerateMotifBarOptions = restOptions;
  let nextStartDegree = startDegree ?? 0;

  const motif = Array.from({ length: bars }, () => {
    const bar = generateMotif({ ...barOptions, startDegree: nextStartDegree }, 8);
    nextStartDegree = bar.steps[bar.steps.length - 1] ?? nextStartDegree;

    return bar;
  });

  mutateMotifBarPrefix(motif, FirstBarIndex, ThirdBarIndex);
  copyMotifBar(motif, FirstBarIndex, FifthBarIndex);

  return motif;
};
