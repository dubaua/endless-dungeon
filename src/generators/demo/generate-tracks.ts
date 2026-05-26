import type { RandomSource } from '../../utils/generate-by-graph';
import { generateTrack } from '../generate-track';
import type { TrackBlock } from '../track-block';

export const generateTracks = (count = 100, random: RandomSource = Math.random): TrackBlock[][] => {
  return Array.from({ length: count }, () => generateTrack(random));
};
