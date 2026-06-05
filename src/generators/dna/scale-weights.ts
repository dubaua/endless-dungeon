import type { WeightedOptions } from '@utils/pick-weighted';
import type { ScaleName } from '@generators/dna/track-dna';

export const scaleWeights: WeightedOptions<ScaleName> = [
  { value: 'major', weight: 5 },
  { value: 'minor', weight: 5 },
  { value: 'ionian', weight: 3 },
  { value: 'dorian', weight: 3 },
  { value: 'phrygian', weight: 5 },
  { value: 'lydian', weight: 4 },
  { value: 'mixolydian', weight: 3 },
  { value: 'aeolian', weight: 3 },
  { value: 'locrian', weight: 1 },
];
