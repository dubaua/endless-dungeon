import type { RandomSource } from '../../utils/pick-weighted';
import { generateTrack } from '../generate-track';
import type { TrackBlock } from '../track-block';

export const generateTracks = (count = 100, random: RandomSource = Math.random): TrackBlock[][] => {
  return Array.from({ length: count }, () => generateTrack(random));
};
