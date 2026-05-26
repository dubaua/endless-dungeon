import type { BlockFunction } from './block-function';

export type BlockLength = '1' | '2' | '3' | '4' | '8' | '16';
export type BlockLengthWeights = Partial<Record<BlockLength, number>>;
export type BlockLengthsGraph = Record<BlockFunction, BlockLengthWeights>;

export const lengthsGraph = {
  body: {
    '4': 5,
    '8': 1,
  },
  variation: {
    '4': 5,
    '8': 1,
  },
  tension: {
    '4': 5,
    '8': 1,
  },
  drop: {
    '4': 5,
    '8': 1,
  },
  pit: {
    '4': 5,
    '8': 1,
  },
  break: {
    '1': 5,
    '2': 1,
  },
  breakdown: {
    '4': 5,
    '8': 1,
  },
} satisfies BlockLengthsGraph;
