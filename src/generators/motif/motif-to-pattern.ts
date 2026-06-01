import { Midi, Note } from 'tonal';

import type { TrackDna } from '../dna/track-dna';
import type { PatternStep } from '../../sequencer';
import type { Motif } from './motif';

const BaseOctave = 3;
const MotifStepLength = 2;

const getPositiveModulo = (value: number, modulo: number): number => {
  return ((value % modulo) + modulo) % modulo;
};

const getDegreeNote = (degree: number, trackDna: TrackDna): string => {
  const scaleNotes = trackDna.scaleNotes.length > 0 ? trackDna.scaleNotes : [trackDna.rootNote];
  const scaleIndex = getPositiveModulo(degree, scaleNotes.length);
  const octaveOffset = Math.floor(degree / scaleNotes.length);
  const baseNote = `${scaleNotes[scaleIndex]}${BaseOctave}`;
  const midi = Note.midi(baseNote);

  if (midi === null) {
    return `${trackDna.rootNote}${BaseOctave}`;
  }

  return Midi.midiToNoteName(midi + octaveOffset * 12);
};

export const motifToPattern = (motif: Motif, trackDna: TrackDna): PatternStep[] => {
  return motif.flatMap((bar) =>
    bar.steps.map((degree) => [getDegreeNote(degree, trackDna), MotifStepLength]),
  );
};
