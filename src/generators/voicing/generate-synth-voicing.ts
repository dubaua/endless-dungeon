import { getRandomFloat } from '../../utils/get-random-float';
import { getRandomInt } from '../../utils/get-random-int';
import type { RandomSource } from '../../utils/pick-weighted';
import type { OscillatorType } from '../../audio/tone-types';
import { takeRandom } from '../../utils/take-random';

export interface VoiceSettings {
  oscillatorType: OscillatorType;
  sustain: number;
  release: number;
  filterFrequency: number;
  filterResonance: number;
  bitCrusherBits: number;
  bitCrusherDepth: number;
}

const OscillatorTypes: readonly OscillatorType[] = ['sine', 'triangle', 'sawtooth', 'square'];

export const generateSynthVoicing = (random: RandomSource): VoiceSettings => {
  return {
    oscillatorType: takeRandom(OscillatorTypes),
    sustain: getRandomFloat(0.2, 0.5, random),
    release: getRandomFloat(0.01, 1, random),
    filterFrequency: getRandomInt(1000, 12000, random),
    filterResonance: getRandomFloat(0.1, 5, random),
    bitCrusherBits: getRandomInt(2, 4, random),
    bitCrusherDepth: getRandomFloat(0, 0.06, random),
  };
};
