import * as Tone from 'tone';

import { clamp } from '../utils/clamp';

const meters = new Map<string, Tone.Meter>();

export interface MeteredMixerChannel {
  input: Tone.Gain;
  meter: Tone.Meter;
  setGain: (volume: number, muted: boolean) => void;
}

const getMixerGain = (volume: number, muted: boolean): number =>
  muted ? 0 : clamp(volume, 0, 1);

export const createMeteredMixerChannel = (
  channelId: string,
  volume: number,
  muted: boolean,
  destination: Tone.InputNode,
): MeteredMixerChannel => {
  const input = new Tone.Gain(getMixerGain(volume, muted));
  const meter = new Tone.Meter({ normalRange: true, smoothing: 0.78 });

  input.connect(meter);
  input.connect(destination);
  meters.set(channelId, meter);

  return {
    input,
    meter,
    setGain: (nextVolume, nextMuted) => {
      input.gain.value = getMixerGain(nextVolume, nextMuted);
    },
  };
};

export const getMixerMeterLevel = (channelId: string): number => {
  const meter = meters.get(channelId);

  if (!meter) {
    return 0;
  }

  const value = meter.getValue();
  const level = Array.isArray(value) ? Math.max(...value) : value;

  return Number.isFinite(level) ? clamp(level, 0, 1) : 0;
};
