import type { NoteName } from 'tonal';

import type { Mode } from '@harmony/mode.type';
import { getModeDegreeNoteHeights } from '@harmony/utils/get-mode-degree-note-heights';

type Props = {
  degrees: readonly number[];
  maxNoteHeight: number;
  minNoteHeight: number;
  mode: Mode;
  rootNote: NoteName;
};

export const getRegisterDistance = ({
  degrees,
  rootNote,
  mode,
  minNoteHeight,
  maxNoteHeight,
}: Props): number => {
  const noteHeights = getModeDegreeNoteHeights(degrees, rootNote, mode);
  const minDistance = Math.max(0, minNoteHeight - Math.min(...noteHeights));
  const maxDistance = Math.max(0, Math.max(...noteHeights) - maxNoteHeight);

  return minDistance + maxDistance;
};
