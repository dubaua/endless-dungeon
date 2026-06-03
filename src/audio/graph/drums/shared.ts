import type * as Tone from 'tone';

import type { DrumVoicing } from '../../synths/types';
export { clamp } from '../../../utils/clamp';
export { lerp } from '../../../utils/lerp';

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
