import { createSignal, onCleanup } from 'solid-js';
import type { Component } from 'solid-js';
import { Note } from 'tonal';
import * as Tone from 'tone';

const baseNote = 'C4';
const intervals = ['1P', '3M', '5P'] as const;
const chordNotes = intervals
  .map((interval) => Note.transpose(baseNote, interval))
  .filter((note): note is string => Boolean(note));

const App: Component = () => {
  const [currentNoteIndex, setCurrentNoteIndex] = createSignal(0);
  const synth = new Tone.Synth().toDestination();

  const playNote = async (): Promise<void> => {
    const note = chordNotes[currentNoteIndex()];
    if (!note) {
      return;
    }

    await Tone.start();
    const now = Tone.now();
    synth.triggerAttackRelease(note, '8n', now);
    setCurrentNoteIndex((index) => (index + 1) % chordNotes.length);
  };

  onCleanup(() => {
    synth.dispose();
  });

  const handleClick = (): void => {
    void playNote();
  };

  return (
    <main>
      <h1>Endless Dungeon Synth</h1>
      <p>
        Click the button to cycle through a simple triad built from {baseNote} using Tonal helpers.
      </p>
      <button type="button" onClick={handleClick}>
        Play {chordNotes[currentNoteIndex()]}
      </button>
    </main>
  );
};

export default App;
