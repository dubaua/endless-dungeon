import type { SnareVoicing } from '../../../audio/synths/types';
import { SnareVoicing as SnareVoicingSettings } from '../../../audio/voicing/drum-voicing.const';
import { getRandomFloat } from '../../../utils/get-random-float';
import { getRandomInt } from '../../../utils/get-random-int';

export const generateSnareVoicing = (): SnareVoicing => ({
  decay: getRandomFloat(SnareVoicingSettings.decay.min, SnareVoicingSettings.decay.max),
  bitCrusherBits: getRandomInt(
    SnareVoicingSettings.bitCrusherBits.min,
    SnareVoicingSettings.bitCrusherBits.max,
  ),
  bitCrusherDepth: getRandomFloat(
    SnareVoicingSettings.bitCrusherDepth.min,
    SnareVoicingSettings.bitCrusherDepth.max,
  ),
});
