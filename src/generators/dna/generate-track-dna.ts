import { Note } from 'tonal';
import type { NoteName } from 'tonal';

import { getRandomInt } from '@utils/get-random-int';
import { pickWeighted } from '@utils/pick-weighted';
import { takeRandom } from '@utils/take-random';
import { generateDrumVoicing } from '@generators/voicing/drums/generate-drum-voicing';
import { generateSynthVoicing } from '@generators/voicing/generate-synth-voicing';
import { generateTrackComposition } from '@generators/composition/generate-track-composition';
import { bpmWeights } from '@generators/dna/bpm-weights';
import { generateDrumDnaSettings } from '@generators/dna/generate-drum-dna';
import { getModeDegreeRangeForNoteRange } from '@harmony/get-mode-degree-range-for-note-range';
import { pickMode } from '@harmony/pick-mode';
import type { TrackDna } from '@generators/dna/track-dna';

const RootNotes: readonly NoteName[] = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
];

const MinMelodicRangeSteps = 5;
const MaxMelodicRangeSteps = 12;
const MinAbsoluteRangeSteps = 5;
const MaxAbsoluteRangeSteps = 12;
const BassRangeSteps = 8;
const VoiceMinNote = 'B2';
const VoiceMaxNote = 'B5';

export const generateTrackDna = (): TrackDna => {
  const rootNote = Note.enharmonic(takeRandom(RootNotes));
  const mode = pickMode();
  const voiceDegreeRange = getModeDegreeRangeForNoteRange({
    rootNote,
    mode,
    minNote: VoiceMinNote,
    maxNote: VoiceMaxNote,
  });
  const maxAbsoluteRange = Math.min(MaxAbsoluteRangeSteps, voiceDegreeRange.absoluteRange);
  const absoluteRange = getRandomInt(
    Math.min(MinAbsoluteRangeSteps, maxAbsoluteRange),
    maxAbsoluteRange,
  );
  const drumDnaSettings = generateDrumDnaSettings();

  return {
    rootNote,
    modeName: mode.name,
    bpm: pickWeighted(bpmWeights),
    syncopation: drumDnaSettings.syncopation,
    density: drumDnaSettings.density,
    bodyDrumPattern: drumDnaSettings.bodyDrumPattern,
    bodyHatPattern: drumDnaSettings.bodyHatPattern,
    intensity: getRandomInt(0, 10) / 10,
    variationBias: getRandomInt(0, 10) / 10,
    noteLengthVariationBias: getRandomInt(0, 10) / 10,
    noteGapBias: getRandomInt(0, 10) / 10,
    melodyJumpBias: getRandomInt(0, 10) / 10,
    melodyBreakPhaseResetBias: getRandomInt(0, 10) / 10,
    melodyBreakPhaseShiftBias: getRandomInt(0, 10) / 10,
    melodySpeedBias: getRandomInt(0, 10) / 10,
    melodySpeedChangeBias: getRandomInt(0, 10) / 10,
    melodicRange: getRandomInt(MinMelodicRangeSteps, Math.min(MaxMelodicRangeSteps, absoluteRange)),
    absoluteRange,
    bassRange: BassRangeSteps,
    voicing: {
      drums: generateDrumVoicing(rootNote),
      voice: generateSynthVoicing(),
      bass: generateSynthVoicing(),
    },
    composition: generateTrackComposition(),
  };
};
