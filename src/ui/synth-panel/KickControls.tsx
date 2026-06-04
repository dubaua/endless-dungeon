import type { Component } from 'solid-js';

import type { KickVoicing } from '../../audio/synths/types';
import { KickVoicing as KickVoicingSettings } from '../../audio/voicing/drum-voicing.const';
import { Section } from './Section';
import { Slider } from './Slider';
import { SliderRow } from './SliderRow';
import {
  formatHz,
  formatSeconds,
  mapCrushDepthRangePosition,
  unmapCrushDepthRangeValue,
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
        min={KickVoicingSettings.decay.min}
        max={KickVoicingSettings.decay.max}
        curve="exponential"
        format={formatSeconds}
        value={props.kick.decay}
        onInput={(value) => props.onInput('decay', value)}
      />
      <Slider
        label="Freq"
        min={KickVoicingSettings.filterFrequency.min}
        max={KickVoicingSettings.filterFrequency.max}
        curve="exponential"
        format={formatHz}
        snap={Math.round}
        value={props.kick.filterFrequency}
        onInput={(value) => props.onInput('filterFrequency', value)}
      />
      <Slider
        label="Reso"
        min={KickVoicingSettings.filterResonance.min}
        max={KickVoicingSettings.filterResonance.max}
        curve="exponential"
        format={(value) => value.toFixed(1)}
        value={props.kick.filterResonance}
        onInput={(value) => props.onInput('filterResonance', value)}
      />
      <Slider
        label="Bits"
        min={KickVoicingSettings.bitCrusherBits.min}
        max={KickVoicingSettings.bitCrusherBits.max}
        format={(value) => String(value)}
        snap={Math.round}
        value={props.kick.bitCrusherBits}
        onInput={(value) => props.onInput('bitCrusherBits', value)}
      />
      <Slider
        label="Depth"
        min={KickVoicingSettings.bitCrusherDepth.min}
        max={KickVoicingSettings.bitCrusherDepth.max}
        format={(value) => value.toFixed(3)}
        mapPositionToValue={(position) =>
          mapCrushDepthRangePosition(
            position,
            KickVoicingSettings.bitCrusherDepth.min,
            KickVoicingSettings.bitCrusherDepth.max,
          )
        }
        unmapValueToPosition={(value) =>
          unmapCrushDepthRangeValue(
            value,
            KickVoicingSettings.bitCrusherDepth.min,
            KickVoicingSettings.bitCrusherDepth.max,
          )
        }
        value={props.kick.bitCrusherDepth}
        onInput={(value) => props.onInput('bitCrusherDepth', value)}
      />
    </SliderRow>
  </Section>
);
