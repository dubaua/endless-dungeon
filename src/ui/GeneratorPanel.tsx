import type { Component } from 'solid-js';

import { useStore } from '../state/store';

export const GeneratorPanel: Component = () => {
  const melodic = useStore((state) => state.generators.melodic);

  return (
    <section style={{ display: 'flex', 'flex-direction': 'column', gap: '0.5rem' }}>
      <h2 style={{ margin: 0 }}>Melodic LFO</h2>
      <dl style={{ display: 'grid', 'grid-template-columns': 'auto auto', gap: '0.25rem', margin: 0 }}>
        <dt>Value</dt>
        <dd>{melodic().value.toFixed(3)}</dd>
        <dt>Inverted</dt>
        <dd>{melodic().inverted.toFixed(3)}</dd>
      </dl>
    </section>
  );
};
