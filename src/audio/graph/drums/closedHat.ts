import * as Tone from 'tone';

import type { ClosedHatVoicing } from '../../synths/types';
import { createLoFiCrusher } from '../loFiCrusher';
import { type DrumVoiceInstance } from './shared';

export const CLOSED_HAT_DECAY_MIN = 0.02;
export const CLOSED_HAT_DECAY_MAX = 0.15;
export const CLOSED_HAT_BITS_MIN = 1;
export const CLOSED_HAT_BITS_MAX = 4;
export const CLOSED_HAT_DEPTH_MIN = 0.013;
export const CLOSED_HAT_DEPTH_MAX = 0.055;
export const CLOSED_HAT_FILTER_FREQUENCY_MIN = 2500;
export const CLOSED_HAT_FILTER_FREQUENCY_MAX = 10000;
export const CLOSED_HAT_FILTER_RESONANCE_MIN = 0.1;
export const CLOSED_HAT_FILTER_RESONANCE_MAX = 4;

export const createClosedHatVoice = (
  voicing: ClosedHatVoicing,
): DrumVoiceInstance<ClosedHatVoicing> => {
  const noise = new Tone.Noise('white').start();
  const envelope = new Tone.AmplitudeEnvelope({
    attack: 0.001,
    decay: voicing.decay,
    sustain: 0,
    release: 0.001,
  });
  const filter = new Tone.Filter(voicing.filterFrequency, 'highpass');
  const crusher = createLoFiCrusher({
    bits: voicing.bitCrusherBits,
    depth: voicing.bitCrusherDepth,
  });
  const output = new Tone.Gain(0.75);

  filter.Q.value = voicing.filterResonance;
  noise.chain(envelope, filter, crusher.input);
  crusher.output.connect(output);

  return {
    output,
    trigger: (time, intensity) => {
      envelope.triggerAttackRelease(voicing.decay, time, intensity);
    },
    update: (nextVoicing) => {
      envelope.decay = nextVoicing.decay;
      filter.frequency.value = nextVoicing.filterFrequency;
      filter.Q.value = nextVoicing.filterResonance;
      crusher.update({
        bits: nextVoicing.bitCrusherBits,
        depth: nextVoicing.bitCrusherDepth,
      });
    },
  };
};
