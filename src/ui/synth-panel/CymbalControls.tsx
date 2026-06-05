import type { Component } from 'solid-js';

import type {
  ClosedHatVoicing,
  CrashVoicing,
  OpenHatVoicing,
  RideVoicing,
} from '@audio/synths/types';
import {
  ClosedHatVoicing as ClosedHatVoicingSettings,
  CrashVoicing as CrashVoicingSettings,
  CymbalVoicing as CymbalVoicingSettings,
  OpenHatVoicing as OpenHatVoicingSettings,
  RideVoicing as RideVoicingSettings,
} from '@audio/voicing/drum-voicing.const';
import { Section } from '@ui/synth-panel/Section';
import { Slider } from '@ui/synth-panel/Slider';
import { SliderRow } from '@ui/synth-panel/SliderRow';
import {
  formatHz,
  formatSeconds,
  mapCrushDepthRangePosition,
  unmapCrushDepthRangeValue,
  type DrumNumberKey,
} from '@ui/synth-panel/slider-utils';

interface CymbalControlsProps {
  closedHat: ClosedHatVoicing;
  crash: CrashVoicing;
  openHat: OpenHatVoicing;
  ride: RideVoicing;
  onClosedHatInput: (key: DrumNumberKey, value: number) => void;
  onCommonInput: (key: DrumNumberKey, value: number) => void;
  onCrashInput: (key: DrumNumberKey, value: number) => void;
  onOpenHatInput: (key: DrumNumberKey, value: number) => void;
  onRideInput: (key: DrumNumberKey, value: number) => void;
}

export const CymbalControls: Component<CymbalControlsProps> = (props) => (
  <Section title="Cymbals">
    <SliderRow>
      <Section title="Cls Hat" tiny>
        <Slider
          label="D"
          min={ClosedHatVoicingSettings.decay.min}
          max={ClosedHatVoicingSettings.decay.max}
          curve="exponential"
          format={formatSeconds}
          value={props.closedHat.decay}
          onInput={(value) => props.onClosedHatInput('decay', value)}
        />
      </Section>
      <Section title="Open Hat" tiny>
        <SliderRow>
          <Slider
            label="D"
            min={OpenHatVoicingSettings.decay.min}
            max={OpenHatVoicingSettings.decay.max}
            curve="exponential"
            format={formatSeconds}
            value={props.openHat.decay}
            onInput={(value) => props.onOpenHatInput('decay', value)}
          />
          <Slider
            label="R"
            min={OpenHatVoicingSettings.release.min}
            max={OpenHatVoicingSettings.release.max}
            curve="exponential"
            format={formatSeconds}
            value={props.openHat.release}
            onInput={(value) => props.onOpenHatInput('release', value)}
          />
        </SliderRow>
      </Section>
      <Section title="Crash" tiny>
        <SliderRow>
          <Slider
            label="D"
            min={CrashVoicingSettings.decay.min}
            max={CrashVoicingSettings.decay.max}
            curve="exponential"
            format={formatSeconds}
            value={props.crash.decay}
            onInput={(value) => props.onCrashInput('decay', value)}
          />
          <Slider
            label="R"
            min={CrashVoicingSettings.release.min}
            max={CrashVoicingSettings.release.max}
            curve="exponential"
            format={formatSeconds}
            value={props.crash.release}
            onInput={(value) => props.onCrashInput('release', value)}
          />
        </SliderRow>
      </Section>
      <Section title="Ride" tiny>
        <SliderRow>
          <Slider
            label="D"
            min={RideVoicingSettings.decay.min}
            max={RideVoicingSettings.decay.max}
            curve="exponential"
            format={formatSeconds}
            value={props.ride.decay}
            onInput={(value) => props.onRideInput('decay', value)}
          />
          <Slider
            label="R"
            min={RideVoicingSettings.release.min}
            max={RideVoicingSettings.release.max}
            curve="exponential"
            format={formatSeconds}
            value={props.ride.release}
            onInput={(value) => props.onRideInput('release', value)}
          />
        </SliderRow>
      </Section>
      <Slider
        label="Freq"
        min={CymbalVoicingSettings.filterFrequency.min}
        max={CymbalVoicingSettings.filterFrequency.max}
        curve="exponential"
        format={formatHz}
        snap={Math.round}
        value={props.closedHat.filterFrequency}
        onInput={(value) => props.onCommonInput('filterFrequency', value)}
      />
      <Slider
        label="Reso"
        min={CymbalVoicingSettings.filterResonance.min}
        max={CymbalVoicingSettings.filterResonance.max}
        curve="exponential"
        format={(value) => value.toFixed(1)}
        value={props.closedHat.filterResonance}
        onInput={(value) => props.onCommonInput('filterResonance', value)}
      />
      <Slider
        label="Bits"
        min={CymbalVoicingSettings.bitCrusherBits.min}
        max={CymbalVoicingSettings.bitCrusherBits.max}
        format={(value) => String(value)}
        snap={Math.round}
        value={props.closedHat.bitCrusherBits}
        onInput={(value) => props.onCommonInput('bitCrusherBits', value)}
      />
      <Slider
        label="Depth"
        min={CymbalVoicingSettings.bitCrusherDepth.min}
        max={CymbalVoicingSettings.bitCrusherDepth.max}
        format={(value) => value.toFixed(4)}
        mapPositionToValue={(position) =>
          mapCrushDepthRangePosition(
            position,
            CymbalVoicingSettings.bitCrusherDepth.min,
            CymbalVoicingSettings.bitCrusherDepth.max,
          )
        }
        unmapValueToPosition={(value) =>
          unmapCrushDepthRangeValue(
            value,
            CymbalVoicingSettings.bitCrusherDepth.min,
            CymbalVoicingSettings.bitCrusherDepth.max,
          )
        }
        value={props.closedHat.bitCrusherDepth}
        onInput={(value) => props.onCommonInput('bitCrusherDepth', value)}
      />
    </SliderRow>
  </Section>
);
