import type { NoteName } from 'tonal';

import type { Mode } from '@harmony/mode.type';
import { getModeDegreeNoteHeight } from '@harmony/utils/get-mode-degree-note-height';

export const getModeDegreeIntervalHeight = (
  leftDegree: number,
  rightDegree: number,
  rootNote: NoteName,
  mode: Mode,
): number => {
  return (
    Math.abs(
      getModeDegreeNoteHeight(leftDegree, rootNote, mode) -
        getModeDegreeNoteHeight(rightDegree, rootNote, mode),
    ) % 12
  );
};
