import type { Mode } from '@harmony/mode.type';
import { takeRandom } from '@utils/take-random';

/**
 * Picks one local degree inside a mode uniformly.
 * Gives generators a degree-only fallback without depending on notes or intervals.
 */
export const pickModeDegree = (mode: Mode): number => {
  return takeRandom(mode.degrees).degree;
};
