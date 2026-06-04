import { OscillatorTypes, type OscillatorType } from './oscillator-types.const';
import type { Range } from './range.type';

type NoteSynthVoicingSetting = number | Range | readonly OscillatorType[];

export const NoteSynthVoicing = {
  oscillatorType: OscillatorTypes,
  attack: 0.01,
  decay: 0.16,
  sustain: { min: 0.2, max: 0.5 },
  release: { min: 0.01, max: 1 },
  filterFrequency: { min: 1000, max: 12000 },
  filterResonance: { min: 0.1, max: 5 },
  bitCrusherBits: { min: 2, max: 4 },
  bitCrusherDepth: { min: 0, max: 0.06 },
} satisfies Record<string, NoteSynthVoicingSetting>;
