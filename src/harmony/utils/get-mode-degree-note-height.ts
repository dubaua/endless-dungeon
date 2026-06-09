import { Note } from 'tonal';
import type { NoteName } from 'tonal';

import { getModeDegreeNote } from '@harmony/get-mode-degree-note';
import type { Mode } from '@harmony/mode.type';

export const getModeDegreeNoteHeight = (
  degree: number,
  rootNote: NoteName,
  mode: Mode,
): number => {
  const note = getModeDegreeNote(rootNote, mode, degree);
  const height = Note.get(note).height;

  return height;
};
