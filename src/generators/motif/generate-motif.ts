import type { GenerateMotifBarOptions, Motif, MotifCadences } from './motif';
import { generateMotifBar } from './generate-motif-bar.new';

export type GenerateMotifOptions = GenerateMotifBarOptions & MotifCadences;

/** Собирает 8 тактов; 4 и 8 такты разворачиваются к каденциям. */
export const generateMotif = (options: GenerateMotifOptions): Motif => {
  const { startDegree, ...restOptions } = options;
  const barOptions: GenerateMotifBarOptions = restOptions;

  const bar1 = generateMotifBar({ ...barOptions, startDegree }, 8);
  const bar2 = generateMotifBar(barOptions, 8);
  const bar3 = generateMotifBar(barOptions, 8);
  const bar4Reverse = generateMotifBar(
    {
      ...barOptions,
      startDegree: options.midCadence,
    },
    8,
  );
  const bar4 = {
    steps: [...bar4Reverse.steps].reverse(),
    stepEvents: [...bar4Reverse.stepEvents].reverse(),
  };
  const bar5 = generateMotifBar(barOptions, 8);
  const bar6 = generateMotifBar(barOptions, 8);
  const bar7 = generateMotifBar(barOptions, 8);
  const bar8Reverse = generateMotifBar(
    {
      ...barOptions,
      startDegree: options.finalCadence,
    },
    8,
  );
  const bar8 = {
    steps: [...bar8Reverse.steps].reverse(),
    stepEvents: [...bar8Reverse.stepEvents].reverse(),
  };

  return [bar1, bar2, bar3, bar4, bar5, bar6, bar7, bar8];
};
