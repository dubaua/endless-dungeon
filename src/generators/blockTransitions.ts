export type BlockFunction =
  | 'body'
  | 'variation'
  | 'tension'
  | 'drop'
  | 'pit'
  | 'transition'
  | 'break'
  | 'breakdown';

export type BlockTransitionWeights = Record<BlockFunction, number>;
export type BlockTransitionGraph = Record<BlockFunction, BlockTransitionWeights>;

export const blockFunctions: readonly BlockFunction[] = [
  'body',
  'variation',
  'tension',
  'drop',
  'pit',
  'transition',
  'break',
  'breakdown',
];

export const blockTransitionGraph = {
  body: {
    body: 24,
    variation: 26,
    tension: 18,
    drop: 4,
    pit: 0,
    transition: 16,
    break: 7,
    breakdown: 5,
  },
  variation: {
    body: 30,
    variation: 14,
    tension: 20,
    drop: 4,
    pit: 2,
    transition: 16,
    break: 8,
    breakdown: 6,
  },
  tension: {
    body: 14,
    variation: 12,
    tension: 4,
    drop: 35,
    pit: 0,
    transition: 20,
    break: 8,
    breakdown: 7,
  },
  drop: {
    body: 32,
    variation: 22,
    tension: 0,
    drop: 7,
    pit: 5,
    transition: 12,
    break: 14,
    breakdown: 8,
  },
  pit: {
    body: 10,
    variation: 0,
    tension: 28,
    drop: 22,
    pit: 0,
    transition: 18,
    break: 8,
    breakdown: 14,
  },
  transition: {
    body: 30,
    variation: 22,
    tension: 18,
    drop: 12,
    pit: 4,
    transition: 0,
    break: 6,
    breakdown: 8,
  },
  break: {
    body: 30,
    variation: 14,
    tension: 20,
    drop: 6,
    pit: 0,
    transition: 12,
    break: 0,
    breakdown: 18,
  },
  breakdown: {
    body: 18,
    variation: 14,
    tension: 26,
    drop: 22,
    pit: 10,
    transition: 4,
    break: 6,
    breakdown: 0,
  },
} satisfies BlockTransitionGraph;
