import type { ClapVoicing } from '../../../audio/synths/types';
import { ClapVoicing as ClapVoicingSettings } from '../../../audio/voicing/drum-voicing.const';
import { getRandomFloat } from '../../../utils/get-random-float';
import { getRandomInt } from '../../../utils/get-random-int';

export const generateClapVoicing = (): ClapVoicing => ({
  decay: getRandomFloat(ClapVoicingSettings.decay.min, ClapVoicingSettings.decay.max),
  burstCount: getRandomInt(ClapVoicingSettings.burstCount.min, ClapVoicingSettings.burstCount.max),
  burstSpread: getRandomFloat(
    ClapVoicingSettings.burstSpread.min,
    ClapVoicingSettings.burstSpread.max,
  ),
  bitCrusherBits: getRandomInt(
    ClapVoicingSettings.bitCrusherBits.min,
    ClapVoicingSettings.bitCrusherBits.max,
  ),
  bitCrusherDepth: getRandomFloat(
    ClapVoicingSettings.bitCrusherDepth.min,
    ClapVoicingSettings.bitCrusherDepth.max,
  ),
});
