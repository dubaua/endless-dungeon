import { For, type Component } from 'solid-js';

import { DEFAULT_CLIP_LENGTH_TICKS, getPatternLengthTicks, PPQ, ticksToBars } from '../sequencer';
import { useStore } from '../state/store';

export const SequencerPanel: Component = () => {
  const sequencer = useStore((state) => state.sequencer);
  const transport = useStore((state) => state.transport);

  return (
    <section style={{ display: 'flex', 'flex-direction': 'column', gap: '1rem' }}>
      <header>
        <h2 style={{ margin: 0 }}>Sequencer</h2>
        <p style={{ margin: '0.25rem 0 0', color: '#555' }}>
          PPQ {PPQ}, default clip {ticksToBars(DEFAULT_CLIP_LENGTH_TICKS)} bars, tick{' '}
          {transport().currentTick}.
        </p>
      </header>

      <div style={{ display: 'grid', gap: '0.75rem' }}>
        <For each={sequencer().tracks}>
          {(track) => (
            <section style={{ display: 'grid', gap: '0.5rem' }}>
              <h3 style={{ margin: 0 }}>{track.name}</h3>
              <For each={track.clips}>
                {(clip) => (
                  <pre
                    style={{
                      margin: 0,
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      'border-radius': '8px',
                      overflow: 'auto',
                      background: '#f7f7f7',
                    }}
                  >
                    {JSON.stringify(
                      {
                        id: clip.id,
                        gatePercent: clip.gatePercent,
                        lengthTicks: getPatternLengthTicks(clip),
                        pattern: clip.pattern,
                      },
                      null,
                      2,
                    )}
                  </pre>
                )}
              </For>
            </section>
          )}
        </For>
        <section style={{ display: 'grid', gap: '0.5rem' }}>
          <h3 style={{ margin: 0 }}>Drum Channels</h3>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <For each={sequencer().drumChannels}>
              {(channel) => (
                <pre
                  style={{
                    margin: 0,
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    'border-radius': '8px',
                    overflow: 'auto',
                    background: '#f7f7f7',
                  }}
                >
                  {JSON.stringify(
                    {
                      id: channel.id,
                      voice: channel.voice,
                      outputChannelId: channel.outputChannelId,
                      groupId: channel.groupId,
                      voicing: channel.voicing,
                      pattern: channel.pattern,
                    },
                    null,
                    2,
                  )}
                </pre>
              )}
            </For>
          </div>
        </section>
      </div>
    </section>
  );
};
