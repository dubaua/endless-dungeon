import type { Component, JSX } from 'solid-js';

import type { OscillatorType } from '../audio/tone-types';
import type { NoteSynthVoicing } from '../audio/synths/types';
import { setNoteSynthVoicing, useStore } from '../state/store';
import { clamp } from '../utils/clamp';

type SynthNumberKey = {
  [Key in keyof NoteSynthVoicing]: NoteSynthVoicing[Key] extends number ? Key : never;
}[keyof NoteSynthVoicing];

interface KnobProps {
  curve?: 'linear' | 'exponential';
  format?: (value: number) => string;
  inputStep?: number;
  label: string;
  mapPositionToValue?: (position: number) => number;
  max: number;
  min: number;
  snap?: (value: number) => number;
  unmapValueToPosition?: (value: number) => number;
  value: number;
  onInput: (value: number) => void;
}

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
const mapCrushDepthPosition = (position: number): number => 0.25 * ((16 ** clamp(position, 0, 1) - 1) / 15);
const unmapCrushDepthValue = (value: number): number => Math.log(clamp(value, 0, 0.25) / 0.25 * 15 + 1) / Math.log(16);

const Knob: Component<KnobProps> = (props) => {
  const handleInput: JSX.EventHandlerUnion<HTMLInputElement, InputEvent> = (event) => {
    const position = Number(event.currentTarget.value);
    if (Number.isFinite(position)) {
      const curve = props.curve ?? 'linear';
      const value = props.mapPositionToValue
        ? props.mapPositionToValue(position)
        : positionToValue(position, props.min, props.max, curve);
      props.onInput(props.snap ? props.snap(value) : value);
    }
  };

  const handleNumberInput: JSX.EventHandlerUnion<HTMLInputElement, InputEvent> = (event) => {
    const value = Number(event.currentTarget.value);
    if (Number.isFinite(value)) {
      props.onInput(props.snap ? props.snap(clamp(value, props.min, props.max)) : clamp(value, props.min, props.max));
    }
  };

  const position = (): number =>
    props.unmapValueToPosition
      ? props.unmapValueToPosition(props.value)
      : valueToPosition(props.value, props.min, props.max, props.curve ?? 'linear');
  const formattedValue = (): string => (props.format ? props.format(props.value) : String(props.value));

  return (
    <label
      style={{
        display: 'grid',
        gap: '0.45rem',
        'justify-items': 'center',
        'font-size': '0.8rem',
        'min-width': '72px',
      }}
    >
      <span style={{ 'font-weight': 600 }}>{props.label}</span>
      <input
        type="range"
        min="0"
        max="1"
        step="0.001"
        value={position()}
        onInput={handleInput}
        style={{
          width: '28px',
          height: '150px',
          'writing-mode': 'vertical-lr',
          direction: 'rtl',
          'accent-color': '#2563eb',
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
        style={{
          width: '72px',
          'box-sizing': 'border-box',
          'font-size': '0.75rem',
        }}
      />
    </label>
  );
};

const setNumber = (key: SynthNumberKey, value: number): void => {
  setNoteSynthVoicing('voice', { [key]: value });
};

export const SynthPanel: Component = () => {
  const synth = useStore((state) => state.voicing.voice);

  const handleOscillatorInput: JSX.EventHandlerUnion<HTMLSelectElement, Event> = (event) => {
    setNoteSynthVoicing('voice', { oscillatorType: event.currentTarget.value as OscillatorType });
  };

  return (
    <section style={{ display: 'flex', 'flex-direction': 'column', gap: '0.85rem' }}>
      <header>
        <h2 style={{ margin: 0 }}>Piano Voice</h2>
      </header>

      <label style={{ display: 'grid', gap: '0.3rem', 'font-size': '0.8rem', 'max-width': '220px' }}>
        <span>Oscillator</span>
        <select value={synth().oscillatorType} onInput={handleOscillatorInput}>
          <option value="sine">sine</option>
          <option value="triangle">triangle</option>
          <option value="sawtooth">saw</option>
          <option value="square">square</option>
        </select>
      </label>

      <div
        style={{
          display: 'flex',
          gap: '1.1rem',
          'align-items': 'end',
          'flex-wrap': 'wrap',
        }}
      >
        <Knob
          label="Attack"
          min={0.001}
          max={2}
          curve="exponential"
          format={formatSeconds}
          inputStep={0.001}
          value={synth().attack}
          onInput={(value) => setNumber('attack', value)}
        />
        <Knob
          label="Decay"
          min={0.001}
          max={2}
          curve="exponential"
          format={formatSeconds}
          inputStep={0.001}
          value={synth().decay}
          onInput={(value) => setNumber('decay', value)}
        />
        <Knob
          label="Sustain"
          min={0}
          max={1}
          format={formatNormal}
          inputStep={0.01}
          value={synth().sustain}
          onInput={(value) => setNumber('sustain', value)}
        />
        <Knob
          label="Release"
          min={0.001}
          max={3}
          curve="exponential"
          format={formatSeconds}
          inputStep={0.001}
          value={synth().release}
          onInput={(value) => setNumber('release', value)}
        />
        <Knob
          label="Filter freq"
          min={80}
          max={12000}
          curve="exponential"
          format={formatHz}
          inputStep={1}
          snap={Math.round}
          value={synth().filterFrequency}
          onInput={(value) => setNumber('filterFrequency', value)}
        />
        <Knob
          label="Filter reso"
          min={0.1}
          max={18}
          curve="exponential"
          format={(value) => value.toFixed(1)}
          inputStep={0.1}
          value={synth().filterResonance}
          onInput={(value) => setNumber('filterResonance', value)}
        />
        <Knob
          label="Bit depth"
          min={1}
          max={16}
          format={(value) => String(value)}
          inputStep={1}
          snap={Math.round}
          value={synth().bitCrusherBits}
          onInput={(value) => setNumber('bitCrusherBits', value)}
        />
        <Knob
          label="Crush depth"
          min={0}
          max={0.25}
          format={(value) => value.toFixed(4)}
          inputStep={0.001}
          mapPositionToValue={mapCrushDepthPosition}
          unmapValueToPosition={unmapCrushDepthValue}
          value={synth().bitCrusherDepth}
          onInput={(value) => setNumber('bitCrusherDepth', value)}
        />
      </div>
    </section>
  );
};
