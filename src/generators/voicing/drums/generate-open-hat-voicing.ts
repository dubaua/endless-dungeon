import type { OpenHatVoicing } from '../../../audio/synths/types';
import type { CymbalVoicingSettings } from './generate-cymbal-voicing-settings';
import { getRandomFloat } from '../../../utils/get-random-float';

const OpenHatDecayMin = 0.05;
const OpenHatDecayMax = 0.5;
const OpenHatReleaseMin = 0.05;
const OpenHatReleaseMax = 1.2;

export const generateOpenHatVoicing = (
  cymbalVoicingSettings: CymbalVoicingSettings,
): OpenHatVoicing => ({
  decay: getRandomFloat(OpenHatDecayMin, OpenHatDecayMax),
  release: getRandomFloat(OpenHatReleaseMin, OpenHatReleaseMax),
  ...cymbalVoicingSettings,
});
