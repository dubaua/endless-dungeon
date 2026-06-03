import { Note } from 'tonal';
import type { NoteName } from 'tonal';

import type { KickVoicing } from '../../../audio/synths/types';
import { getRandomFloat } from '../../../utils/get-random-float';
import { getRandomInt } from '../../../utils/get-random-int';

const KickDecayMin = 0.3;
const KickDecayMax = 0.5;
const KickFilterFrequencyMin = 60;
const KickFilterFrequencyMax = 220;
const KickFilterResonanceMin = 2;
const KickFilterResonanceMax = 10;
const KickBitsMin = 2;
const KickBitsMax = 4;
const KickDepthMin = 0;
const KickDepthMax = 0.1;

const FallbackKickPitchStart = 65.4;

const getKickPitchStart = (rootNote: NoteName): number => {
  const noteName = Note.simplify(Note.enharmonic(rootNote));
  const pitchClass = Note.get(noteName).pc;
  const pitchStart = Note.get(`${pitchClass}2`).freq;

  return pitchStart ?? FallbackKickPitchStart;
};

export const generateKickVoicing = (rootNote: NoteName): KickVoicing => ({
  decay: getRandomFloat(KickDecayMin, KickDecayMax),
  pitchStart: getKickPitchStart(rootNote),
  filterFrequency: getRandomInt(KickFilterFrequencyMin, KickFilterFrequencyMax),
  filterResonance: getRandomFloat(KickFilterResonanceMin, KickFilterResonanceMax),
  bitCrusherBits: getRandomInt(KickBitsMin, KickBitsMax),
  bitCrusherDepth: getRandomFloat(KickDepthMin, KickDepthMax),
});
