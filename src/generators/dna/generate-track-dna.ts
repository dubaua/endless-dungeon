import { Note, Scale } from 'tonal';
import type { NoteName } from 'tonal';

import { getRandomInt } from '@utils/get-random-int';
import { pickWeighted, type WeightedOptions } from '@utils/pick-weighted';
import { takeRandom } from '@utils/take-random';
import { generateDrumVoicing } from '@generators/voicing/drums/generate-drum-voicing';
import { generateSynthVoicing } from '@generators/voicing/generate-synth-voicing';
import { generateTrackComposition } from '@generators/composition/generate-track-composition';
import { bpmWeights } from '@generators/dna/bpm-weights';
import { generateDrumDnaSettings } from '@generators/dna/generate-drum-dna';
import { scaleWeights } from '@generators/dna/scale-weights';
import type { CustomScale, ScaleName, TrackDna } from '@generators/dna/track-dna';

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
const MaxMelodicRangeSteps = 16;
const MinAbsoluteRangeSteps = 5;
const MaxAbsoluteRangeSteps = 16;
const MinBassRangeSteps = 5;
const MaxBassRangeSteps = 16;

export interface GenerateTrackDnaOptions {
  customScales?: CustomScale[];
}

// не уверен что это говно нужно, как и следующая функция
const getScaleWeights = (customScales: readonly CustomScale[] = []): WeightedOptions<ScaleName> => {
  return [
    ...scaleWeights,
    ...customScales.map((scale) => ({
      value: scale.name,
      weight: scale.weight,
    })),
  ];
};

const getScaleNotes = (
  rootNote: NoteName,
  scaleName: ScaleName,
  customScales: readonly CustomScale[] = [],
): NoteName[] => {
  const customScale = customScales.find((scale) => scale.name === scaleName);

  if (customScale) {
    return customScale.notes.map((note) => Note.simplify(note));
  }

  return Scale.get(`${rootNote} ${scaleName}`).notes.map((note) => Note.simplify(note));
};

export const generateTrackDna = (
  options: GenerateTrackDnaOptions = {},
): TrackDna => {
  const customScales = options.customScales ?? [];
  const rootNote = Note.enharmonic(takeRandom(RootNotes));
  const scaleName = pickWeighted(getScaleWeights(customScales));
  const absoluteRange = getRandomInt(MinAbsoluteRangeSteps, MaxAbsoluteRangeSteps);
  const drumDnaSettings = generateDrumDnaSettings();

  return {
    rootNote,
    scaleName,
    scaleNotes: getScaleNotes(rootNote, scaleName, customScales),
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
    melodicRange: getRandomInt(
      MinMelodicRangeSteps,
      Math.min(MaxMelodicRangeSteps, absoluteRange),
    ),
    absoluteRange,
    bassRange: getRandomInt(MinBassRangeSteps, MaxBassRangeSteps),
    voicing: {
      drums: generateDrumVoicing(rootNote),
      voice: generateSynthVoicing(),
      bass: generateSynthVoicing(),
    },
    composition: generateTrackComposition(),
  };
};
