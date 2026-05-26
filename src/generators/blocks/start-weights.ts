import type { WeightedOptions } from '../../utils/pick-weighted';
import type { BlockFunction } from './block-function';

export type BlockStartWeights = WeightedOptions<BlockFunction>;

export const startWeights = [
  { value: 'body', weight: 8 },
  { value: 'tension', weight: 5 },
  { value: 'breakdown', weight: 3 },
  { value: 'pit', weight: 2 },
] satisfies BlockStartWeights;
