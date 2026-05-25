import type { Component } from 'solid-js';

import { DEFAULT_CLIP_LENGTH_TICKS, PPQ, ticksToBars } from '../sequencer';
import { useStore } from '../state/store';
import { SequencerView } from './sequencer/SequencerView';

export const SequencerPanel: Component = () => {
  const sequencer = useStore((state) => state.sequencer);
  const transport = useStore((state) => state.transport);

  return (
    <section style={{ display: 'flex', 'flex-direction': 'column', gap: '1rem' }}>
      <header>
        <h2 style={{ margin: 0 }}>Sequencer</h2>
        <p style={{ margin: '0.25rem 0 0', color: '#555' }}>
          PPQ {PPQ}, default clip {ticksToBars(DEFAULT_CLIP_LENGTH_TICKS)} bars, tick {transport().currentTick}.
        </p>
      </header>

      <SequencerView
        currentTick={transport().currentTick}
        isPlaying={transport().isPlaying}
        tracks={sequencer().tracks}
        totalTicks={DEFAULT_CLIP_LENGTH_TICKS}
      />
    </section>
  );
};
