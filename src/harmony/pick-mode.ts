import { Modes } from '@/harmony/modes.const';
import type { Mode } from '@harmony/mode.type';
import { pickWeighted } from '@utils/pick-weighted';

/**
 * Picks one registered mode using each mode weight.
 * Centralizes mode selection so generation code does not depend on registry shape.
 */
export const pickMode = (modes: Record<string, Mode> = Modes): Mode => {
  return pickWeighted(
    Object.values(modes).map((mode) => ({
      value: mode,
      weight: mode.weight,
    })),
  );
};
