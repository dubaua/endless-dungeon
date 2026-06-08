import type { NoteName } from 'tonal';

import type { Mode } from '@harmony/mode.type';
import { getModeDegreeNoteHeight } from '@harmony/utils/get-mode-degree-note-height';

export const getModeDegreeNoteHeights = (
  degrees: readonly number[],
  rootNote: NoteName,
  mode: Mode,
): number[] => {
  return degrees.map((degree) => getModeDegreeNoteHeight(degree, rootNote, mode));
};
