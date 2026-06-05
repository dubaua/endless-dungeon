import type { WeightedOptions } from '@utils/pick-weighted';

export type Bpm = number;

export const bpmWeights: WeightedOptions<Bpm> = [
  { value: 90, weight: 1 },
  { value: 95, weight: 2 },
  { value: 100, weight: 3 },
  { value: 105, weight: 4 },
  { value: 110, weight: 7 },
  { value: 115, weight: 8 },
  { value: 120, weight: 13 },
  { value: 125, weight: 8 },
  { value: 130, weight: 7 },
  { value: 135, weight: 5 },
  { value: 140, weight: 4 },
  { value: 145, weight: 3 },
  { value: 150, weight: 2 },
  { value: 155, weight: 2 },
  { value: 160, weight: 2 },
  { value: 165, weight: 1 },
  { value: 170, weight: 1 },
  { value: 175, weight: 1 },
];
