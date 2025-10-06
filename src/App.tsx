import type { Component } from 'solid-js';

import { createSynthController } from './lib/synthController';

const baseNote = 'C4';
const intervals = ['1P', '3M', '5P'] as const;

const App: Component = () => {
  const { currentNote, playNext } = createSynthController({
    baseNote,
    intervals,
  });

  const handleClick = (): void => {
    void playNext();
  };

  return (
    <main>
      <h1>Endless Dungeon Synth</h1>
      <p>
        Click the button to cycle through a simple triad built from {baseNote} using Tonal helpers.
      </p>
      <button type="button" onClick={handleClick}>
        Play {currentNote()}
      </button>
    </main>
  );
};

export default App;
