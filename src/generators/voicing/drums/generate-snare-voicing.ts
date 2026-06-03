import type { SnareVoicing } from '../../../audio/synths/types';
import { getRandomFloat } from '../../../utils/get-random-float';
import { getRandomInt } from '../../../utils/get-random-int';

// TODO вынести в войсинг, импортнуть в контролы
export const SnareDecayMin = 0.08;
export const SnareDecayMax = 0.25;
export const SnareBitsMin = 2;
export const SnareBitsMax = 4;
export const SnareDepthMin = 0.01;
export const SnareDepthMax = 0.1;

export const generateSnareVoicing = (): SnareVoicing => ({
  decay: getRandomFloat(SnareDecayMin, SnareDecayMax),
  bitCrusherBits: getRandomInt(SnareBitsMin, SnareBitsMax),
  bitCrusherDepth: getRandomFloat(SnareDepthMin, SnareDepthMax),
});
