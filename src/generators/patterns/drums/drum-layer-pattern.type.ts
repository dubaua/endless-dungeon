import { WeightedOptions } from '../../../utils/pick-weighted';

export type DrumPattern = {
  name: string;
  pattern: readonly number[];
  syncopationGrade: number;
  genres: readonly string[];
};

export type HatPattern = {
  name: string;
  closeHatPattern: readonly number[];
  openHatPattern: readonly number[];
  syncopationGrade: number;
  genres: readonly string[];
};

export type DramFamily = {
  name: string;
  genres: readonly string[];
  weightedPatterns: WeightedOptions<DrumPattern>;
};

export type HatFamily = {
  name: string;
  genres: readonly string[];
  weightedPatterns: WeightedOptions<HatPattern>;
};
