import { Note } from 'tonal';

export const getNoteName = (noteName: string): string => Note.get(noteName).name || noteName;

export const getNoteFrequency = (noteName: string): number | null => Note.get(noteName).freq;
