import { Midi, Note } from 'tonal';
import type { NoteName } from 'tonal';

import { getModeDegree, getModeDegreeOctave } from '@harmony/get-mode-degree';
import type { Mode } from '@harmony/mode.type';

const RootNoteOctave = 4;

/**
 * Materializes an absolute mode degree into a concrete note name.
 * Keeps note conversion at the score-building edge while generators stay degree-based.
 */
export const getModeDegreeNote = (
  rootNote: NoteName,
  mode: Mode,
  degree: number,
): string => {
  const rootMidi = Note.midi(`${rootNote}${RootNoteOctave}`);

  if (rootMidi === null) {
    throw new Error(`Invalid root note: ${rootNote}`);
  }

  const modeDegree = getModeDegree(degree, mode);
  const octave = getModeDegreeOctave(degree, mode);

  return Midi.midiToNoteName(rootMidi + modeDegree.interval + octave * 12);
};
