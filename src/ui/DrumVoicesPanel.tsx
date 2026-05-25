import { For, Show, type Component, type JSX } from 'solid-js';

import {
  setMixerChannelState,
  setDrumVoiceState,
  type DrumVoiceState,
  useStore,
} from '../state/store';
import type { DrumVoiceKey } from '../sequencer';

type DrumNumberKey = {
  [Key in keyof DrumVoiceState]: DrumVoiceState[Key] extends number ? Key : never;
}[keyof DrumVoiceState];

interface DrumKnobProps {
  curve?: 'linear' | 'exponential';
  format?: (value: number) => string;
  inputStep?: number;
  label: string;
  max: number;
  min: number;
  snap?: (value: number) => number;
  value: number;
  onInput: (value: number) => void;
}

const clamp = (value: number, min: number, max: number): number => Math.max(min, Math.min(max, value));

const positionToValue = (position: number, min: number, max: number, curve: 'linear' | 'exponential'): number => {
  const clampedPosition = clamp(position, 0, 1);

  if (curve === 'exponential') {
    return min * (max / min) ** clampedPosition;
  }

  return min + (max - min) * clampedPosition;
};

const valueToPosition = (value: number, min: number, max: number, curve: 'linear' | 'exponential'): number => {
  const clampedValue = clamp(value, min, max);

  if (curve === 'exponential') {
    return Math.log(clampedValue / min) / Math.log(max / min);
  }

  return (clampedValue - min) / (max - min);
};

const formatSeconds = (value: number): string => `${value.toFixed(3)}s`;
const formatNormal = (value: number): string => value.toFixed(2);
const formatHz = (value: number): string => `${Math.round(value)}Hz`;

const DrumKnob: Component<DrumKnobProps> = (props) => {
  const handleSliderInput: JSX.EventHandlerUnion<HTMLInputElement, InputEvent> = (event) => {
    const position = Number(event.currentTarget.value);
    if (Number.isFinite(position)) {
      const value = positionToValue(position, props.min, props.max, props.curve ?? 'linear');
      props.onInput(props.snap ? props.snap(value) : value);
    }
  };

  const handleNumberInput: JSX.EventHandlerUnion<HTMLInputElement, InputEvent> = (event) => {
    const value = Number(event.currentTarget.value);
    if (Number.isFinite(value)) {
      props.onInput(props.snap ? props.snap(clamp(value, props.min, props.max)) : clamp(value, props.min, props.max));
    }
  };

  const position = (): number => valueToPosition(props.value, props.min, props.max, props.curve ?? 'linear');
  const formattedValue = (): string => (props.format ? props.format(props.value) : String(props.value));

  return (
    <label style={{ display: 'grid', gap: '0.35rem', 'justify-items': 'center', 'font-size': '0.75rem' }}>
      <span style={{ 'font-weight': 600 }}>{props.label}</span>
      <input
        type="range"
        min="0"
        max="1"
        step="0.001"
        value={position()}
        onInput={handleSliderInput}
        style={{
          width: '28px',
          height: '130px',
          'writing-mode': 'vertical-lr',
          direction: 'rtl',
          'accent-color': '#7c3aed',
        }}
      />
      <span style={{ color: '#555', 'font-variant-numeric': 'tabular-nums' }}>{formattedValue()}</span>
      <input
        type="number"
        min={props.min}
        max={props.max}
        step={props.inputStep ?? 0.01}
        value={props.value}
        onInput={handleNumberInput}
        style={{ width: '70px', 'box-sizing': 'border-box', 'font-size': '0.72rem' }}
      />
    </label>
  );
};

