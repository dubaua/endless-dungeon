import type { RandomSource } from './pick-weighted';

export const getRandomFloat = (
  min: number,
  max: number,
  random: RandomSource = Math.random,
): number => {
  return random() * (max - min) + min;
};
