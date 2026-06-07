import type { GenerateMotifBarOptions, Motif } from '@generators/motif/motif';
import { generateMotifBar } from '@generators/motif/generate-motif-bar.new';
import { getNearestModeDegreeByFunction } from '@harmony/get-nearest-mode-degree-by-function';
import type { ModeDegreeFunction } from '@harmony/mode-degree-function.type';
import type { Mode } from '@harmony/mode.type';

export type GenerateMotifOptions = GenerateMotifBarOptions;

type Props = GenerateMotifOptions & {
  mode: Mode;
  harmonyFunctions: readonly ModeDegreeFunction[];
};

export const generateMotif = (options: Props): Motif => {
  const { startDegree, mode, harmonyFunctions, ...restOptions } = options;
  const barOptions: GenerateMotifBarOptions = restOptions;
  let nextStartDegree = startDegree ?? 0;

  return harmonyFunctions.map((fn) => {
    const barStartDegree = getNearestModeDegreeByFunction({
      mode,
      degree: nextStartDegree,
      fn,
    });
    const bar = generateMotifBar({ ...barOptions, startDegree: barStartDegree }, 8);
    nextStartDegree = bar.steps[bar.steps.length - 1] ?? barStartDegree;

    return bar;
  });
};
