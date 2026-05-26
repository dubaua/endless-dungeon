import type { WeightedGraph } from '../../utils/generate-by-graph';
import type { ScaleName } from './track-dna';

export const scaleWeights: WeightedGraph<ScaleName> = {
  major: 5,
  minor: 5,
  ionian: 3,
  dorian: 3,
  phrygian: 5,
  lydian: 4,
  mixolydian: 3,
  aeolian: 3,
  locrian: 1,
};
