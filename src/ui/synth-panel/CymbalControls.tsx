import type { Component } from 'solid-js';

import type {
  ClosedHatVoicing,
  CrashVoicing,
  OpenHatVoicing,
  RideVoicing,
} from '../../audio/synths/types';
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
          min={0.001}
          max={2}
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
            min={0.001}
            max={4}
            curve="exponential"
            format={formatSeconds}
            value={props.openHat.decay}
            onInput={(value) => props.onOpenHatInput('decay', value)}
          />
          <Slider
            label="R"
            min={0.001}
            max={4}
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
            min={0.001}
            max={5}
            curve="exponential"
            format={formatSeconds}
            value={props.crash.decay}
            onInput={(value) => props.onCrashInput('decay', value)}
          />
          <Slider
            label="R"
            min={0.001}
            max={8}
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
            min={0.001}
            max={3}
            curve="exponential"
            format={formatSeconds}
            value={props.ride.decay}
            onInput={(value) => props.onRideInput('decay', value)}
          />
          <Slider
            label="R"
            min={0.001}
            max={3}
            curve="exponential"
            format={formatSeconds}
            value={props.ride.release}
            onInput={(value) => props.onRideInput('release', value)}
          />
        </SliderRow>
      </Section>
      <Slider
        label="Freq"
        min={800}
        max={12000}
        curve="exponential"
        format={formatHz}
        snap={Math.round}
        value={props.closedHat.filterFrequency}
        onInput={(value) => props.onCommonInput('filterFrequency', value)}
      />
      <Slider
        label="Reso"
        min={0.1}
        max={18}
        curve="exponential"
        format={(value) => value.toFixed(1)}
        value={props.closedHat.filterResonance}
        onInput={(value) => props.onCommonInput('filterResonance', value)}
      />
      <Slider
        label="Bits"
        min={1}
        max={16}
        format={(value) => String(value)}
        snap={Math.round}
        value={props.closedHat.bitCrusherBits}
        onInput={(value) => props.onCommonInput('bitCrusherBits', value)}
      />
      <Slider
        label="Depth"
        min={0}
        max={0.25}
        format={(value) => value.toFixed(4)}
        mapPositionToValue={mapCrushDepthPosition}
        unmapValueToPosition={unmapCrushDepthValue}
        value={props.closedHat.bitCrusherDepth}
        onInput={(value) => props.onCommonInput('bitCrusherDepth', value)}
      />
    </SliderRow>
  </Section>
);
