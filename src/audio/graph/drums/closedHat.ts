import * as Tone from 'tone';

import type { ClosedHatVoicing } from '../../synths/types';
import { createLoFiCrusher } from '../loFiCrusher';
import { type DrumVoiceInstance } from './shared';

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
  const output = new Tone.Gain(1);

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
