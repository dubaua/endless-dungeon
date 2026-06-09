import { Note } from 'tonal';
import type { NoteName } from 'tonal';

import { getModeDegree, getModeDegreeOctave } from '@harmony/get-mode-degree';
import type { Mode } from '@harmony/mode.type';

const RootNoteOctave = 4;

/**
 * Materializes an absolute mode degree into a concrete note name.
 * Keeps note conversion at the score-building edge while generators stay degree-based.
 */
export const getModeDegreeNote = (rootNote: NoteName, mode: Mode, degree: number): string => {
  const rootNoteWithOctave = `${rootNote}${RootNoteOctave}`;
  const modeDegree = getModeDegree(degree, mode);
  const note = Note.transpose(rootNoteWithOctave, modeDegree.interval);

  if (!note) {
    throw new Error(`Invalid root note: ${rootNote}`);
  }

  const octave = getModeDegreeOctave(degree, mode);

  return Note.transposeOctaves(note, octave);
};
