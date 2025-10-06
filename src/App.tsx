import { onCleanup, type Component, type JSX } from 'solid-js';

import { createLFOController } from './lib/lfoController';
import { createSynthController } from './lib/synthController';

const baseNote = 'C4';
const intervals = ['1P', '3M', '5P'] as const;
const minPeriodSeconds = 0.5;
const maxPeriodSeconds = 4;

const App: Component = () => {
  const { currentNote, playNext, synth } = createSynthController({
    baseNote,
    intervals,
  });

  const lfoController = createLFOController({
    minPeriodSeconds,
    maxPeriodSeconds,
    initialPeriodSeconds: 1,
    type: 'sine',
  });

  lfoController.lfo.min = -25;
  lfoController.lfo.max = 25;
  lfoController.lfo.connect(synth.detune);

  onCleanup(() => {
    lfoController.lfo.disconnect();
  });

  const handleClick = (): void => {
    void playNext();
  };

  const handleSliderInput: JSX.EventHandlerUnion<HTMLInputElement, InputEvent> = (event) => {
    const target = event.currentTarget;
    const nextPeriod = Number(target.value);
    if (Number.isNaN(nextPeriod)) {
      return;
    }

    lfoController.setPeriodSeconds(nextPeriod);
  };

  return (
    <main style={{ display: 'flex', 'flex-direction': 'column', gap: '1.5rem', 'align-items': 'flex-start' }}>
      <section style={{ display: 'flex', 'flex-direction': 'column', gap: '0.5rem' }}>
        <h1>Endless Dungeon Synth</h1>
        <p>
          Click the button to cycle through a simple triad built from {baseNote} using Tonal helpers.
        </p>
        <button type="button" onClick={handleClick}>
          Play {currentNote()}
        </button>
      </section>

      <section style={{ display: 'flex', 'align-items': 'center', gap: '1rem' }}>
        <div style={{ display: 'flex', 'flex-direction': 'column', 'align-items': 'center', gap: '0.5rem' }}>
          <label for="lfo-period" style={{ 'font-weight': 600 }}>
            LFO Period (seconds)
          </label>
          <input
            id="lfo-period"
            type="range"
            min={minPeriodSeconds}
            max={maxPeriodSeconds}
            step={0.1}
            value={lfoController.periodSeconds()}
            onInput={handleSliderInput}
            style={{
              appearance: 'slider-vertical',
              width: '2.5rem',
              height: '200px',
            }}
          />
        </div>
        <div>
          <p style={{ margin: 0 }}>
            Current period: {lfoController.periodSeconds().toFixed(1)}s
          </p>
          <p style={{ margin: 0 }}>
            Frequency: {lfoController.frequencyHz().toFixed(2)} Hz
          </p>
        </div>
      </section>
    </main>
  );
};

export default App;
