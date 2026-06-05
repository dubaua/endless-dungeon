import { rollBiasChance } from '@utils/roll-bias-chance';

const MelodySpeedChangeMinChance = 0;
const MelodySpeedChangeMaxChance = 0.05;

export const shouldChangeMotifSpeed = (melodySpeedChangeBias: number): boolean => {
  return rollBiasChance(
    melodySpeedChangeBias,
    MelodySpeedChangeMinChance,
    MelodySpeedChangeMaxChance,
  );
};
