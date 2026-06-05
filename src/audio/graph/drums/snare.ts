import * as Tone from 'tone';

import type { SnareVoicing } from '../../synths/types';
import { SnareVoicing as SnareVoicingSettings } from '../../voicing/drum-voicing.const';
import { createLoFiCrusher } from '../loFiCrusher';
import type { DrumVoiceInstance } from './shared';
import { scale } from '../../../utils/scale';

const BitCrusherDepthAmp = 1.75;
const LimiterThreshold = -1;

// const SNARE_FILTER_FREQUENCY = 450;
// const SNARE_FILTER_RESONANCE = 0.2;

export const createSnareVoice = (voicing: SnareVoicing): DrumVoiceInstance<SnareVoicing> => {
  let { decay } = voicing;
  let bits = voicing.bitCrusherBits;
  let depth = voicing.bitCrusherDepth;
  const noise = new Tone.Noise('white').start();
  const envelope = new Tone.AmplitudeEnvelope({
    attack: 0.001,
    decay,
    sustain: 0.7,
    release: 0.02,
  });
  // const filter = new Tone.Filter(SNARE_FILTER_FREQUENCY, 'bandpass');
  const crusher = createLoFiCrusher({
    bits,
    depth,
  });
  const { min, max } = SnareVoicingSettings.bitCrusherDepth;
  const amplifier = new Tone.Gain(scale(depth, min, max, 1, BitCrusherDepthAmp));
  const limiter = new Tone.Limiter(LimiterThreshold);
  const output = new Tone.Gain(1);

  // filter.Q.value = SNARE_FILTER_RESONANCE;
  noise.chain(envelope, /* filter, */ crusher.input);
  crusher.output.chain(amplifier, limiter, output);

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
      amplifier.gain.value = scale(
        depth,
        SnareVoicingSettings.bitCrusherDepth.min,
        SnareVoicingSettings.bitCrusherDepth.max,
        1,
        BitCrusherDepthAmp,
      );
      crusher.update({
        bits,
        depth,
      });
    },
  };
};
