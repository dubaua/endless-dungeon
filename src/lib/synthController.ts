import { createMemo, createSignal, onCleanup, type Accessor } from 'solid-js';
import { Note } from 'tonal';
import * as Tone from 'tone';

export interface SynthConfig {
  baseNote: string;
  intervals: readonly string[];
}

export interface SynthController {
  currentNote: Accessor<string>;
  playNext: () => Promise<void>;
}

export const createSynthController = ({ baseNote, intervals }: SynthConfig): SynthController => {
  const computedNotes = intervals
    .map((interval) => Note.transpose(baseNote, interval))
    .filter((note): note is string => Boolean(note));

  const fallbackNotes = computedNotes.length > 0 ? computedNotes : [baseNote];
  const noteCount = fallbackNotes.length;

  const [currentIndex, setCurrentIndex] = createSignal(0);
  const synth = new Tone.Synth().toDestination();

  const currentNote = createMemo<string>(() => fallbackNotes[currentIndex()], fallbackNotes[0]);

  const playNext = async (): Promise<void> => {
    await Tone.start();
    const note = currentNote();
    const now = Tone.now();
    synth.triggerAttackRelease(note, '8n', now);
    setCurrentIndex((index) => (index + 1) % noteCount);
  };

  onCleanup(() => {
    synth.dispose();
  });

  return {
    currentNote,
    playNext,
  };
};
