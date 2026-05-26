import * as Tone from 'tone';

import type { SnareVoicing } from '../../../sequencer';
import { createLoFiCrusher } from '../loFiCrusher';
import type { DrumVoiceInstance } from './shared';

export const SNARE_DECAY_MIN = 0.08;
export const SNARE_DECAY_MAX = 0.6;
export const SNARE_BITS_MIN = 2;
export const SNARE_BITS_MAX = 4;
export const SNARE_DEPTH_MIN = 0.01;
export const SNARE_DEPTH_MAX = 0.1;
const SNARE_FILTER_FREQUENCY = 450;
const SNARE_FILTER_RESONANCE = 0.2;

export const createSnareVoice = (voicing: SnareVoicing): DrumVoiceInstance<SnareVoicing> => {
  let { decay } = voicing;
  let bits = voicing.bitCrusherBits;
  let depth = voicing.bitCrusherDepth;
  const noise = new Tone.Noise('white').start();
  const envelope = new Tone.AmplitudeEnvelope({
    attack: 0.001,
    decay,
    sustain: 1,
    release: 0.2,
  });
  const filter = new Tone.Filter(SNARE_FILTER_FREQUENCY, 'bandpass');
  const crusher = createLoFiCrusher({
    bits,
    depth,
  });
  const output = new Tone.Gain(1);

  filter.Q.value = SNARE_FILTER_RESONANCE;
  noise.chain(envelope, filter, crusher.input);
  crusher.output.connect(output);

  return {
    output,
    trigger: (time, intensity) => {
      envelope.decay = decay;
      envelope.triggerAttackRelease(decay * intensity, time, Math.sqrt(intensity));
    },
    update: (nextVoicing) => {
      decay = nextVoicing.decay;
      envelope.decay = decay;
      bits = nextVoicing.bitCrusherBits;
      depth = nextVoicing.bitCrusherDepth;
      crusher.update({
        bits,
        depth,
      });
    },
  };
};
