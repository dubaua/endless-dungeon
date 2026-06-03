import { getRandomFloat } from '../../utils/get-random-float';
import { getRandomInt } from '../../utils/get-random-int';
import type { RandomSource } from '../../utils/pick-weighted';
import type { OscillatorType } from '../../audio/tone-types';
import type { NoteSynthVoicing } from '../../audio/synths/types';
import { takeRandom } from '../../utils/take-random';

const OscillatorTypes: readonly OscillatorType[] = ['sine', 'triangle', 'sawtooth', 'square'];

export const generateSynthVoicing = (random: RandomSource): NoteSynthVoicing => {
  return {
    oscillatorType: takeRandom(OscillatorTypes, random),
    attack: 0.01,
    decay: 0.16,
    sustain: getRandomFloat(0.2, 0.5, random),
    release: getRandomFloat(0.01, 1, random),
    filterFrequency: getRandomInt(1000, 12000, random),
    filterResonance: getRandomFloat(0.1, 5, random),
    bitCrusherBits: getRandomInt(2, 4, random),
    bitCrusherDepth: getRandomFloat(0, 0.06, random),
  };
};
