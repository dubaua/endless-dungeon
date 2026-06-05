import * as Tone from 'tone';

import type { ClosedHatVoicing } from '@audio/synths/types';
import {
  ClosedHatVoicing as ClosedHatVoicingSettings,
  CymbalVoicing as CymbalVoicingSettings,
} from '@audio/voicing/drum-voicing.const';
import { createLoFiCrusher } from '@audio/graph/loFiCrusher';
import { scale } from '@utils/scale';
import { getBpmScaledDecay, type DrumVoiceInstance } from '@audio/graph/drums/shared';

const BitCrusherDepthAmp = 1.75;
const LimiterThreshold = -1;

export const createClosedHatVoice = (
  voicing: ClosedHatVoicing,
  bpm: number,
): DrumVoiceInstance<ClosedHatVoicing> => {
  let scaledDecay = getBpmScaledDecay(voicing.decay, bpm, ClosedHatVoicingSettings.decay);
  const noise = new Tone.Noise('white').start();
  const envelope = new Tone.AmplitudeEnvelope({
    attack: 0.001,
    decay: scaledDecay,
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
      envelope.triggerAttackRelease(scaledDecay, time, intensity);
    },
    update: (nextVoicing, bpm) => {
      scaledDecay = getBpmScaledDecay(nextVoicing.decay, bpm, ClosedHatVoicingSettings.decay);
      envelope.decay = scaledDecay;
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
