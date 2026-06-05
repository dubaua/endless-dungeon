import * as Tone from 'tone';

import type { OpenHatVoicing } from '../../synths/types';
import {
  CymbalVoicing as CymbalVoicingSettings,
  OpenHatVoicing as OpenHatVoicingSettings,
} from '../../voicing/drum-voicing.const';
import { createLoFiCrusher } from '../loFiCrusher';
import { clamp, getBpmScaledDecay, type DrumVoiceInstance } from './shared';
import { scale } from '../../../utils/scale';

const OPEN_HAT_CHOKE_RELEASE_SECONDS = 0.015;
const BitCrusherDepthAmp = 1.75;
const LimiterThreshold = -1;

export const createOpenHatVoice = (
  voicing: OpenHatVoicing,
  bpm: number,
): DrumVoiceInstance<OpenHatVoicing> => {
  let scaledDecay = getBpmScaledDecay(voicing.decay, bpm, OpenHatVoicingSettings.decay);
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
  const output = new Tone.Gain(1);

  filter.Q.value = voicing.filterResonance;
  noise.chain(envelope, filter, crusher.input);
  crusher.output.chain(amplifier, limiter, output);

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
    update: (nextVoicing, bpm) => {
      scaledDecay = getBpmScaledDecay(nextVoicing.decay, bpm, OpenHatVoicingSettings.decay);
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
