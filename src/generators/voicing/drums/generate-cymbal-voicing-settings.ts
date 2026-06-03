import type { ClosedHatVoicing } from '../../../audio/synths/types';
import { getRandomFloat } from '../../../utils/get-random-float';
import { getRandomInt } from '../../../utils/get-random-int';

export type CymbalVoicingSettings = Pick<
  ClosedHatVoicing,
  'filterFrequency' | 'filterResonance' | 'bitCrusherBits' | 'bitCrusherDepth'
>;

const CymbalFilterFrequencyMin = 2500;
const CymbalFilterFrequencyMax = 10000;
const CymbalFilterResonanceMin = 0.1;
const CymbalFilterResonanceMax = 4;
const CymbalBitsMin = 2;
const CymbalBitsMax = 4;
const CymbalDepthMin = 0.013;
const CymbalDepthMax = 0.055;

export const generateCymbalVoicingSettings = (): CymbalVoicingSettings => ({
  filterFrequency: getRandomInt(
    CymbalFilterFrequencyMin,
    CymbalFilterFrequencyMax,
  ),
  filterResonance: getRandomFloat(
    CymbalFilterResonanceMin,
    CymbalFilterResonanceMax,
  ),
  bitCrusherBits: getRandomInt(CymbalBitsMin, CymbalBitsMax),
  bitCrusherDepth: getRandomFloat(CymbalDepthMin, CymbalDepthMax),
});
