import type { IntervalName } from '@tonaljs/pitch-interval';
import type { ScaleType } from '@tonaljs/scale-type';

import type { ModeDegreeFunction } from '@harmony/mode-degree-function.type';
import type { ModeHarmonyProfile } from '@harmony/mode-harmony-profile.type';

export type ModeName = string;
export type ModeInterval = IntervalName;

export interface ModeIntervalFunctions<Function extends ModeDegreeFunction = ModeDegreeFunction> {
  interval: ModeInterval;
  functions: readonly Function[];
}

export interface Mode<
  Name extends ModeName = ModeName,
  Functions extends readonly ModeDegreeFunction[] = readonly ModeDegreeFunction[],
  Intervals extends readonly ModeInterval[] = readonly ModeInterval[],
> extends Omit<ScaleType, 'name' | 'intervals'> {
  name: Name;
  intervals: Intervals;
  weight: number;
  functions: Functions;
  intervalFunctions: {
    readonly [Interval in Intervals[number]]: readonly Functions[number][];
  };
  harmonyProfile: ModeHarmonyProfile<Functions>;
}
