import { getRandomInt } from './get-random-int';

export const takeRandom = <T>(items: readonly T[]): T => {
  if (items.length === 0) {
    throw new Error('Cannot take a random item from an empty array');
  }

  return items[getRandomInt(0, items.length - 1)];
};
