import { takeRandom } from './take-random';

export const takeRandomItems = <T>(items: readonly T[], count: number): T[] => {
  if (items.length === 0) {
    throw new Error('Cannot take random items from an empty array');
  }

  if (count <= 0) {
    return [];
  }

  const pool = [...items];
  const result: T[] = [];

  while (result.length < count) {
    if (pool.length === 0) {
      result.push(takeRandom(items));
      continue;
    }

    const item = takeRandom(pool);
    const index = pool.indexOf(item);

    result.push(item);
    pool.splice(index, 1);
  }

  return result;
};
