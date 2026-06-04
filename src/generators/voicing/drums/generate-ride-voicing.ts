import type { RideVoicing } from '../../../audio/synths/types';
import { RideVoicing as RideVoicingSettings } from '../../../audio/voicing/drum-voicing.const';
import type { CymbalVoicingSettings } from './generate-cymbal-voicing-settings';
import { getRandomFloat } from '../../../utils/get-random-float';

export const generateRideVoicing = (
  cymbalVoicingSettings: CymbalVoicingSettings,
): RideVoicing => ({
  decay: getRandomFloat(RideVoicingSettings.decay.min, RideVoicingSettings.decay.max),
  release: getRandomFloat(RideVoicingSettings.release.min, RideVoicingSettings.release.max),
  ...cymbalVoicingSettings,
});
