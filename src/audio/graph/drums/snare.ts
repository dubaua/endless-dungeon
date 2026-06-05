import * as Tone from 'tone';

import type { SnareVoicing } from '@audio/synths/types';
import { SnareVoicing as SnareVoicingSettings } from '@audio/voicing/drum-voicing.const';
import { createLoFiCrusher } from '@audio/graph/loFiCrusher';
import { scale } from '@utils/scale';
import { getBpmScaledDecay, type DrumVoiceInstance } from '@audio/graph/drums/shared';

const BitCrusherDepthAmp = 1.75;
const LimiterThreshold = -1;

// const SNARE_FILTER_FREQUENCY = 450;
// const SNARE_FILTER_RESONANCE = 0.2;

export const createSnareVoice = (
  voicing: SnareVoicing,
  bpm: number,
): DrumVoiceInstance<SnareVoicing> => {
  let { decay } = voicing;
  let scaledDecay = getBpmScaledDecay(decay, bpm, SnareVoicingSettings.decay);
  let bits = voicing.bitCrusherBits;
  let depth = voicing.bitCrusherDepth;
  const noise = new Tone.Noise('white').start();
  const envelope = new Tone.AmplitudeEnvelope({
    attack: 0.001,
    decay: scaledDecay,
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
      envelope.decay = scaledDecay;
      envelope.triggerAttackRelease(scaledDecay * intensity, time, Math.sqrt(intensity));
    },
    update: (nextVoicing, bpm) => {
      decay = nextVoicing.decay;
      scaledDecay = getBpmScaledDecay(decay, bpm, SnareVoicingSettings.decay);
      envelope.decay = scaledDecay;
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
