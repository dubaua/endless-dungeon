import type { CrashVoicing } from '../../../audio/synths/types';
import type { CymbalVoicingSettings } from './generate-cymbal-voicing-settings';
import { getRandomFloat } from '../../../utils/get-random-float';

const CrashDecayMin = 1;
const CrashDecayMax = 4;
const CrashReleaseMin = 1;
const CrashReleaseMax = 5;

export const generateCrashVoicing = (
  cymbalVoicingSettings: CymbalVoicingSettings,
): CrashVoicing => ({
  decay: getRandomFloat(CrashDecayMin, CrashDecayMax),
  release: getRandomFloat(CrashReleaseMin, CrashReleaseMax),
  ...cymbalVoicingSettings,
});
