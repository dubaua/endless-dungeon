import type { HarmonyBlockFunction } from '@generators/harmony/harmony-block-function.type';
import type { ModeDegreeFunction } from '@harmony/mode-degree-function.type';

type ModeHarmonyFunction<Functions extends readonly ModeDegreeFunction[]> = Functions[number];

type ModeHarmonyContourProfile<Functions extends readonly ModeDegreeFunction[]> = {
  generator: 'contour';
  functions: readonly ModeHarmonyFunction<Functions>[];
  start?: ModeHarmonyFunction<Functions>;
  end?: ModeHarmonyFunction<Functions>;
  midCadence?: ModeHarmonyFunction<Functions>;
};

type ModeHarmonyLoopProfile<Functions extends readonly ModeDegreeFunction[]> = {
  generator: 'loop';
  blocks: readonly ModeHarmonyFunction<Functions>[];
  variations: readonly ModeHarmonyFunction<Functions>[];
};

export type ModeHarmonyProfile<Functions extends readonly ModeDegreeFunction[]> = Record<
  HarmonyBlockFunction,
  ModeHarmonyContourProfile<Functions> | ModeHarmonyLoopProfile<Functions>
>;
