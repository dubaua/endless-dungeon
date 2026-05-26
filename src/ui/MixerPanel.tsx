import { For, onCleanup, onMount, type Component, type JSX } from 'solid-js';
import { createStore } from 'solid-js/store';

import { getMixerMeterLevel } from '../audio/mixer';
import { setMixerChannelState, useStore } from '../state/store';
import { clamp } from '../utils/clamp';

const formatVolume = (value: number): string => value.toFixed(2);

export const MixerPanel: Component = () => {
  const channels = useStore((state) => Object.values(state.mixer.channels));
  const [levels, setLevels] = createStore<Record<string, number>>({});
  let animationFrame = 0;

  onMount(() => {
    const tick = (): void => {
      channels().forEach((channel) => {
        setLevels(channel.id, getMixerMeterLevel(channel.id));
      });
      animationFrame = requestAnimationFrame(tick);
    };

    animationFrame = requestAnimationFrame(tick);
  });

  onCleanup(() => {
    cancelAnimationFrame(animationFrame);
  });

  const handleVolumeInput = (channelId: string): JSX.EventHandlerUnion<HTMLInputElement, InputEvent> => {
    return (event) => {
      const value = Number(event.currentTarget.value);

      if (Number.isFinite(value)) {
        setMixerChannelState(channelId, { volume: clamp(value, 0, 1) });
      }
    };
  };

  const handleMuteInput = (channelId: string): JSX.EventHandlerUnion<HTMLInputElement, Event> => {
    return (event) => {
      setMixerChannelState(channelId, { muted: event.currentTarget.checked });
    };
  };

  return (
    <section style={{ display: 'grid', gap: '0.85rem' }}>
      <header>
        <h2 style={{ margin: 0 }}>Mixer</h2>
      </header>

      <div style={{ display: 'flex', gap: '0.75rem', 'align-items': 'stretch', 'flex-wrap': 'wrap' }}>
        <For each={channels()}>
          {(channel) => {
            const level = (): number => levels[channel.id] ?? 0;

            return (
              <section
                style={{
                  width: '96px',
                  border: '1px solid #ddd',
                  'border-radius': '8px',
                  padding: '0.65rem',
                  display: 'grid',
                  gap: '0.55rem',
                  'justify-items': 'center',
                }}
              >
                <h3 style={{ margin: 0, 'font-size': '0.82rem', 'text-align': 'center' }}>{channel.name}</h3>

                <div style={{ display: 'flex', gap: '0.5rem', 'align-items': 'end', height: '170px' }}>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={channel.volume}
                    onInput={handleVolumeInput(channel.id)}
                    style={{
                      width: '28px',
                      height: '160px',
                      'writing-mode': 'vertical-lr',
                      direction: 'rtl',
                      'accent-color': '#16a34a',
                    }}
                  />
                  <div
                    style={{
                      width: '14px',
                      height: '160px',
                      border: '1px solid #cfcfcf',
                      'border-radius': '4px',
                      background: '#f5f5f5',
                      display: 'flex',
                      'align-items': 'end',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        height: `${Math.round(level() * 100)}%`,
                        background:
                          level() > 0.85
                            ? '#dc2626'
                            : level() > 0.65
                              ? '#f59e0b'
                              : '#22c55e',
                      }}
                    />
                  </div>
                </div>

                <span style={{ 'font-size': '0.75rem', color: '#555', 'font-variant-numeric': 'tabular-nums' }}>
                  {formatVolume(channel.volume)}
                </span>

                <label style={{ display: 'flex', gap: '0.35rem', 'align-items': 'center', 'font-size': '0.75rem' }}>
                  <input type="checkbox" checked={channel.muted} onInput={handleMuteInput(channel.id)} />
                  <span>Mute</span>
                </label>
              </section>
            );
          }}
        </For>
      </div>
    </section>
  );
};
