import type { ClosedHatVoicing } from '@audio/synths/types';
import { ClosedHatVoicing as ClosedHatVoicingSettings } from '@audio/voicing/drum-voicing.const';
import type { CymbalVoicingSettings } from '@generators/voicing/drums/generate-cymbal-voicing-settings';
import { getRandomFloat } from '@utils/get-random-float';

export const generateClosedHatVoicing = (
  cymbalVoicingSettings: CymbalVoicingSettings,
): ClosedHatVoicing => ({
  decay: getRandomFloat(
    ClosedHatVoicingSettings.decay.min,
    ClosedHatVoicingSettings.decay.max,
  ),
  ...cymbalVoicingSettings,
});
