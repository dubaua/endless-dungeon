import type * as Tone from 'tone';

import type { DrumVoicing } from '../../../sequencer';

export interface DrumVoiceInstance<TVoicing extends DrumVoicing = DrumVoicing> {
  output: Tone.Gain;
  trigger: (time: Tone.Unit.Time, intensity: number) => void;
  choke?: (time: Tone.Unit.Time) => void;
  update: (voicing: TVoicing) => void;
}

export interface DrumVoiceRuntimeInstance {
  output: Tone.Gain;
  trigger: (time: Tone.Unit.Time, intensity: number) => void;
  choke?: (time: Tone.Unit.Time) => void;
  update: (voicing: DrumVoicing) => void;
}

export const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

export const lerp = (min: number, max: number, amount: number): number =>
  min + (max - min) * clamp(amount, 0, 1);
