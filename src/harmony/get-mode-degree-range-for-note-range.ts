import type { NoteName } from 'tonal';

import type { Mode } from '@harmony/mode.type';
import { getModeDegreeNoteHeight } from '@harmony/utils/get-mode-degree-note-height';
import { getNoteHeight } from '@harmony/utils/get-note-height';

type Props = {
  maxNote: string;
  minNote: string;
  mode: Mode;
  rootNote: NoteName;
};

export type ModeDegreeRange = {
  absoluteRange: number;
  maxDegree: number;
  minDegree: number;
};

const DegreeSearchMin = -64;
const DegreeSearchMax = 64;

export const getModeDegreeRangeForNoteRange = ({
  rootNote,
  mode,
  minNote,
  maxNote,
}: Props): ModeDegreeRange => {
  const minNoteHeight = getNoteHeight(minNote);
  const maxNoteHeight = getNoteHeight(maxNote);
  const degrees = Array.from(
    { length: DegreeSearchMax - DegreeSearchMin + 1 },
    (_, index) => DegreeSearchMin + index,
  ).filter((degree) => {
    const noteHeight = getModeDegreeNoteHeight(degree, rootNote, mode);

    return noteHeight >= minNoteHeight && noteHeight <= maxNoteHeight;
  });
  const minDegree = Math.min(...degrees);
  const maxDegree = Math.max(...degrees);

  return {
    minDegree,
    maxDegree,
    absoluteRange: Math.min(Math.abs(minDegree), Math.abs(maxDegree)),
  };
};
