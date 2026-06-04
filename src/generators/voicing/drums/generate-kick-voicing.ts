import { Note } from 'tonal';
import type { NoteName } from 'tonal';

import type { KickVoicing } from '../../../audio/synths/types';
import { KickVoicing as KickVoicingSettings } from '../../../audio/voicing/drum-voicing.const';
import { getRandomFloat } from '../../../utils/get-random-float';
import { getRandomInt } from '../../../utils/get-random-int';

const getKickPitchStart = (rootNote: NoteName): number => {
  const noteName = Note.simplify(Note.enharmonic(rootNote));
  const pitchClass = Note.get(noteName).pc;
  const pitchStart = Note.get(`${pitchClass}2`).freq;

  return pitchStart ?? KickVoicingSettings.pitchStart;
};

export const generateKickVoicing = (rootNote: NoteName): KickVoicing => ({
  decay: getRandomFloat(KickVoicingSettings.decay.min, KickVoicingSettings.decay.max),
  pitchStart: getKickPitchStart(rootNote),
  filterFrequency: getRandomInt(
    KickVoicingSettings.filterFrequency.min,
    KickVoicingSettings.filterFrequency.max,
  ),
  filterResonance: getRandomFloat(
    KickVoicingSettings.filterResonance.min,
    KickVoicingSettings.filterResonance.max,
  ),
  bitCrusherBits: getRandomInt(
    KickVoicingSettings.bitCrusherBits.min,
    KickVoicingSettings.bitCrusherBits.max,
  ),
  bitCrusherDepth: getRandomFloat(
    KickVoicingSettings.bitCrusherDepth.min,
    KickVoicingSettings.bitCrusherDepth.max,
  ),
});
