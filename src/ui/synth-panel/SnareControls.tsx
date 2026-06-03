import type { Component } from 'solid-js';

import type { SnareVoicing } from '../../audio/synths/types';
import { Section } from './Section';
import { Slider } from './Slider';
import { SliderRow } from './SliderRow';
import {
  formatSeconds,
  mapCrushDepthPosition,
  unmapCrushDepthValue,
  type DrumNumberKey,
} from './slider-utils';
import {
  SnareDecayMin,
  SnareDecayMax,
  SnareBitsMin,
  SnareBitsMax,
  SnareDepthMin,
  SnareDepthMax,
} from '../../generators/voicing/drums/generate-snare-voicing';

interface SnareControlsProps {
  snare: SnareVoicing;
  onInput: (key: DrumNumberKey, value: number) => void;
}

export const SnareControls: Component<SnareControlsProps> = (props) => (
  <Section title="Snare">
    <SliderRow>
      <Slider
        label="D"
        min={SnareDecayMin}
        max={SnareDecayMax}
        curve="exponential"
        format={formatSeconds}
        value={props.snare.decay}
        onInput={(value) => props.onInput('decay', value)}
      />
      <Slider
        label="Bits"
        min={SnareBitsMin}
        max={SnareBitsMax}
        format={(value) => String(value)}
        snap={Math.round}
        value={props.snare.bitCrusherBits}
        onInput={(value) => props.onInput('bitCrusherBits', value)}
      />
      <Slider
        label="Depth"
        min={SnareDepthMin}
        max={SnareDepthMax}
        format={(value) => value.toFixed(4)}
        mapPositionToValue={mapCrushDepthPosition}
        unmapValueToPosition={unmapCrushDepthValue}
        value={props.snare.bitCrusherDepth}
        onInput={(value) => props.onInput('bitCrusherDepth', value)}
      />
    </SliderRow>
  </Section>
);
