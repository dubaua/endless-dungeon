import { For, Show, type Component, type JSX } from 'solid-js';

import {
  CLOSED_HAT_BITS_MAX,
  CLOSED_HAT_BITS_MIN,
  CLOSED_HAT_DECAY_MAX,
  CLOSED_HAT_DECAY_MIN,
  CLOSED_HAT_DEPTH_MAX,
  CLOSED_HAT_DEPTH_MIN,
} from '../audio/graph/drums/closedHat';
import {
  CRASH_BITS_MAX,
  CRASH_BITS_MIN,
  CRASH_DECAY_MAX,
  CRASH_DECAY_MIN,
  CRASH_DEPTH_MAX,
  CRASH_DEPTH_MIN,
  CRASH_RELEASE_MAX,
  CRASH_RELEASE_MIN,
} from '../audio/graph/drums/crash';
import {
  KICK_BITS_MAX,
  KICK_BITS_MIN,
  KICK_DECAY_MAX,
  KICK_DECAY_MIN,
  KICK_DEPTH_MAX,
  KICK_DEPTH_MIN,
  KICK_FILTER_FREQUENCY_MAX,
  KICK_FILTER_FREQUENCY_MIN,
  KICK_FILTER_RESONANCE_MAX,
  KICK_FILTER_RESONANCE_MIN,
} from '../audio/graph/drums/kick';
import {
  OPEN_HAT_BITS_MAX,
  OPEN_HAT_BITS_MIN,
  OPEN_HAT_DECAY_MAX,
  OPEN_HAT_DECAY_MIN,
  OPEN_HAT_DEPTH_MAX,
  OPEN_HAT_DEPTH_MIN,
  OPEN_HAT_FILTER_FREQUENCY_MAX,
  OPEN_HAT_FILTER_FREQUENCY_MIN,
  OPEN_HAT_FILTER_RESONANCE_MAX,
  OPEN_HAT_FILTER_RESONANCE_MIN,
  OPEN_HAT_RELEASE_MAX,
  OPEN_HAT_RELEASE_MIN,
} from '../audio/graph/drums/openHat';
import {
  SNARE_BITS_MAX,
  SNARE_BITS_MIN,
  SNARE_DEPTH_MAX,
  SNARE_DEPTH_MIN,
} from '../audio/graph/drums/snare';
import { setMixerChannelState, setDrumChannelVoicing, useStore } from '../state/store';
import type { DrumVoiceKey, DrumVoicing, DrumVoicingKey } from '../sequencer';

interface DrumControlRange {
  key: DrumVoicingKey;
  max: number;
  min: number;
}

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

const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

const positionToValue = (
  position: number,
  min: number,
  max: number,
  curve: 'linear' | 'exponential',
): number => {
  const clampedPosition = clamp(position, 0, 1);

  if (curve === 'exponential') {
    return min * (max / min) ** clampedPosition;
  }

  return min + (max - min) * clampedPosition;
};

const valueToPosition = (
  value: number,
  min: number,
  max: number,
  curve: 'linear' | 'exponential',
): number => {
  const clampedValue = clamp(value, min, max);

  if (curve === 'exponential') {
    return Math.log(clampedValue / min) / Math.log(max / min);
  }

  return (clampedValue - min) / (max - min);
};

const formatSeconds = (value: number): string => `${value.toFixed(3)}s`;
const formatNormal = (value: number): string => value.toFixed(2);
const formatHz = (value: number): string => `${Math.round(value)}Hz`;
const DRUM_CONTROL_LABELS: Record<DrumVoicingKey, string> = {
  decay: 'Decay',
  release: 'Release',
  filterFrequency: 'Filter freq',
  filterResonance: 'Filter reso',
  bitCrusherBits: 'Bit depth',
  bitCrusherDepth: 'Crush depth',
};

const getControlCurve = (key: DrumVoicingKey): 'linear' | 'exponential' | undefined => {
  if (
    key === 'decay' ||
    key === 'release' ||
    key === 'filterFrequency' ||
    key === 'filterResonance'
  ) {
    return 'exponential';
  }

  return undefined;
};

const getControlFormat = (key: DrumVoicingKey): ((value: number) => string) | undefined => {
  if (key === 'decay' || key === 'release') {
    return formatSeconds;
  }

  if (key === 'filterFrequency') {
    return formatHz;
  }

  if (key === 'filterResonance') {
    return (value) => value.toFixed(1);
  }

  if (key === 'bitCrusherBits') {
    return (value) => String(Math.round(value));
  }

  if (key === 'bitCrusherDepth') {
    return (value) => value.toFixed(4);
  }

  return undefined;
};

const getControlStep = (key: DrumVoicingKey): number => {
  if (key === 'bitCrusherBits' || key === 'filterFrequency') {
    return 1;
  }

  if (key === 'filterResonance') {
    return 0.1;
  }

  if (key === 'decay' || key === 'release' || key === 'bitCrusherDepth') {
    return 0.001;
  }

  return 0.01;
};

const getControlSnap = (key: DrumVoicingKey): ((value: number) => number) | undefined => {
  if (key === 'bitCrusherBits' || key === 'filterFrequency') {
    return Math.round;
  }

  return undefined;
};

