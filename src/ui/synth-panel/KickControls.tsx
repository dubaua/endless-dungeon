import type { Component } from 'solid-js';

import type { KickVoicing } from '../../audio/synths/types';
import { Section } from './Section';
import { Slider } from './Slider';
import { SliderRow } from './SliderRow';
import {
  formatHz,
  formatSeconds,
  mapCrushDepthPosition,
  unmapCrushDepthValue,
  type DrumNumberKey,
} from './slider-utils';

interface KickControlsProps {
  kick: KickVoicing;
  onInput: (key: DrumNumberKey, value: number) => void;
}

export const KickControls: Component<KickControlsProps> = (props) => (
  <Section title="Kick">
    <SliderRow>
      <Slider
        label="D"
        min={0.001}
        max={2}
        curve="exponential"
        format={formatSeconds}
        value={props.kick.decay}
        onInput={(value) => props.onInput('decay', value)}
      />
      <Slider
        label="Freq"
        min={40}
        max={300}
        curve="exponential"
        format={formatHz}
        snap={Math.round}
        value={props.kick.filterFrequency}
        onInput={(value) => props.onInput('filterFrequency', value)}
      />
      <Slider
        label="Reso"
        min={0.1}
        max={18}
        curve="exponential"
        format={(value) => value.toFixed(1)}
        value={props.kick.filterResonance}
        onInput={(value) => props.onInput('filterResonance', value)}
      />
      <Slider
        label="Bits"
        min={1}
        max={16}
        format={(value) => String(value)}
        snap={Math.round}
        value={props.kick.bitCrusherBits}
        onInput={(value) => props.onInput('bitCrusherBits', value)}
      />
      <Slider
        label="Depth"
        min={0}
        max={0.25}
        format={(value) => value.toFixed(3)}
        mapPositionToValue={mapCrushDepthPosition}
        unmapValueToPosition={unmapCrushDepthValue}
        value={props.kick.bitCrusherDepth}
        onInput={(value) => props.onInput('bitCrusherDepth', value)}
      />
    </SliderRow>
  </Section>
);
