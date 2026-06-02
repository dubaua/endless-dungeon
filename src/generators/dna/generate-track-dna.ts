import { Note, Scale } from 'tonal';
import type { NoteName } from 'tonal';

import { getRandomFloat } from '../../utils/get-random-float';
import { getRandomInt } from '../../utils/get-random-int';
import { pickWeighted, type RandomSource, type WeightedOptions } from '../../utils/pick-weighted';
import { bpmWeights } from './bpm-weights';
import { generateDrumDnaSettings } from './generate-drum-dna';
import { scaleWeights } from './scale-weights';
import type {
  CustomScale,
  ScaleName,
  TrackDna,
  TrackDnaOscillatorType,
  TrackDnaVoiceSettings,
} from './track-dna';

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
const OscillatorTypes: readonly TrackDnaOscillatorType[] = ['sine', 'triangle', 'sawtooth', 'square'];

export interface GenerateTrackDnaOptions {
  customScales?: CustomScale[];
}

const getRandomStep = (random: RandomSource): number => {
  return getRandomInt(0, 10, random) / 10;
};

const getRandomRootNote = (random: RandomSource): NoteName => {
  return RootNotes[getRandomInt(0, RootNotes.length - 1, random)] ?? 'C';
};

const generateVoiceSettings = (random: RandomSource): TrackDnaVoiceSettings => {
  return {
    oscillatorType: OscillatorTypes[getRandomInt(0, OscillatorTypes.length - 1, random)] ?? 'sine',
    sustain: getRandomFloat(0.2, 0.5, random),
    release: getRandomFloat(0.01, 1, random),
    filterFrequency: getRandomInt(1000, 12000, random),
    filterResonance: getRandomFloat(0.1, 5, random),
    bitCrusherBits: getRandomInt(2, 4, random),
    bitCrusherDepth: getRandomFloat(0, 0.06, random),
  };
};

const getScaleWeights = (customScales: readonly CustomScale[] = []): WeightedOptions<ScaleName> => {
  return [
    ...scaleWeights,
    ...customScales.map((scale) => ({
      value: scale.name,
      weight: scale.weight,
    })),
  ];
};

const normalizeRootNote = (note: NoteName): NoteName => {
  return Note.enharmonic(note);
};

const normalizeScaleNote = (note: NoteName): NoteName => {
  return Note.simplify(note);
};

const normalizeNotes = (notes: readonly NoteName[]): NoteName[] => {
  return notes.map(normalizeScaleNote);
};

const getScaleNotes = (
  rootNote: NoteName,
  scaleName: ScaleName,
  customScales: readonly CustomScale[] = [],
): NoteName[] => {
  const customScale = customScales.find((scale) => scale.name === scaleName);

  if (customScale) {
    return normalizeNotes(customScale.notes);
  }

  return normalizeNotes(Scale.get(`${rootNote} ${scaleName}`).notes);
};

export const generateTrackDna = (
  random: RandomSource = Math.random,
  options: GenerateTrackDnaOptions = {},
): TrackDna => {
  const customScales = options.customScales ?? [];
  const rootNote = normalizeRootNote(getRandomRootNote(random));
  const scaleName = pickWeighted(getScaleWeights(customScales), random);
  const absoluteRange = getRandomInt(MinAbsoluteRangeSteps, MaxAbsoluteRangeSteps, random);
  const drumDnaSettings = generateDrumDnaSettings(random);

  return {
    rootNote,
    scaleName,
    scaleNotes: getScaleNotes(rootNote, scaleName, customScales),
    bpm: pickWeighted(bpmWeights, random),
    syncopation: drumDnaSettings.syncopation,
    density: drumDnaSettings.density,
    bodyDrumPattern: drumDnaSettings.bodyDrumPattern,
    intensity: getRandomStep(random),
    variationBias: getRandomStep(random),
    noteLengthVariationBias: getRandomStep(random),
    noteGapBias: getRandomStep(random),
    melodyJumpBias: getRandomStep(random),
    melodyBreakPhaseResetBias: getRandomStep(random),
    melodyBreakPhaseShiftBias: getRandomStep(random),
    melodySpeedBias: getRandomStep(random),
    melodySpeedChangeBias: getRandomStep(random),
    melodicRange: getRandomInt(
      MinMelodicRangeSteps,
      Math.min(MaxMelodicRangeSteps, absoluteRange),
      random,
    ),
    absoluteRange,
    bassRange: getRandomInt(MinBassRangeSteps, MaxBassRangeSteps, random),
    voice: generateVoiceSettings(random),
  };
};
