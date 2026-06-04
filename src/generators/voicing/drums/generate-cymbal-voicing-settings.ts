import type { ClosedHatVoicing } from '../../../audio/synths/types';
import { CymbalVoicing } from '../../../audio/voicing/drum-voicing.const';
import { getRandomFloat } from '../../../utils/get-random-float';
import { getRandomInt } from '../../../utils/get-random-int';

export type CymbalVoicingSettings = Pick<
  ClosedHatVoicing,
  'filterFrequency' | 'filterResonance' | 'bitCrusherBits' | 'bitCrusherDepth'
>;

export const generateCymbalVoicingSettings = (): CymbalVoicingSettings => ({
  filterFrequency: getRandomInt(
    CymbalVoicing.filterFrequency.min,
    CymbalVoicing.filterFrequency.max,
  ),
  filterResonance: getRandomFloat(
    CymbalVoicing.filterResonance.min,
    CymbalVoicing.filterResonance.max,
  ),
  bitCrusherBits: getRandomInt(
    CymbalVoicing.bitCrusherBits.min,
    CymbalVoicing.bitCrusherBits.max,
  ),
  bitCrusherDepth: getRandomFloat(
    CymbalVoicing.bitCrusherDepth.min,
    CymbalVoicing.bitCrusherDepth.max,
  ),
});
