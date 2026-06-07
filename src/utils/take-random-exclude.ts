import { takeRandom } from '@utils/take-random';

export const takeRandomExclude = <T>(
  items: readonly T[],
  excludedItems: readonly T[],
): T => {
  return takeRandom(items.filter((item) => !excludedItems.includes(item)));
};
