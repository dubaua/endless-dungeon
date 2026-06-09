import { For, type Component, type JSX } from 'solid-js';

import type { NoteSynthId, NoteSynthVoicing } from '@audio/synths/types';
import { NoteSynthVoicing as NoteSynthVoicingSettings } from '@audio/voicing/note-synth-voicing.const';
import {
  OscillatorTypeValues,
  type OscillatorType,
} from '@audio/voicing/oscillator-types.const';
import { setNoteSynthVoicing, useStore } from '@state/store';
import { Section } from '@ui/synth-panel/Section';
import { Slider } from '@ui/synth-panel/Slider';
import { SliderRow } from '@ui/synth-panel/SliderRow';
import {
  formatHz,
  formatNormal,
  formatSeconds,
  mapCrushDepthRangePosition,
  unmapCrushDepthRangeValue,
} from '@ui/synth-panel/slider-utils';

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
          <For each={OscillatorTypeValues}>
            {(oscillatorType) => (
              <option value={oscillatorType}>{oscillatorType}</option>
            )}
          </For>
        </select>
      </label>

      <SliderRow>
        <Slider
          label="A"
          min={NoteSynthVoicingSettings.attack}
          max={NoteSynthVoicingSettings.attack}
          curve="exponential"
          format={formatSeconds}
          value={synth().attack}
          onInput={(value) => setNumber('attack', value)}
        />
        <Slider
          label="D"
          min={NoteSynthVoicingSettings.decay}
          max={NoteSynthVoicingSettings.decay}
          curve="exponential"
          format={formatSeconds}
          value={synth().decay}
          onInput={(value) => setNumber('decay', value)}
        />
        <Slider
          label="S"
          min={NoteSynthVoicingSettings.sustain.min}
          max={NoteSynthVoicingSettings.sustain.max}
          format={formatNormal}
          value={synth().sustain}
          onInput={(value) => setNumber('sustain', value)}
        />
        <Slider
          label="R"
          min={NoteSynthVoicingSettings.release.min}
          max={NoteSynthVoicingSettings.release.max}
          curve="exponential"
          format={formatSeconds}
          value={synth().release}
          onInput={(value) => setNumber('release', value)}
        />
        <Slider
          label="Freq"
          min={NoteSynthVoicingSettings.filterFrequency.min}
          max={NoteSynthVoicingSettings.filterFrequency.max}
          curve="exponential"
          format={formatHz}
          snap={Math.round}
          value={synth().filterFrequency}
          onInput={(value) => setNumber('filterFrequency', value)}
        />
        <Slider
          label="Reso"
          min={NoteSynthVoicingSettings.filterResonance.min}
          max={NoteSynthVoicingSettings.filterResonance.max}
          curve="exponential"
          format={(value) => value.toFixed(1)}
          value={synth().filterResonance}
          onInput={(value) => setNumber('filterResonance', value)}
        />
        <Slider
          label="Bits"
          min={NoteSynthVoicingSettings.bitCrusherBits.min}
          max={NoteSynthVoicingSettings.bitCrusherBits.max}
          format={(value) => String(value)}
          snap={Math.round}
          value={synth().bitCrusherBits}
          onInput={(value) => setNumber('bitCrusherBits', value)}
        />
        <Slider
          label="Depth"
          min={NoteSynthVoicingSettings.bitCrusherDepth.min}
          max={NoteSynthVoicingSettings.bitCrusherDepth.max}
          format={(value) => value.toFixed(4)}
          mapPositionToValue={(position) =>
            mapCrushDepthRangePosition(
              position,
              NoteSynthVoicingSettings.bitCrusherDepth.min,
              NoteSynthVoicingSettings.bitCrusherDepth.max,
            )
          }
          unmapValueToPosition={(value) =>
            unmapCrushDepthRangeValue(
              value,
              NoteSynthVoicingSettings.bitCrusherDepth.min,
              NoteSynthVoicingSettings.bitCrusherDepth.max,
            )
          }
          value={synth().bitCrusherDepth}
          onInput={(value) => setNumber('bitCrusherDepth', value)}
        />
      </SliderRow>
    </Section>
  );
};
