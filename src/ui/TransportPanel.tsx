import type { Component, JSX } from 'solid-js';

import { emit } from '../events';
import { setTransportBpm, useStore } from '../state/store';

export const TransportPanel: Component = () => {
  const transport = useStore((state) => state.transport);

  const handleToggle = (): void => {
    emit('audio/resume', undefined);
    emit('transport/toggle', undefined);
  };

  const handlePlay = (): void => {
    emit('audio/resume', undefined);
    emit('transport/play', undefined);
  };

  const handlePause = (): void => {
    emit('transport/pause', undefined);
  };

  const handleBpmInput: JSX.EventHandlerUnion<HTMLInputElement, InputEvent> = (event) => {
    const nextBpm = Number(event.currentTarget.value);
    if (Number.isFinite(nextBpm)) {
      setTransportBpm(nextBpm);
    }
  };

  return (
    <section style={{ display: 'flex', 'flex-direction': 'column', gap: '0.75rem' }}>
      <header style={{ display: 'flex', gap: '0.5rem' }}>
        <button type="button" onClick={handlePlay}>
          Play
        </button>
        <button type="button" onClick={handlePause}>
          Pause
        </button>
        <button type="button" onClick={handleToggle}>
          {transport().isPlaying ? 'Toggle (Stop)' : 'Toggle (Start)'}
        </button>
      </header>
      <div style={{ display: 'flex', 'align-items': 'center', gap: '0.5rem' }}>
        <label for="transport-bpm" style={{ 'font-weight': 600 }}>
          BPM
        </label>
        <input
          id="transport-bpm"
          type="number"
          min="20"
          max="300"
          step="1"
          value={transport().bpm}
          onInput={handleBpmInput}
        />
      </div>
      <dl style={{ display: 'grid', gap: '0.25rem', 'grid-template-columns': 'auto auto', margin: 0 }}>
        <dt>Playing</dt>
        <dd>{transport().isPlaying ? 'yes' : 'no'}</dd>
        <dt>Bar</dt>
        <dd>{transport().bar + 1}</dd>
        <dt>Beat</dt>
        <dd>{transport().beat + 1}</dd>
        <dt>Sixteenth</dt>
        <dd>{transport().sixteenth + 1}</dd>
        <dt>Step</dt>
        <dd>{transport().step + 1}</dd>
      </dl>
    </section>
  );
};
