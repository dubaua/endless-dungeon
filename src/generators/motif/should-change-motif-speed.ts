import type { RandomSource } from '../../utils/pick-weighted';
import { rollBiasChance } from '../../utils/roll-bias-chance';

const MelodySpeedChangeMinChance = 0;
const MelodySpeedChangeMaxChance = 0.05;

export const shouldChangeMotifSpeed = (
  melodySpeedChangeBias: number,
  random: RandomSource,
): boolean => {
  return rollBiasChance(
    melodySpeedChangeBias,
    MelodySpeedChangeMinChance,
    MelodySpeedChangeMaxChance,
    random,
  );
};
