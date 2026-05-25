const pitchNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const midiNoteToName = (midiNote: number): string => {
  const pitch = pitchNames[midiNote % 12] ?? 'Note';
  const octave = Math.floor(midiNote / 12) - 1;
  return `${pitch}${octave}`;
};
