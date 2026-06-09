import type { ModeDegreeFunction } from '@harmony/mode-degree-function.type';
import type { ModeHarmonyProfile } from '@harmony/mode-harmony-profile.type';

export type ModeName = string;

export interface ModeDegree<Function extends ModeDegreeFunction = ModeDegreeFunction> {
  degree: number;
  interval: number;
  functions: readonly Function[];
}

export interface Mode<
  Name extends ModeName = ModeName,
  Functions extends readonly ModeDegreeFunction[] = readonly ModeDegreeFunction[],
> {
  name: Name;
  weight: number;
  functions: Functions;
  degrees: readonly ModeDegree<Functions[number]>[];
  harmonyProfile: ModeHarmonyProfile<Functions>;
}
