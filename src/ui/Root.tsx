import type { Component } from 'solid-js';

import { DrumVoicesPanel } from './DrumVoicesPanel';
import { SequencerPanel } from './SequencerPanel';
import { SynthPanel } from './SynthPanel';
import { TransportPanel } from './TransportPanel';

export const Root: Component = () => {
  return (
    <div style={{ padding: '2rem', display: 'flex', 'flex-direction': 'column', gap: '1.5rem' }}>
      <h1 style={{ margin: 0 }}>Endless Dungeon Audio Playground</h1>
      <TransportPanel />
      <SynthPanel />
      <DrumVoicesPanel />
      <SequencerPanel />
    </div>
  );
};
