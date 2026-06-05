import type { OpenHatVoicing } from '@audio/synths/types';
import { OpenHatVoicing as OpenHatVoicingSettings } from '@audio/voicing/drum-voicing.const';
import type { CymbalVoicingSettings } from '@generators/voicing/drums/generate-cymbal-voicing-settings';
import { getRandomFloat } from '@utils/get-random-float';

export const generateOpenHatVoicing = (
  cymbalVoicingSettings: CymbalVoicingSettings,
): OpenHatVoicing => ({
  decay: getRandomFloat(OpenHatVoicingSettings.decay.min, OpenHatVoicingSettings.decay.max),
  release: getRandomFloat(
    OpenHatVoicingSettings.release.min,
    OpenHatVoicingSettings.release.max,
  ),
  ...cymbalVoicingSettings,
});
