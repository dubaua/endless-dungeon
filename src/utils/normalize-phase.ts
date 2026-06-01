import { FullCycle } from './full-cycle.const';

export const normalizePhase = (phase: number): number =>
  ((phase % FullCycle) + FullCycle) % FullCycle;
