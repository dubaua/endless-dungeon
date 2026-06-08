import type { GenerateMotifBarOptions, MotifContour } from '@generators/motif/motif.type';
import { generateMotif } from '@generators/motif/generate-motif';

export type GenerateMotifOptions = GenerateMotifBarOptions;

type Props = GenerateMotifOptions & {
  bars: number;
};

export const generateBlockMotif = (options: Props): MotifContour => {
  const { bars, startDegree, ...restOptions } = options;
  const barOptions: GenerateMotifBarOptions = restOptions;
  let nextStartDegree = startDegree ?? 0;

  return Array.from({ length: bars }, () => {
    const bar = generateMotif({ ...barOptions, startDegree: nextStartDegree }, 8);
    nextStartDegree = bar.steps[bar.steps.length - 1] ?? nextStartDegree;

    return bar;
  });
};
