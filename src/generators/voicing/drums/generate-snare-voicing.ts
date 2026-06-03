import type { SnareVoicing } from '../../../audio/synths/types';
import { getRandomFloat } from '../../../utils/get-random-float';
import { getRandomInt } from '../../../utils/get-random-int';

const SnareDecayMin = 0.08;
const SnareDecayMax = 0.6;
const SnareBitsMin = 2;
const SnareBitsMax = 4;
const SnareDepthMin = 0.01;
const SnareDepthMax = 0.1;

export const generateSnareVoicing = (): SnareVoicing => ({
  decay: getRandomFloat(SnareDecayMin, SnareDecayMax),
  bitCrusherBits: getRandomInt(SnareBitsMin, SnareBitsMax),
  bitCrusherDepth: getRandomFloat(SnareDepthMin, SnareDepthMax),
});
