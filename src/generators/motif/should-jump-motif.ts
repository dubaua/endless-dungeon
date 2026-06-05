import { rollBiasChance } from '@utils/roll-bias-chance';

const MelodyJumpMinChance = 0.01;
const MelodyJumpMaxChance = 0.25;

export const MinMotifJumpSteps = 3;
export const MaxMotifJumpSteps = 7;

export const shouldJumpMotif = (melodyJumpBias: number): boolean => {
  return rollBiasChance(
    melodyJumpBias,
    MelodyJumpMinChance,
    MelodyJumpMaxChance,
  );
};
