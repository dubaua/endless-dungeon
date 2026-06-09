import { OscillatorTypeValues, type OscillatorType } from '@audio/voicing/oscillator-types.const';
import type { Range } from '@audio/voicing/range.type';

type NoteSynthVoicingSetting = number | Range | readonly OscillatorType[];

export const NoteSynthVoicing = {
  oscillatorType: OscillatorTypeValues,
  attack: 0.01,
  decay: 0.16,
  sustain: { min: 0.65, max: 0.95 },
  release: { min: 0.08, max: 1 },
  filterFrequency: { min: 1000, max: 12000 },
  filterResonance: { min: 0.1, max: 5 },
  bitCrusherBits: { min: 2, max: 4 },
  bitCrusherDepth: { min: 0, max: 0.06 },
} satisfies Record<string, NoteSynthVoicingSetting>;
