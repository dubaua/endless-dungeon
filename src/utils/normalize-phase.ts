import { FullCycle } from '@utils/full-cycle.const';

export const normalizePhase = (phase: number): number =>
  ((phase % FullCycle) + FullCycle) % FullCycle;
