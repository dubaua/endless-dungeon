import { rollBiasChance } from '@utils/roll-bias-chance';
import { scale } from '@utils/scale';

const MelodyPhaseResetMinChance = 0.0;
const MelodyPhaseResetMaxChance = 0.33;
const MelodyPhaseResetMinSpeedFactor = 0.8;
const MelodyPhaseResetMaxSpeedFactor = 1.15;

export const shouldResetMotifPhase = (
  melodyBreakPhaseResetBias: number,
  melodySpeedBias: number,
): boolean => {
  const speedFactor = scale(
    melodySpeedBias,
    0,
    1,
    MelodyPhaseResetMinSpeedFactor,
    MelodyPhaseResetMaxSpeedFactor,
  );

  return rollBiasChance(
    melodyBreakPhaseResetBias,
    MelodyPhaseResetMinChance * speedFactor,
    MelodyPhaseResetMaxChance * speedFactor,
  );
};
