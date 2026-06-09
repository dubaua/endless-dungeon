import { Pcset } from 'tonal';

import type { Mode, ModeInterval } from '@harmony/mode.type';
import type { ModeDegreeFunction } from '@harmony/mode-degree-function.type';
import type { ModeHarmonyProfile } from '@harmony/mode-harmony-profile.type';

type ModeDefinition<
  Name extends string,
  Functions extends readonly ModeDegreeFunction[],
  Intervals extends readonly ModeInterval[],
> = {
  name: Name;
  aliases?: string[];
  intervals: Intervals;
  weight: number;
  functions: Functions;
  intervalFunctions: {
    readonly [Interval in Intervals[number]]: readonly Functions[number][];
  };
  harmonyProfile: ModeHarmonyProfile<Functions>;
};

export const defineMode = <
  const Name extends string,
  const Functions extends readonly ModeDegreeFunction[],
  const Intervals extends readonly ModeInterval[],
>({
  name,
  aliases = [],
  intervals,
  weight,
  functions,
  intervalFunctions,
  harmonyProfile,
}: ModeDefinition<Name, Functions, Intervals>): Mode<Name, Functions, Intervals> => {
  const pcset = Pcset.get([...intervals]);

  return {
    ...pcset,
    name,
    aliases,
    intervals,
    weight,
    functions,
    intervalFunctions,
    harmonyProfile,
  };
};
