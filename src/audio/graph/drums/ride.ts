import * as Tone from 'tone';

import type { RideVoicing } from '../../synths/types';
import { createLoFiCrusher } from '../loFiCrusher';
import { clamp, type DrumVoiceInstance } from './shared';

export const RIDE_DECAY_MIN = 0.2;
export const RIDE_DECAY_MAX = 1.5;
export const RIDE_RELEASE_MIN = 0.05;
export const RIDE_RELEASE_MAX = 1.5;
export const RIDE_BITS_MIN = 2;
export const RIDE_BITS_MAX = 4;
export const RIDE_DEPTH_MIN = 0.01;
export const RIDE_DEPTH_MAX = 0.15;
export const RIDE_FILTER_FREQUENCY_MIN = 1200;
export const RIDE_FILTER_FREQUENCY_MAX = 10000;
export const RIDE_FILTER_RESONANCE_MIN = 0.1;
export const RIDE_FILTER_RESONANCE_MAX = 4;

export const createRideVoice = (voicing: RideVoicing): DrumVoiceInstance<RideVoicing> => {
  const noise = new Tone.Noise('white').start();
  const envelope = new Tone.AmplitudeEnvelope({
    attack: 0.001,
    decay: voicing.decay,
    sustain: 0,
    release: voicing.release,
  });
  const filter = new Tone.Filter(voicing.filterFrequency, 'highpass');
  const crusher = createLoFiCrusher({
    bits: voicing.bitCrusherBits,
    depth: voicing.bitCrusherDepth,
  });
  const output = new Tone.Gain(0.5);

  filter.Q.value = voicing.filterResonance;
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
      filter.frequency.value = nextVoicing.filterFrequency;
      filter.Q.value = nextVoicing.filterResonance;
      crusher.update({
        bits: nextVoicing.bitCrusherBits,
        depth: nextVoicing.bitCrusherDepth,
      });
    },
  };
};
