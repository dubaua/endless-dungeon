import type { Component, JSX } from 'solid-js';

import type { NoteSynthId, NoteSynthVoicing } from '../../audio/synths/types';
import type { OscillatorType } from '../../audio/tone-types';
import { setNoteSynthVoicing, useStore } from '../../state/store';
import { Section } from './Section';
import { Slider } from './Slider';
import { SliderRow } from './SliderRow';
import {
  formatHz,
  formatNormal,
  formatSeconds,
  mapCrushDepthPosition,
  unmapCrushDepthValue,
} from './slider-utils';

type NoteNumberKey = {
  [Key in keyof NoteSynthVoicing]: NoteSynthVoicing[Key] extends number ? Key : never;
}[keyof NoteSynthVoicing];

export const NoteSynthControls: Component<{ synthId: NoteSynthId; title: string }> = (props) => {
  const synth = useStore((state) => state.voicing[props.synthId]);

  const setNumber = (key: NoteNumberKey, value: number): void => {
    setNoteSynthVoicing(props.synthId, { [key]: value });
  };

  const handleOscillatorInput: JSX.EventHandlerUnion<HTMLSelectElement, Event> = (event) => {
    setNoteSynthVoicing(props.synthId, {
      oscillatorType: event.currentTarget.value as OscillatorType,
    });
  };

  return (
    <Section title={props.title}>
      <label style={{ display: 'grid', gap: '0.3rem', 'font-size': '0.8rem', 'max-width': '180px' }}>
        <span>Osc</span>
        <select value={synth().oscillatorType} onInput={handleOscillatorInput}>
          <option value="sine">sine</option>
          <option value="triangle">triangle</option>
          <option value="sawtooth">saw</option>
          <option value="square">square</option>
        </select>
      </label>

      <SliderRow>
        <Slider
          label="A"
          min={0.001}
          max={2}
          curve="exponential"
          format={formatSeconds}
          value={synth().attack}
          onInput={(value) => setNumber('attack', value)}
        />
        <Slider
          label="D"
          min={0.001}
          max={2}
          curve="exponential"
          format={formatSeconds}
          value={synth().decay}
          onInput={(value) => setNumber('decay', value)}
        />
        <Slider
          label="S"
          min={0}
          max={1}
          format={formatNormal}
          value={synth().sustain}
          onInput={(value) => setNumber('sustain', value)}
        />
        <Slider
          label="R"
          min={0.001}
          max={3}
          curve="exponential"
          format={formatSeconds}
          value={synth().release}
          onInput={(value) => setNumber('release', value)}
        />
        <Slider
          label="Freq"
          min={80}
          max={12000}
          curve="exponential"
          format={formatHz}
          snap={Math.round}
          value={synth().filterFrequency}
          onInput={(value) => setNumber('filterFrequency', value)}
        />
        <Slider
          label="Reso"
          min={0.1}
          max={18}
          curve="exponential"
          format={(value) => value.toFixed(1)}
          value={synth().filterResonance}
          onInput={(value) => setNumber('filterResonance', value)}
        />
        <Slider
          label="Bits"
          min={1}
          max={16}
          format={(value) => String(value)}
          snap={Math.round}
          value={synth().bitCrusherBits}
          onInput={(value) => setNumber('bitCrusherBits', value)}
        />
        <Slider
          label="Depth"
          min={0}
          max={0.25}
          format={(value) => value.toFixed(4)}
          mapPositionToValue={mapCrushDepthPosition}
          unmapValueToPosition={unmapCrushDepthValue}
          value={synth().bitCrusherDepth}
          onInput={(value) => setNumber('bitCrusherDepth', value)}
        />
      </SliderRow>
    </Section>
  );
};
