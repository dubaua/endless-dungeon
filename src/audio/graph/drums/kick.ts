import * as Tone from 'tone';

import type { KickVoicing } from '../../synths/types';
import { createLoFiCrusher } from '../loFiCrusher';
import { clamp, type DrumVoiceInstance } from './shared';

export const createKickVoice = (voicing: KickVoicing): DrumVoiceInstance<KickVoicing> => {
  let currentVoicing = voicing;
  const initialPitchStart = voicing.pitchStart;
  const tone = new Tone.Oscillator(initialPitchStart / 2, 'square').start();
  const toneEnvelope = new Tone.AmplitudeEnvelope({
    attack: 0.001,
    decay: voicing.decay,
    sustain: 0,
    release: 0.001,
  });
  const click = new Tone.Noise('white').start();
  const clickEnvelope = new Tone.AmplitudeEnvelope({
    attack: 0.001,
    decay: voicing.decay / 12,
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
  const amplifier = new Tone.Gain(1);
  const limiter = new Tone.Limiter(-1);
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
      const pitchDropSeconds = currentVoicing.decay / 6;
      const clickDecaySeconds = currentVoicing.decay / 12;

      tone.frequency.cancelScheduledValues(startTime);
      tone.frequency.setValueAtTime(pitchStart, startTime);
      tone.frequency.exponentialRampToValueAtTime(pitchEnd, startTime + pitchDropSeconds);
      clickFilter.frequency.setValueAtTime(pitchStart * 2, startTime);
      clickEnvelope.decay = clickDecaySeconds;
      toneEnvelope.triggerAttackRelease(currentVoicing.decay, time, velocity);
      clickEnvelope.triggerAttackRelease(clickDecaySeconds, time, velocity);
    },
    update: (nextVoicing) => {
      currentVoicing = nextVoicing;
      const pitchStart = nextVoicing.pitchStart;

      toneEnvelope.decay = nextVoicing.decay;
      clickEnvelope.decay = nextVoicing.decay / 12;
      clickFilter.frequency.value = pitchStart * 2;
      filter.frequency.value = nextVoicing.filterFrequency;
      filter.Q.value = nextVoicing.filterResonance;
      crusher.update({
        bits: nextVoicing.bitCrusherBits,
        depth: nextVoicing.bitCrusherDepth,
      });
    },
  };
};
