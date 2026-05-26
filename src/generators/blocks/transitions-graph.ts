import type { WeightedOptions } from '../../utils/pick-weighted';
import type { BlockFunction } from './block-function';

export type BlockTransitionWeights = WeightedOptions<BlockFunction>;
export type BlockTransitionGraph = Record<BlockFunction, BlockTransitionWeights>;

export const transitionsGraph = {
  body: [
    { value: 'body', weight: 0 },
    { value: 'variation', weight: 8 },
    { value: 'tension', weight: 5 },
    { value: 'drop', weight: 3 },
    { value: 'pit', weight: 1 },
    { value: 'break', weight: 2 },
    { value: 'breakdown', weight: 1 },
  ],
  variation: [
    { value: 'body', weight: 0 },
    { value: 'variation', weight: 0 },
    { value: 'tension', weight: 3 },
    { value: 'drop', weight: 8 },
    { value: 'pit', weight: 2 },
    { value: 'break', weight: 5 },
    { value: 'breakdown', weight: 1 },
  ],
  tension: [
    { value: 'body', weight: 3 },
    { value: 'variation', weight: 3 },
    { value: 'tension', weight: 0 },
    { value: 'drop', weight: 6 },
    { value: 'pit', weight: 1 },
    { value: 'break', weight: 1 },
    { value: 'breakdown', weight: 2 },
  ],
  drop: [
    { value: 'body', weight: 4 },
    { value: 'variation', weight: 3 },
    { value: 'tension', weight: 3 },
    { value: 'drop', weight: 0 },
    { value: 'pit', weight: 6 },
    { value: 'break', weight: 4 },
    { value: 'breakdown', weight: 2 },
  ],
  pit: [
    { value: 'body', weight: 5 },
    { value: 'variation', weight: 1 },
    { value: 'tension', weight: 5 },
    { value: 'drop', weight: 5 },
    { value: 'pit', weight: 0 },
    { value: 'break', weight: 1 },
    { value: 'breakdown', weight: 3 },
  ],
  break: [
    { value: 'body', weight: 8 },
    { value: 'variation', weight: 2 },
    { value: 'tension', weight: 3 },
    { value: 'drop', weight: 5 },
    { value: 'pit', weight: 1 },
    { value: 'break', weight: 0 },
    { value: 'breakdown', weight: 3 },
  ],
  breakdown: [
    { value: 'body', weight: 4 },
    { value: 'variation', weight: 3 },
    { value: 'tension', weight: 3 },
    { value: 'drop', weight: 4 },
    { value: 'pit', weight: 3 },
    { value: 'break', weight: 1 },
    { value: 'breakdown', weight: 0 },
  ],
} satisfies BlockTransitionGraph;
