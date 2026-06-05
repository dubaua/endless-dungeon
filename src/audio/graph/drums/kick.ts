import * as Tone from 'tone';

import type { KickVoicing } from '@audio/synths/types';
import { KickVoicing as KickVoicingSettings } from '@audio/voicing/drum-voicing.const';
import { createLoFiCrusher } from '@audio/graph/loFiCrusher';
import { scale } from '@utils/scale';
import { clamp, getBpmScaledDecay, type DrumVoiceInstance } from '@audio/graph/drums/shared';

const BitCrusherDepthAmp = 1.75;
const LimiterThreshold = -1;

export const createKickVoice = (
  voicing: KickVoicing,
  bpm: number,
): DrumVoiceInstance<KickVoicing> => {
  let currentVoicing = voicing;
  let scaledDecay = getBpmScaledDecay(voicing.decay, bpm, KickVoicingSettings.decay);
  const initialPitchStart = voicing.pitchStart;
  const tone = new Tone.Oscillator(initialPitchStart / 2, 'square').start();
  const toneEnvelope = new Tone.AmplitudeEnvelope({
    attack: 0.001,
    decay: scaledDecay,
    sustain: 0,
    release: 0.001,
  });
  const click = new Tone.Noise('white').start();
  const clickEnvelope = new Tone.AmplitudeEnvelope({
    attack: 0.001,
    decay: scaledDecay / 12,
    sustain: 0,
    release: 0.001,
  });
  const clickFilter = new Tone.Filter(initialPitchStart * 2, 'lowpass');
  const mix = new Tone.Gain(1);
  const filter = new Tone.Filter(voicing.filterFrequency, 'lowpass');
  const crusher = createLoFiCrusher({
    bits: voicing.bitCrusherBits,
    depth: voicing.bitCrusherDepth,
  });
  const { min, max } = KickVoicingSettings.bitCrusherDepth;
  const amplifier = new Tone.Gain(scale(voicing.bitCrusherDepth, min, max, 1, BitCrusherDepthAmp));
  const limiter = new Tone.Limiter(LimiterThreshold);
  const output = new Tone.Gain(1);

  filter.Q.value = voicing.filterResonance;
  tone.chain(toneEnvelope, filter, mix);
  click.chain(clickEnvelope, clickFilter, mix);
  mix.connect(crusher.input);
  crusher.output.chain(amplifier, limiter, output);

  return {
    output,
    trigger: (time, intensity) => {
      const velocity = clamp(intensity, 0, 1);
      const startTime = Tone.Time(time).toSeconds();
      const pitchStart = currentVoicing.pitchStart;
      const pitchEnd = pitchStart / 2;
      const pitchDropSeconds = scaledDecay / 6;
      const clickDecaySeconds = scaledDecay / 12;

      tone.frequency.cancelScheduledValues(startTime);
      tone.frequency.setValueAtTime(pitchStart, startTime);
      tone.frequency.exponentialRampToValueAtTime(pitchEnd, startTime + pitchDropSeconds);
      clickFilter.frequency.setValueAtTime(pitchStart * 2, startTime);
      clickEnvelope.decay = clickDecaySeconds;
      toneEnvelope.triggerAttackRelease(scaledDecay, time, velocity);
      clickEnvelope.triggerAttackRelease(clickDecaySeconds, time, velocity);
    },
    update: (nextVoicing, nextBpm) => {
      currentVoicing = nextVoicing;
      scaledDecay = getBpmScaledDecay(nextVoicing.decay, nextBpm, KickVoicingSettings.decay);
      const pitchStart = nextVoicing.pitchStart;

      toneEnvelope.decay = scaledDecay;
      clickEnvelope.decay = scaledDecay / 12;
      clickFilter.frequency.value = pitchStart * 2;
      filter.frequency.value = nextVoicing.filterFrequency;
      filter.Q.value = nextVoicing.filterResonance;
      amplifier.gain.value = scale(
        nextVoicing.bitCrusherDepth,
        KickVoicingSettings.bitCrusherDepth.min,
        KickVoicingSettings.bitCrusherDepth.max,
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