export const DrumVoicesPanel: Component = () => {
  const drumVoices = useStore((state) => state.drumVoices);
  const drumChannels = useStore((state) => state.sequencer.drumChannels);
  const mixerChannels = useStore((state) => state.mixer.channels);

  const setNumber = (voice: DrumVoiceKey, key: DrumNumberKey, value: number): void => {
    setDrumVoiceState(voice, { [key]: value });
  };

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
    <section style={{ display: 'flex', 'flex-direction': 'column', gap: '1rem' }}>
      <header>
        <h2 style={{ margin: 0 }}>Drum Voices</h2>
      </header>

      <div style={{ display: 'grid', gap: '1rem' }}>
        <For each={drumChannels()}>
          {(channel) => {
            const settings = (): DrumVoiceState => drumVoices()[channel.voice];
            const mixer = () => mixerChannels()[channel.outputChannelId];

            return (
              <section
                style={{
                  border: '1px solid #ddd',
                  'border-radius': '8px',
                  padding: '0.85rem',
                  display: 'grid',
                  gap: '0.85rem',
                }}
              >
                <header>
                  <h3 style={{ margin: 0 }}>{channel.name}</h3>
                  <div style={{ color: '#666', 'font-size': '0.78rem' }}>
                    {channel.outputChannelId} / {channel.groupId ?? 'no group'}
                  </div>
                </header>

                <div style={{ display: 'flex', gap: '0.75rem', 'flex-wrap': 'wrap' }}>
                  <label
                    style={{
                      display: 'flex',
                      gap: '0.4rem',
                      'align-items': 'center',
                      'font-size': '0.78rem',
                      'font-weight': 600,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={mixer()?.muted ?? false}
                      onInput={handleMuteInput(channel.outputChannelId)}
                    />
                    <span>Mute</span>
                  </label>
                  <label style={{ display: 'grid', gap: '0.3rem', 'font-size': '0.78rem', width: '150px' }}>
                    <span>Channel volume {formatNormal(mixer()?.volume ?? 1)}</span>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={mixer()?.volume ?? 1}
                      onInput={handleVolumeInput(channel.outputChannelId)}
                    />
                  </label>
                </div>

                <div style={{ display: 'flex', gap: '1rem', 'align-items': 'end', 'flex-wrap': 'wrap' }}>
                  <DrumKnob
                    label="Decay"
                    min={0.001}
                    max={2}
                    curve="exponential"
                    format={formatSeconds}
                    inputStep={0.001}
                    value={settings().decay}
                    onInput={(value) => setNumber(channel.voice, 'decay', value)}
                  />
                  <Show when={channel.voice === 'openHat' || channel.voice === 'crash'}>
                    <DrumKnob
                      label="Release"
                      min={0.001}
                      max={3}
                      curve="exponential"
                      format={formatSeconds}
                      inputStep={0.001}
                      value={settings().release}
                      onInput={(value) => setNumber(channel.voice, 'release', value)}
                    />
                  </Show>
                  <DrumKnob
                    label="Filter freq"
                    min={60}
                    max={14000}
                    curve="exponential"
                    format={formatHz}
                    inputStep={1}
                    snap={Math.round}
                    value={settings().filterFrequency}
                    onInput={(value) => setNumber(channel.voice, 'filterFrequency', value)}
                  />
                  <DrumKnob
                    label="Filter reso"
                    min={0.1}
                    max={18}
                    curve="exponential"
                    format={(value) => value.toFixed(1)}
                    inputStep={0.1}
                    value={settings().filterResonance}
                    onInput={(value) => setNumber(channel.voice, 'filterResonance', value)}
                  />
                  <DrumKnob
                    label="Bit depth"
                    min={1}
                    max={4}
                    format={(value) => String(value)}
                    inputStep={1}
                    snap={Math.round}
                    value={settings().bitCrusherBits}
                    onInput={(value) => setNumber(channel.voice, 'bitCrusherBits', value)}
                  />
                  <DrumKnob
                    label="Crush depth"
                    min={0}
                    max={0.25}
                    format={(value) => value.toFixed(4)}
                    inputStep={0.001}
                    value={settings().bitCrusherDepth}
                    onInput={(value) => setNumber(channel.voice, 'bitCrusherDepth', value)}
                  />
                </div>
              </section>
            );
          }}
        </For>
      </div>
    </section>
  );
};
