import type { NoteName } from 'tonal';

import { getModeDegreeNote } from '@harmony/get-mode-degree-note';
import type { Mode } from '@harmony/mode.type';
import { getNoteHeight } from '@harmony/utils/get-note-height';

export const getModeDegreeNoteHeight = (
  degree: number,
  rootNote: NoteName,
  mode: Mode,
): number => {
  return getNoteHeight(getModeDegreeNote(rootNote, mode, degree));
};
