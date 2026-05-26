import type { BlockFunction } from './block-function';

export type BlockTransitionWeights = Record<BlockFunction, number>;
export type BlockTransitionGraph = Record<BlockFunction, BlockTransitionWeights>;

export const transitionsGraph = {
  body: {
    body: 0,
    variation: 8,
    tension: 5,
    drop: 3,
    pit: 1,
    break: 2,
    breakdown: 1,
  },
  variation: {
    body: 0,
    variation: 0,
    tension: 3,
    drop: 8,
    pit: 2,
    break: 5,
    breakdown: 1,
  },
  tension: {
    body: 3,
    variation: 2,
    tension: 0,
    drop: 6,
    pit: 3,
    break: 2,
    breakdown: 2,
  },
  drop: {
    body: 4,
    variation: 3,
    tension: 3,
    drop: 0,
    pit: 6,
    break: 4,
    breakdown: 2,
  },
  pit: {
    body: 5,
    variation: 1,
    tension: 5,
    drop: 5,
    pit: 0,
    break: 2,
    breakdown: 3,
  },
  break: {
    body: 8,
    variation: 2,
    tension: 3,
    drop: 5,
    pit: 1,
    break: 0,
    breakdown: 3,
  },
  breakdown: {
    body: 4,
    variation: 3,
    tension: 3,
    drop: 4,
    pit: 3,
    break: 1,
    breakdown: 0,
  },
} satisfies BlockTransitionGraph;
