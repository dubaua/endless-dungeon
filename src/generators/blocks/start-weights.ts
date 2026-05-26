import type { BlockFunction } from './block-function';

export type BlockStartWeights = Partial<Record<BlockFunction, number>>;

export const startWeights = {
  body: 8,
  tension: 5,
  breakdown: 3,
  pit: 2,
} satisfies BlockStartWeights;
