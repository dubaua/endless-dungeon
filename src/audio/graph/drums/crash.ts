import * as Tone from 'tone';

import type { CrashVoicing } from '../../../sequencer';
import { createLoFiCrusher } from '../loFiCrusher';
import { clamp, type DrumVoiceInstance } from './shared';

export const CRASH_DECAY_MIN = 1;
export const CRASH_DECAY_MAX = 4;
export const CRASH_RELEASE_MIN = 1;
export const CRASH_RELEASE_MAX = 5;
export const CRASH_BITS_MIN = 2;
export const CRASH_BITS_MAX = 4;
export const CRASH_DEPTH_MIN = 0.01;
export const CRASH_DEPTH_MAX = 0.15;
const CRASH_FILTER_FREQUENCY = 3600;
const CRASH_FILTER_RESONANCE = 0.1;

export const createCrashVoice = (voicing: CrashVoicing): DrumVoiceInstance<CrashVoicing> => {
  const noise = new Tone.Noise('white').start();
  const envelope = new Tone.AmplitudeEnvelope({
    attack: 0.001,
    decay: voicing.decay,
    sustain: 0,
    release: voicing.release,
  });
  const filter = new Tone.Filter(CRASH_FILTER_FREQUENCY, 'highpass');
  const crusher = createLoFiCrusher({
    bits: voicing.bitCrusherBits,
    depth: voicing.bitCrusherDepth,
  });
  const output = new Tone.Gain(1);

  filter.Q.value = CRASH_FILTER_RESONANCE;
  noise.chain(envelope, filter, crusher.input);
  crusher.output.connect(output);

  return {
    output,
    trigger: (time, intensity) => {
      envelope.triggerAttackRelease('16n', time, clamp(intensity, 0, 1));
    },
    update: (nextVoicing) => {
      envelope.decay = nextVoicing.decay;
      envelope.release = nextVoicing.release;
      crusher.update({
        bits: nextVoicing.bitCrusherBits,
        depth: nextVoicing.bitCrusherDepth,
      });
    },
  };
};
