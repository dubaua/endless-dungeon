import type * as Tone from 'tone';

import type { DrumVoicing } from '@audio/synths/types';
import type { Range } from '@audio/voicing/range.type';
import { clamp } from '@utils/clamp';
import { scale } from '@utils/scale';
export { clamp } from '@utils/clamp';
export { lerp } from '@utils/lerp';

const DecayBaseBpm = 130;
const DecayMinBpm = DecayBaseBpm - 50;
const DecayMaxBpm = DecayBaseBpm + 50;
const DecayMinMultiplier = 0.5;
const DecayMaxMultiplier = 1.5;

export interface DrumVoiceInstance<TVoicing extends DrumVoicing = DrumVoicing> {
  output: Tone.Gain;
  trigger: (time: Tone.Unit.Time, intensity: number) => void;
  choke?: (time: Tone.Unit.Time) => void;
  update: (voicing: TVoicing, bpm: number) => void;
}

export interface DrumVoiceRuntimeInstance {
  output: Tone.Gain;
  trigger: (time: Tone.Unit.Time, intensity: number) => void;
  choke?: (time: Tone.Unit.Time) => void;
  update: (voicing: DrumVoicing, bpm: number) => void;
}

export const getBpmScaledDecay = (decay: number, bpm: number, range: Range): number => {
  return clamp(
    decay * scale(bpm, DecayMinBpm, DecayMaxBpm, DecayMaxMultiplier, DecayMinMultiplier),
    range.min,
    range.max,
  );
};
