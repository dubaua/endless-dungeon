import { Match, Switch, type Component } from 'solid-js';

import { DrumNewRoute } from './DrumNewRoute';
import { DrumsRoute } from './DrumsRoute';
import { GeneratorPanel } from './GeneratorPanel';
import { MixerPanel } from './MixerPanel';
import { SynthPanel } from './SynthPanel';
import { TransportPanel } from './TransportPanel';

export const Root: Component = () => {
  return (
    <Switch>
      <Match when={window.location.pathname === '/drums'}>
        <DrumsRoute />
      </Match>
      <Match when={window.location.pathname === '/drum-new'}>
        <DrumNewRoute />
      </Match>
      <Match when>
        <div style={{ display: 'flex', 'flex-direction': 'column', gap: '1.5rem' }}>
          <header style={{ display: 'flex', 'align-items': 'center', gap: '0.75rem' }}>
            <h1 style={{ margin: 0 }}>Endless Dungeon Audio Playground</h1>
            <a href="/drums">Drums</a>
            <a href="/drum-new">Drum New</a>
          </header>
          <TransportPanel />
          <GeneratorPanel />
          <SynthPanel />
          <MixerPanel />
        </div>
      </Match>
    </Switch>
  );
};
