import type { RideVoicing } from '../../../audio/synths/types';
import type { CymbalVoicingSettings } from './generate-cymbal-voicing-settings';
import { getRandomFloat } from '../../../utils/get-random-float';

const RideDecayMin = 0.2;
const RideDecayMax = 1.5;
const RideReleaseMin = 0.05;
const RideReleaseMax = 1.5;

export const generateRideVoicing = (
  cymbalVoicingSettings: CymbalVoicingSettings,
): RideVoicing => ({
  decay: getRandomFloat(RideDecayMin, RideDecayMax),
  release: getRandomFloat(RideReleaseMin, RideReleaseMax),
  ...cymbalVoicingSettings,
});
