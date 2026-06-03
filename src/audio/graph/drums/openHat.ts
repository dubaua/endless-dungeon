import * as Tone from 'tone';

import type { OpenHatVoicing } from '../../synths/types';
import { createLoFiCrusher } from '../loFiCrusher';
import { clamp, type DrumVoiceInstance } from './shared';

export const OPEN_HAT_DECAY_MIN = 0.05;
export const OPEN_HAT_DECAY_MAX = 0.5;
export const OPEN_HAT_RELEASE_MIN = 0.05;
export const OPEN_HAT_RELEASE_MAX = 1.2;
export const OPEN_HAT_FILTER_FREQUENCY_MIN = 2500;
export const OPEN_HAT_FILTER_FREQUENCY_MAX = 10000;
export const OPEN_HAT_FILTER_RESONANCE_MIN = 0.1;
export const OPEN_HAT_FILTER_RESONANCE_MAX = 4;
export const OPEN_HAT_BITS_MIN = 1;
export const OPEN_HAT_BITS_MAX = 4;
export const OPEN_HAT_DEPTH_MIN = 0.013;
export const OPEN_HAT_DEPTH_MAX = 0.055;
const OPEN_HAT_CHOKE_RELEASE_SECONDS = 0.015;

export const createOpenHatVoice = (voicing: OpenHatVoicing): DrumVoiceInstance<OpenHatVoicing> => {
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
  const output = new Tone.Gain(0.75);

  filter.Q.value = voicing.filterResonance;
  noise.chain(envelope, filter, crusher.input);
  crusher.output.connect(output);

  return {
    output,
    trigger: (time, intensity) => {
      envelope.triggerAttack(time, clamp(intensity, 0, 1));
    },
    choke: (time) => {
      const previousRelease = envelope.release;

      envelope.release = OPEN_HAT_CHOKE_RELEASE_SECONDS;
      envelope.triggerRelease(time);
      envelope.release = previousRelease;
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
