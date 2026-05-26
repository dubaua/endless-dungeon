import type { WeightedOptions } from '../../utils/pick-weighted';
import type { BlockFunction } from './block-function';

export type BlockLengthWeights = WeightedOptions<number>;
export type BlockLengthsGraph = Record<BlockFunction, BlockLengthWeights>;

export const lengthsGraph = {
  body: [
    { value: 4, weight: 5 },
    { value: 8, weight: 1 },
  ],
  variation: [
    { value: 4, weight: 5 },
    { value: 8, weight: 1 },
  ],
  tension: [
    { value: 4, weight: 5 },
    { value: 8, weight: 1 },
  ],
  drop: [
    { value: 4, weight: 5 },
    { value: 8, weight: 1 },
  ],
  pit: [
    { value: 4, weight: 5 },
    { value: 8, weight: 1 },
  ],
  break: [
    { value: 1, weight: 5 },
    { value: 2, weight: 1 },
  ],
  breakdown: [
    { value: 4, weight: 5 },
    { value: 8, weight: 1 },
  ],
} satisfies BlockLengthsGraph;
