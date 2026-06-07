import type { Mode } from '@harmony/mode.type';
import { Modes, type KnownModeName } from '@harmony/modes.const';
import { pickWeighted } from '@utils/pick-weighted';

/**
 * Picks one registered mode using each mode weight.
 * Centralizes mode selection so generation code does not depend on registry shape.
 */
export const pickMode = (): Mode<KnownModeName> => {
  return pickWeighted(
    Object.values(Modes).map((mode) => ({
      value: mode,
      weight: mode.weight,
    })),
  );
};
