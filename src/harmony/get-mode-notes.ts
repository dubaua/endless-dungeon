import { Midi, Note } from 'tonal';
import type { NoteName } from 'tonal';

import type { Mode, ModeNotes } from '@harmony/mode.type';

const RootNoteOctave = 4;

/**
 * Builds pitch classes for every local degree in a mode.
 * Keeps interval materialization at the end of the degree-based generation chain.
 */
export const getModeNotes = (rootNote: NoteName, mode: Mode): ModeNotes => {
  const rootMidi = Note.midi(`${rootNote}${RootNoteOctave}`);

  if (rootMidi === null) {
    throw new Error(`Invalid root note: ${rootNote}`);
  }

  return mode.degrees.map((degree) => (
    Note.simplify(Midi.midiToNoteName(rootMidi + degree.interval, {
      pitchClass: true,
      sharps: true,
    }))
  ));
};