const getDrumControls = (voice: DrumVoiceKey): DrumControlRange[] => {
  if (voice === 'kick') {
    return [
      { key: 'decay', min: KICK_DECAY_MIN, max: KICK_DECAY_MAX },
      { key: 'filterFrequency', min: KICK_FILTER_FREQUENCY_MIN, max: KICK_FILTER_FREQUENCY_MAX },
      { key: 'filterResonance', min: KICK_FILTER_RESONANCE_MIN, max: KICK_FILTER_RESONANCE_MAX },
      { key: 'bitCrusherBits', min: KICK_BITS_MIN, max: KICK_BITS_MAX },
      { key: 'bitCrusherDepth', min: KICK_DEPTH_MIN, max: KICK_DEPTH_MAX },
    ];
  }

  if (voice === 'snare') {
    return [
      { key: 'bitCrusherBits', min: SNARE_BITS_MIN, max: SNARE_BITS_MAX },
      { key: 'bitCrusherDepth', min: SNARE_DEPTH_MIN, max: SNARE_DEPTH_MAX },
    ];
  }

  if (voice === 'closedHat') {
    return [
      { key: 'decay', min: CLOSED_HAT_DECAY_MIN, max: CLOSED_HAT_DECAY_MAX },
      { key: 'bitCrusherBits', min: CLOSED_HAT_BITS_MIN, max: CLOSED_HAT_BITS_MAX },
      { key: 'bitCrusherDepth', min: CLOSED_HAT_DEPTH_MIN, max: CLOSED_HAT_DEPTH_MAX },
    ];
  }

  if (voice === 'openHat') {
    return [
      { key: 'decay', min: OPEN_HAT_DECAY_MIN, max: OPEN_HAT_DECAY_MAX },
      { key: 'release', min: OPEN_HAT_RELEASE_MIN, max: OPEN_HAT_RELEASE_MAX },
      { key: 'filterFrequency', min: OPEN_HAT_FILTER_FREQUENCY_MIN, max: OPEN_HAT_FILTER_FREQUENCY_MAX },
      { key: 'filterResonance', min: OPEN_HAT_FILTER_RESONANCE_MIN, max: OPEN_HAT_FILTER_RESONANCE_MAX },
      { key: 'bitCrusherBits', min: OPEN_HAT_BITS_MIN, max: OPEN_HAT_BITS_MAX },
      { key: 'bitCrusherDepth', min: OPEN_HAT_DEPTH_MIN, max: OPEN_HAT_DEPTH_MAX },
    ];
  }

  return [
    { key: 'decay', min: CRASH_DECAY_MIN, max: CRASH_DECAY_MAX },
    { key: 'release', min: CRASH_RELEASE_MIN, max: CRASH_RELEASE_MAX },
    { key: 'bitCrusherBits', min: CRASH_BITS_MIN, max: CRASH_BITS_MAX },
    { key: 'bitCrusherDepth', min: CRASH_DEPTH_MIN, max: CRASH_DEPTH_MAX },
  ];
};

const getVoicingValue = (voicing: DrumVoicing, key: DrumVoicingKey): number => {
  return (voicing as Record<DrumVoicingKey, number>)[key];
};

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
      props.onInput(
        props.snap
          ? props.snap(clamp(value, props.min, props.max))
          : clamp(value, props.min, props.max),
      );
    }
  };

  const position = (): number =>
    valueToPosition(props.value, props.min, props.max, props.curve ?? 'linear');
  const formattedValue = (): string =>
    props.format ? props.format(props.value) : String(props.value);

  return (
    <label
      style={{ display: 'grid', gap: '0.35rem', 'justify-items': 'center', 'font-size': '0.75rem' }}
    >
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
      <span style={{ color: '#555', 'font-variant-numeric': 'tabular-nums' }}>
        {formattedValue()}
      </span>
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
  const drumChannels = useStore((state) => state.sequencer.drumChannels);
  const mixerChannels = useStore((state) => state.mixer.channels);

  const setNumber = (channelId: string, key: DrumVoicingKey, value: number): void => {
    setDrumChannelVoicing(channelId, { [key]: value });
  };

  const handleVolumeInput = (
    channelId: string,
  ): JSX.EventHandlerUnion<HTMLInputElement, InputEvent> => {
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
            const voicing = (): DrumVoicing => channel.voicing;
            const mixer = () => mixerChannels()[channel.outputChannelId];
            const controls = (): DrumControlRange[] => getDrumControls(channel.voice);

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
                  <label
                    style={{
                      display: 'grid',
                      gap: '0.3rem',
                      'font-size': '0.78rem',
                      width: '150px',
                    }}
                  >
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

                <div
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    'align-items': 'end',
                    'flex-wrap': 'wrap',
                  }}
                >
                  <For each={controls()}>
                    {(control) => (
                      <DrumKnob
                        label={DRUM_CONTROL_LABELS[control.key]}
                        min={control.min}
                        max={control.max}
                        curve={getControlCurve(control.key)}
                        format={getControlFormat(control.key)}
                        inputStep={getControlStep(control.key)}
                        snap={getControlSnap(control.key)}
                        value={getVoicingValue(voicing(), control.key)}
                        onInput={(value) => setNumber(channel.id, control.key, value)}
                      />
                    )}
                  </For>
                  <Show when={controls().length === 0}>
                    <span style={{ color: '#666', 'font-size': '0.78rem' }}>
                      No voicing controls
                    </span>
                  </Show>
                </div>
              </section>
            );
          }}
        </For>
      </div>
    </section>
  );
};
