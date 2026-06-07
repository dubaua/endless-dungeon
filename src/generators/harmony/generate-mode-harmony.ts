import type { HarmonyBlockFunction } from '@generators/harmony/harmony-block-function.type';
import { generateHarmonyContour } from '@generators/harmony/generate-harmony-contour';
import { generateHarmonyLoop } from '@generators/harmony/generate-harmony-loop';
import { Modes, type KnownModeName } from '@harmony/modes.const';
import type { ModeDegreeFunction } from '@harmony/mode-degree-function.type';

type Props = {
  bars: number;
  mode: KnownModeName;
  block: HarmonyBlockFunction;
};

export const generateModeHarmony = ({
  bars,
  mode,
  block,
}: Props): ModeDegreeFunction[] => {
  const profile = Modes[mode].harmonyProfile[block];

  if (profile.generator === 'contour') {
    return generateHarmonyContour({
      bars,
      functions: profile.functions,
      start: profile.start,
      end: profile.end,
      midCadence: 'midCadence' in profile ? profile.midCadence : undefined,
    });
  }

  return generateHarmonyLoop({
    bars,
    blocks: profile.blocks,
    variations: profile.variations,
  });
};
