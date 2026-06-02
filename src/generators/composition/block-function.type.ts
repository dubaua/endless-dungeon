export const blockFunctions = [
  'body',
  'variation',
  'tension',
  'drop',
  'pit',
  'break',
  'breakdown',
] as const;

export type BlockFunction = (typeof blockFunctions)[number];
