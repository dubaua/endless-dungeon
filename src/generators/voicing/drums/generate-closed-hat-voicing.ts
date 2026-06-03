import type { ClosedHatVoicing } from '../../../audio/synths/types';
import type { CymbalVoicingSettings } from './generate-cymbal-voicing-settings';
import { getRandomFloat } from '../../../utils/get-random-float';

const ClosedHatDecayMin = 0.02;
const ClosedHatDecayMax = 0.15;

export const generateClosedHatVoicing = (
  cymbalVoicingSettings: CymbalVoicingSettings,
): ClosedHatVoicing => ({
  decay: getRandomFloat(ClosedHatDecayMin, ClosedHatDecayMax),
  ...cymbalVoicingSettings,
});
