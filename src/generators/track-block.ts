import type { BlockFunction } from './blocks/block-function';

export interface TrackBlock {
  block: BlockFunction;
  bars: number;
}
