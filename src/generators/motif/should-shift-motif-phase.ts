import type { RandomSource } from '../../utils/pick-weighted';
import { rollBiasChance } from '../../utils/roll-bias-chance';

const MelodyPhaseShiftMinChance = 0.0;
const MelodyPhaseShiftMaxChance = 0.33;

export const MinMotifShiftSteps = 3;
export const MaxMotifShiftSteps = 7;

export const shouldShiftMotifPhase = (
  melodyBreakPhaseShiftBias: number,
  random: RandomSource,
): boolean => {
  return rollBiasChance(
    melodyBreakPhaseShiftBias,
    MelodyPhaseShiftMinChance,
    MelodyPhaseShiftMaxChance,
    random,
  );
};
