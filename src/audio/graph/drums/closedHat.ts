import * as Tone from 'tone';

import type { ClosedHatVoicing } from '../../../sequencer';
import { createLoFiCrusher } from '../loFiCrusher';
import { clamp, type DrumVoiceInstance } from './shared';

export const CLOSED_HAT_DECAY_MIN = 0.02;
export const CLOSED_HAT_DECAY_MAX = 0.15;
export const CLOSED_HAT_BITS_MIN = 1;
export const CLOSED_HAT_BITS_MAX = 4;
export const CLOSED_HAT_DEPTH_MIN = 0.013;
export const CLOSED_HAT_DEPTH_MAX = 0.055;
const CLOSED_HAT_FILTER_FREQUENCY = 7200;
const CLOSED_HAT_FILTER_RESONANCE = 0.7;

export const createClosedHatVoice = (
  voicing: ClosedHatVoicing,
): DrumVoiceInstance<ClosedHatVoicing> => {
  const metal = new Tone.MetalSynth({
    harmonicity: 3.7,
    modulationIndex: 24,
    resonance: Math.min(CLOSED_HAT_FILTER_FREQUENCY, 7000),
    octaves: 1.2,
    envelope: {
      attack: 0.001,
      decay: voicing.decay,
      release: 0.001,
    },
  });
  const filter = new Tone.Filter(CLOSED_HAT_FILTER_FREQUENCY, 'highpass');
  const crusher = createLoFiCrusher({
    bits: voicing.bitCrusherBits,
    depth: voicing.bitCrusherDepth,
  });
  const output = new Tone.Gain(1);

  metal.frequency.value = 420;
  filter.Q.value = CLOSED_HAT_FILTER_RESONANCE;
  metal.chain(filter, crusher.input);
  crusher.output.connect(output);

  return {
    output,
    trigger: (time, intensity) => {
      metal.triggerAttackRelease(420, '16n', time, clamp(intensity, 0, 1));
    },
    update: (nextVoicing) => {
      metal.envelope.decay = nextVoicing.decay;
      crusher.update({
        bits: nextVoicing.bitCrusherBits,
        depth: nextVoicing.bitCrusherDepth,
      });
    },
  };
};
