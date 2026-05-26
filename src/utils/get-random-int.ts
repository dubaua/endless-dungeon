import type { RandomSource } from './pick-weighted';

export const getRandomInt = (
  min: number,
  max: number,
  random: RandomSource = Math.random,
): number => {
  return Math.floor(random() * (max - min + 1)) + min;
};
