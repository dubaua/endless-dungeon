import { clamp } from './clamp';
import { RandomSource } from './pick-weighted';
import { scale } from './scale';

export const rollBiasChance = (
  bias: number,
  minChance: number,
  maxChance: number,
  random: RandomSource,
): boolean => {
  const chance = scale(clamp(bias, 0, 1), 0, 1, minChance, maxChance);

  return random() < chance;
};
