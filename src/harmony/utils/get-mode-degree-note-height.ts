import { Note } from 'tonal';
import type { NoteName } from 'tonal';

import { getModeDegree, getModeDegreeOctave } from '@harmony/get-mode-degree';
import type { Mode } from '@harmony/mode.type';

const RootNoteOctave = 4;

export const getModeDegreeNoteHeight = (
  degree: number,
  rootNote: NoteName,
  mode: Mode,
): number => {
  const rootHeight = Note.midi(`${rootNote}${RootNoteOctave}`);

  if (rootHeight === null) {
    throw new Error(`Invalid root note: ${rootNote}`);
  }

  return rootHeight + getModeDegree(degree, mode).interval + getModeDegreeOctave(degree, mode) * 12;
};
