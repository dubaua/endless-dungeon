import type { CrashVoicing } from '../../../audio/synths/types';
import { CrashVoicing as CrashVoicingSettings } from '../../../audio/voicing/drum-voicing.const';
import type { CymbalVoicingSettings } from './generate-cymbal-voicing-settings';
import { getRandomFloat } from '../../../utils/get-random-float';

export const generateCrashVoicing = (
  cymbalVoicingSettings: CymbalVoicingSettings,
): CrashVoicing => ({
  decay: getRandomFloat(CrashVoicingSettings.decay.min, CrashVoicingSettings.decay.max),
  release: getRandomFloat(CrashVoicingSettings.release.min, CrashVoicingSettings.release.max),
  ...cymbalVoicingSettings,
});
