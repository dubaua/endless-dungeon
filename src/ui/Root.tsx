import { Match, Switch, type Component } from 'solid-js';

import { DrumsRoute } from '@ui/DrumsRoute';
import { GeneratorPanel } from '@ui/GeneratorPanel';
import { MixerPanel } from '@ui/MixerPanel';
import { PlayerPanel } from '@ui/PlayerPanel';
import { SynthPanel } from '@ui/SynthPanel';
import { TransportPanel } from '@ui/TransportPanel';

export const Root: Component = () => {
  return (
    <Switch>
      <Match when={window.location.pathname === '/drums'}>
        <DrumsRoute />
      </Match>
      <Match when>
        <div style={{ display: 'flex', 'flex-direction': 'column', gap: '1.5rem' }}>
          <header style={{ display: 'flex', 'align-items': 'center', gap: '0.75rem' }}>
            <h1 style={{ margin: 0 }}>Endless Dungeon Audio Playground</h1>
            <a href="/drums">Drums</a>
          </header>
          <TransportPanel />
          <GeneratorPanel />
          <PlayerPanel />
          <SynthPanel />
          <MixerPanel />
        </div>
      </Match>
    </Switch>
  );
};
