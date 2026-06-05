import * as Tone from 'tone';

import type { ClapVoicing } from '@audio/synths/types';
import { ClapVoicing as ClapVoicingSettings } from '@audio/voicing/drum-voicing.const';
import { createLoFiCrusher } from '@audio/graph/loFiCrusher';
import { scale } from '@utils/scale';
import { getBpmScaledDecay, type DrumVoiceInstance } from '@audio/graph/drums/shared';

const VolumeMultiplier = 2.5;
const BitCrusherDepthAmp = 1.75;
const LimiterThreshold = -1;

export const createClapVoice = (
  voicing: ClapVoicing,
  bpm: number,
): DrumVoiceInstance<ClapVoicing> => {
  let { decay } = voicing;
  let scaledDecay = getBpmScaledDecay(decay, bpm, ClapVoicingSettings.decay);
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
    decay: scaledDecay,
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

  const { min, max } = ClapVoicingSettings.bitCrusherDepth;
  const amplifier = new Tone.Gain(VolumeMultiplier * scale(depth, min, max, 1, BitCrusherDepthAmp));
  const limiter = new Tone.Limiter(LimiterThreshold);
  const output = new Tone.Gain(1);

  filter.Q.value = 1.8;
  noise.chain(burstEnvelope, burstGain, filter);
  noise.chain(tailEnvelope, tailGain, filter);
  filter.chain(drive, crusher.input);
  crusher.output.chain(amplifier, limiter, output);

  return {
    output,
    trigger: (time, intensity) => {
      const gain = Math.sqrt(intensity);
      const startTime = Tone.Time(time).toSeconds();
      const count = Math.max(3, Math.min(5, Math.round(burstCount)));
      const spread = Math.max(0.02, Math.min(0.04, burstSpread));

      burstEnvelope.decay = 0.009 + spread / 10;
      tailEnvelope.decay = scaledDecay;

      for (let index = 0; index < count; index += 1) {
        const offset = count === 1 ? 0 : (spread * index) / (count - 1);
        burstEnvelope.triggerAttackRelease(0.006 + spread / 8, startTime + offset, gain);
      }

      tailEnvelope.triggerAttackRelease(scaledDecay, startTime + spread, gain);
    },
    update: (nextVoicing, bpm) => {
      decay = nextVoicing.decay;
      scaledDecay = getBpmScaledDecay(decay, bpm, ClapVoicingSettings.decay);
      burstCount = nextVoicing.burstCount;
      burstSpread = nextVoicing.burstSpread;
      tailEnvelope.decay = scaledDecay;
      bits = nextVoicing.bitCrusherBits;
      depth = nextVoicing.bitCrusherDepth;
      amplifier.gain.value =
        VolumeMultiplier *
        scale(
          depth,
          ClapVoicingSettings.bitCrusherDepth.min,
          ClapVoicingSettings.bitCrusherDepth.max,
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
