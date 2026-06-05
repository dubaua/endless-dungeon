import type { WeightedOptions } from '@utils/pick-weighted';
import type { BlockFunction } from '@generators/composition/block-function.type';

export const startWeights = [
  { value: 'body', weight: 8 },
  { value: 'tension', weight: 5 },
  { value: 'breakdown', weight: 3 },
  { value: 'pit', weight: 2 },
] satisfies WeightedOptions<BlockFunction>;
