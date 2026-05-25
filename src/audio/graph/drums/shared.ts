import type * as Tone from 'tone';

import type { DrumVoiceState } from '../../../state/store';

export interface DrumVoiceInstance {
  output: Tone.Gain;
  trigger: (time: Tone.Unit.Time, intensity: number) => void;
  update: (state: DrumVoiceState) => void;
  dispose: () => void;
}

export const clamp = (value: number, min: number, max: number): number => Math.max(min, Math.min(max, value));
