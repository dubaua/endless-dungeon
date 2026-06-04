import type { Component } from 'solid-js';

import type { SnareVoicing } from '../../audio/synths/types';
import { SnareVoicing as SnareVoicingSettings } from '../../audio/voicing/drum-voicing.const';
import { Section } from './Section';
import { Slider } from './Slider';
import { SliderRow } from './SliderRow';
import {
  formatSeconds,
  mapCrushDepthRangePosition,
  unmapCrushDepthRangeValue,
  type DrumNumberKey,
} from './slider-utils';

interface SnareControlsProps {
  snare: SnareVoicing;
  onInput: (key: DrumNumberKey, value: number) => void;
}

export const SnareControls: Component<SnareControlsProps> = (props) => (
  <Section title="Snare">
    <SliderRow>
      <Slider
        label="D"
        min={SnareVoicingSettings.decay.min}
        max={SnareVoicingSettings.decay.max}
        curve="exponential"
        format={formatSeconds}
        value={props.snare.decay}
        onInput={(value) => props.onInput('decay', value)}
      />
      <Slider
        label="Bits"
        min={SnareVoicingSettings.bitCrusherBits.min}
        max={SnareVoicingSettings.bitCrusherBits.max}
        format={(value) => String(value)}
        snap={Math.round}
        value={props.snare.bitCrusherBits}
        onInput={(value) => props.onInput('bitCrusherBits', value)}
      />
      <Slider
        label="Depth"
        min={SnareVoicingSettings.bitCrusherDepth.min}
        max={SnareVoicingSettings.bitCrusherDepth.max}
        format={(value) => value.toFixed(4)}
        mapPositionToValue={(position) =>
          mapCrushDepthRangePosition(
            position,
            SnareVoicingSettings.bitCrusherDepth.min,
            SnareVoicingSettings.bitCrusherDepth.max,
          )
        }
        unmapValueToPosition={(value) =>
          unmapCrushDepthRangeValue(
            value,
            SnareVoicingSettings.bitCrusherDepth.min,
            SnareVoicingSettings.bitCrusherDepth.max,
          )
        }
        value={props.snare.bitCrusherDepth}
        onInput={(value) => props.onInput('bitCrusherDepth', value)}
      />
    </SliderRow>
  </Section>
);
