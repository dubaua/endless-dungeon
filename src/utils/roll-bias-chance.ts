import { clamp } from './clamp';
import { scale } from './scale';

export const rollBiasChance = (
  bias: number,
  minChance: number,
  maxChance: number,
): boolean => {
  const chance = scale(clamp(bias, 0, 1), 0, 1, minChance, maxChance);

  return Math.random() < chance;
};
