import { Midi, Note } from 'tonal';
import type { NoteName } from 'tonal';

import type { Mode } from '@harmony/mode.type';

type Props = {
  mode: Mode;
  rootNote: NoteName;
};

export type ModeNoteSpelling = {
  getNoteSpelling: (note: NoteName | number) => NoteName;
};

export const getModeNoteSpelling = ({ rootNote, mode }: Props): ModeNoteSpelling => {
  const rootPitchClass = Note.chroma(rootNote);

  if (rootPitchClass === null) {
    throw new Error(`Invalid root note: ${rootNote}`);
  }

  const pitchClasses = mode.degrees.map((degree) => {
    return (((rootPitchClass + degree.interval) % 12) + 12) % 12;
  });

  if (mode.degrees.length <= 7 && new Set(pitchClasses).size !== pitchClasses.length) {
    throw new Error('Mode with 7 or fewer degrees must not contain repeated pitch classes');
  }

  const variants = [
    {
      accidental: 'sharp' as const,
      modeNotes: pitchClasses.map((pitchClass) =>
        Midi.midiToNoteName(pitchClass, {
          pitchClass: true,
          sharps: true,
        }),
      ),
    },
    {
      accidental: 'flat' as const,
      modeNotes: pitchClasses.map((pitchClass) =>
        Midi.midiToNoteName(pitchClass, {
          pitchClass: true,
          sharps: false,
        }),
      ),
    },
  ].map((variant) => {
    const letters = variant.modeNotes.map((note) => note[0] ?? '');
    const accidentalCount = variant.modeNotes.reduce((sum, note) => {
      return sum + [...note].filter((char) => char === '#' || char === 'b').length;
    }, 0);

    return {
      ...variant,
      accidentalCount,
      uniqueLetterCount: new Set(letters).size,
    };
  });

  const selected =
    mode.degrees.length === 7
      ? [...variants].sort((left, right) => {
          const leftHasUniqueLetters = left.uniqueLetterCount === 7;
          const rightHasUniqueLetters = right.uniqueLetterCount === 7;

          if (leftHasUniqueLetters !== rightHasUniqueLetters) {
            return leftHasUniqueLetters ? -1 : 1;
          }

          return left.accidentalCount - right.accidentalCount;
        })[0]
      : [...variants].sort((left, right) => {
          return left.accidentalCount - right.accidentalCount;
        })[0];

  if (!selected) {
    throw new Error('Failed to select mode note spelling');
  }

  const modeNotes =
    mode.degrees.length === 7 && selected.uniqueLetterCount !== 7
      ? selected.modeNotes.reduce<NoteName[]>((result, note) => {
          const usedLetters = new Set(result.map((resultNote) => resultNote[0] ?? ''));
          const noteLetter = note[0] ?? '';

          if (!usedLetters.has(noteLetter)) {
            result.push(note);
            return result;
          }

          const enharmonicNote = Note.enharmonic(note);
          const enharmonicLetter = enharmonicNote[0] ?? '';

          if (!usedLetters.has(enharmonicLetter)) {
            result.push(enharmonicNote);
            return result;
          }

          result.push(note);
          return result;
        }, [])
      : selected.modeNotes;

  const notes = Object.fromEntries(
    modeNotes.map((note, index) => [pitchClasses[index], note]),
  ) as Record<number, NoteName>;

  return {
    getNoteSpelling: (note) => {
      const pitchClass = typeof note === 'number' ? note : Note.chroma(note);

      if (pitchClass === null) {
        throw new Error(`Invalid note: ${note}`);
      }

      const normalizedPitchClass = ((pitchClass % 12) + 12) % 12;

      return notes[normalizedPitchClass] ?? Midi.midiToNoteName(normalizedPitchClass, {
        pitchClass: true,
        sharps: selected.accidental === 'sharp',
      });
    },
  };
};
