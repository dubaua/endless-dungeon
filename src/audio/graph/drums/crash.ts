import * as Tone from 'tone';

import type { CrashVoicing } from '@audio/synths/types';
import {
  CrashVoicing as CrashVoicingSettings,
  CymbalVoicing as CymbalVoicingSettings,
} from '@audio/voicing/drum-voicing.const';
import { createLoFiCrusher } from '@audio/graph/loFiCrusher';
import { scale } from '@utils/scale';
import { clamp, getBpmScaledDecay, type DrumVoiceInstance } from '@audio/graph/drums/shared';

const BitCrusherDepthAmp = 1.75;
const LimiterThreshold = -1;

export const createCrashVoice = (
  voicing: CrashVoicing,
  bpm: number,
): DrumVoiceInstance<CrashVoicing> => {
  let scaledDecay = getBpmScaledDecay(voicing.decay, bpm, CrashVoicingSettings.decay);
  const noise = new Tone.Noise('white').start();
  const envelope = new Tone.AmplitudeEnvelope({
    attack: 0.001,
    decay: scaledDecay,
    sustain: 0,
    release: voicing.release,
  });
  const filter = new Tone.Filter(voicing.filterFrequency, 'highpass');
  const crusher = createLoFiCrusher({
    bits: voicing.bitCrusherBits,
    depth: voicing.bitCrusherDepth,
  });
  const { min, max } = CymbalVoicingSettings.bitCrusherDepth;
  const amplifier = new Tone.Gain(scale(voicing.bitCrusherDepth, min, max, 1, BitCrusherDepthAmp));
  const limiter = new Tone.Limiter(LimiterThreshold);
  const output = new Tone.Gain(0.5);

  filter.Q.value = voicing.filterResonance;
  noise.chain(envelope, filter, crusher.input);
  crusher.output.chain(amplifier, limiter, output);

  return {
    output,
    trigger: (time, intensity) => {
      envelope.triggerAttackRelease('16n', time, clamp(intensity, 0, 1));
    },
    update: (nextVoicing, bpm) => {
      scaledDecay = getBpmScaledDecay(nextVoicing.decay, bpm, CrashVoicingSettings.decay);
      envelope.decay = scaledDecay;
      envelope.release = nextVoicing.release;
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
