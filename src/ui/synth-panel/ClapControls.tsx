import type { Component } from 'solid-js';

import type { ClapVoicing } from '../../audio/synths/types';
import { ClapVoicing as ClapVoicingSettings } from '../../audio/voicing/drum-voicing.const';
import { Section } from './Section';
import { Slider } from './Slider';
import { SliderRow } from './SliderRow';
import {
  formatSeconds,
  mapCrushDepthRangePosition,
  unmapCrushDepthRangeValue,
  type DrumNumberKey,
} from './slider-utils';

interface ClapControlsProps {
  clap: ClapVoicing;
  onInput: (key: DrumNumberKey, value: number) => void;
}

export const ClapControls: Component<ClapControlsProps> = (props) => (
  <Section title="Clap">
    <SliderRow>
      <Slider
        label="D"
        min={ClapVoicingSettings.decay.min}
        max={ClapVoicingSettings.decay.max}
        curve="exponential"
        format={formatSeconds}
        value={props.clap.decay}
        onInput={(value) => props.onInput('decay', value)}
      />
      <Slider
        label="Hits"
        min={ClapVoicingSettings.burstCount.min}
        max={ClapVoicingSettings.burstCount.max}
        format={(value) => String(value)}
        snap={Math.round}
        value={props.clap.burstCount}
        onInput={(value) => props.onInput('burstCount', value)}
      />
      <Slider
        label="Spr"
        min={ClapVoicingSettings.burstSpread.min}
        max={ClapVoicingSettings.burstSpread.max}
        curve="exponential"
        format={formatSeconds}
        value={props.clap.burstSpread}
        onInput={(value) => props.onInput('burstSpread', value)}
      />
      <Slider
        label="Bits"
        min={ClapVoicingSettings.bitCrusherBits.min}
        max={ClapVoicingSettings.bitCrusherBits.max}
        format={(value) => String(value)}
        snap={Math.round}
        value={props.clap.bitCrusherBits}
        onInput={(value) => props.onInput('bitCrusherBits', value)}
      />
      <Slider
        label="Depth"
        min={ClapVoicingSettings.bitCrusherDepth.min}
        max={ClapVoicingSettings.bitCrusherDepth.max}
        format={(value) => value.toFixed(4)}
        mapPositionToValue={(position) =>
          mapCrushDepthRangePosition(
            position,
            ClapVoicingSettings.bitCrusherDepth.min,
            ClapVoicingSettings.bitCrusherDepth.max,
          )
        }
        unmapValueToPosition={(value) =>
          unmapCrushDepthRangeValue(
            value,
            ClapVoicingSettings.bitCrusherDepth.min,
            ClapVoicingSettings.bitCrusherDepth.max,
          )
        }
        value={props.clap.bitCrusherDepth}
        onInput={(value) => props.onInput('bitCrusherDepth', value)}
      />
    </SliderRow>
  </Section>
);
