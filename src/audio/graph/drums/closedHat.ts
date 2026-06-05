import * as Tone from 'tone';

import type { ClosedHatVoicing } from '../../synths/types';
import { CymbalVoicing as CymbalVoicingSettings } from '../../voicing/drum-voicing.const';
import { createLoFiCrusher } from '../loFiCrusher';
import { type DrumVoiceInstance } from './shared';
import { scale } from '../../../utils/scale';

const BitCrusherDepthAmp = 1.75;
const LimiterThreshold = -1;

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
  const { min, max } = CymbalVoicingSettings.bitCrusherDepth;
  const amplifier = new Tone.Gain(scale(voicing.bitCrusherDepth, min, max, 1, BitCrusherDepthAmp));
  const limiter = new Tone.Limiter(LimiterThreshold);
  const output = new Tone.Gain(1);

  filter.Q.value = voicing.filterResonance;
  noise.chain(envelope, filter, crusher.input);
  crusher.output.chain(amplifier, limiter, output);

  return {
    output,
    trigger: (time, intensity) => {
      envelope.triggerAttackRelease(voicing.decay, time, intensity);
    },
    update: (nextVoicing) => {
      envelope.decay = nextVoicing.decay;
      filter.frequency.value = nextVoicing.filterFrequency;
      filter.Q.value = nextVoicing.filterResonance;
      amplifier.gain.value = scale(
        nextVoicing.bitCrusherDepth,
        CymbalVoicingSettings.bitCrusherDepth.min,
        CymbalVoicingSettings.bitCrusherDepth.max,
        1,
        BitCrusherDepthAmp,
      );
      crusher.update({
        bits: nextVoicing.bitCrusherBits,
        depth: nextVoicing.bitCrusherDepth,
      });
    },
  };
};
