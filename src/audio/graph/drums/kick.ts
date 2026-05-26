import * as Tone from 'tone';

import type { KickVoicing } from '../../../sequencer';
import { createLoFiCrusher } from '../loFiCrusher';
import { clamp, type DrumVoiceInstance } from './shared';

export const KICK_DECAY_MIN = 0.3;
export const KICK_DECAY_MAX = 0.5;
export const KICK_FILTER_FREQUENCY_MIN = 60;
export const KICK_FILTER_FREQUENCY_MAX = 220;
export const KICK_FILTER_RESONANCE_MIN = 2;
export const KICK_FILTER_RESONANCE_MAX = 10;
export const KICK_BITS_MIN = 2;
export const KICK_BITS_MAX = 4;
// меньше битность - меньше депт, иначе не слышно
export const KICK_DEPTH_MIN = 0;
export const KICK_DEPTH_MAX = 0.1;

export const createKickVoice = (voicing: KickVoicing): DrumVoiceInstance<KickVoicing> => {
  const noise = new Tone.Noise('white').start();
  const envelope = new Tone.AmplitudeEnvelope({
    attack: 0.001,
    decay: voicing.decay,
    sustain: 1,
    release: 0.001,
  });
  const filter = new Tone.Filter(voicing.filterFrequency, 'lowpass');
  const crusher = createLoFiCrusher({
    bits: voicing.bitCrusherBits,
    depth: voicing.bitCrusherDepth,
  });
  const amplifier = new Tone.Gain(5);
  const limiter = new Tone.Limiter(-1);
  const output = new Tone.Gain(1);

  filter.Q.value = voicing.filterResonance;
  noise.chain(envelope, filter, crusher.input);
  crusher.output.chain(amplifier, limiter, output);

  return {
    output,
    trigger: (time, intensity) => {
      envelope.triggerAttackRelease('16n', time, clamp(intensity, 0, 1));
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
