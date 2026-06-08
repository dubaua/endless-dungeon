import { Note } from 'tonal';

export const getNoteHeight = (note: string): number => {
  return Note.get(note).height;
};
