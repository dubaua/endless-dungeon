import type { BlockFunction } from './block-function.type';

export interface TrackBlock {
  block: BlockFunction;
  bars: number;
}
