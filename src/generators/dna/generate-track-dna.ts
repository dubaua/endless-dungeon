import { Note, Scale } from 'tonal';
import type { NoteName } from 'tonal';

import { getRandomInt } from '../../utils/get-random-int';
import { pickWeighted, type RandomSource, type WeightedOptions } from '../../utils/pick-weighted';
import { bpmWeights } from './bpm-weights';
import { scaleWeights } from './scale-weights';
import type { CustomScale, ScaleName, TrackDna } from './track-dna';

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

const MinMelodicRange = 12;
const MaxMelodicRange = 36;
const MinBassRange = 7;
const MaxBassRange = 24;

export interface GenerateTrackDnaOptions {
  customScales?: CustomScale[];
}

const getRandomStep = (random: RandomSource): number => {
  return getRandomInt(0, 10, random) / 10;
};

const getRandomRootNote = (random: RandomSource): NoteName => {
  return RootNotes[getRandomInt(0, RootNotes.length - 1, random)] ?? 'C';
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

  return {
    rootNote,
    scaleName,
    scaleNotes: getScaleNotes(rootNote, scaleName, customScales),
    bpm: pickWeighted(bpmWeights, random),
    syncopation: getRandomStep(random),
    density: getRandomStep(random),
    intensity: getRandomStep(random),
    variationBias: getRandomStep(random),
    melodicRange: getRandomInt(MinMelodicRange, MaxMelodicRange, random),
    bassRange: getRandomInt(MinBassRange, MaxBassRange, random),
  };
};
