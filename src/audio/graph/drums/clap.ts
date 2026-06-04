import * as Tone from 'tone';

import type { ClapVoicing } from '../../synths/types';
import { createLoFiCrusher } from '../loFiCrusher';
import type { DrumVoiceInstance } from './shared';

export const createClapVoice = (voicing: ClapVoicing): DrumVoiceInstance<ClapVoicing> => {
  let { decay } = voicing;
  let burstCount = voicing.burstCount;
  let burstSpread = voicing.burstSpread;
  let bits = voicing.bitCrusherBits;
  let depth = voicing.bitCrusherDepth;
  const noise = new Tone.Noise('white').start();
  const burstEnvelope = new Tone.AmplitudeEnvelope({
    attack: 0.001,
    decay: 0.012,
    sustain: 0,
    release: 0.006,
  });
  const tailEnvelope = new Tone.AmplitudeEnvelope({
    attack: 0.001,
    decay,
    sustain: 0,
    release: 0.5,
  });
  const burstGain = new Tone.Gain(1.6);
  const tailGain = new Tone.Gain(0.65);
  const filter = new Tone.Filter(1700, 'bandpass');
  const drive = new Tone.WaveShaper((value) => Math.tanh(value * 3.5), 1024);
  const crusher = createLoFiCrusher({
    bits,
    depth,
  });
  const output = new Tone.Gain(1.35);

  filter.Q.value = 1.8;
  noise.chain(burstEnvelope, burstGain, filter);
  noise.chain(tailEnvelope, tailGain, filter);
  filter.chain(drive, crusher.input);
  crusher.output.connect(output);

  return {
    output,
    trigger: (time, intensity) => {
      const gain = Math.sqrt(intensity);
      const count = Math.max(3, Math.min(5, Math.round(burstCount)));
      const spread = Math.max(0.02, Math.min(0.04, burstSpread));

      burstEnvelope.decay = 0.009 + spread / 10;
      tailEnvelope.decay = decay;

      for (let index = 0; index < count; index += 1) {
        const offset = count === 1 ? 0 : (spread * index) / (count - 1);
        burstEnvelope.triggerAttackRelease(0.006 + spread / 8, time + offset, gain);
      }

      tailEnvelope.triggerAttackRelease(decay, time + spread, gain);
    },
    update: (nextVoicing) => {
      decay = nextVoicing.decay;
      burstCount = nextVoicing.burstCount;
      burstSpread = nextVoicing.burstSpread;
      tailEnvelope.decay = decay;
      bits = nextVoicing.bitCrusherBits;
      depth = nextVoicing.bitCrusherDepth;
      crusher.update({
        bits,
        depth,
      });
    },
  };
};
