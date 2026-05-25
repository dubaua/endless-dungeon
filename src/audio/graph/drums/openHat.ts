import * as Tone from 'tone';

import type { DrumVoiceState } from '../../../state/store';
import { createLoFiCrusher } from '../loFiCrusher';
import { clamp, type DrumVoiceInstance } from './shared';

export const createOpenHatVoice = (state: DrumVoiceState): DrumVoiceInstance => {
  const metal = new Tone.MetalSynth({
    harmonicity: 3.7,
    modulationIndex: 24,
    resonance: Math.min(state.filterFrequency, 7000),
    octaves: 1.2,
    envelope: {
      attack: 0.001,
      decay: state.decay,
      release: state.release,
    },
  });
  const filter = new Tone.Filter(state.filterFrequency, 'highpass');
  const crusher = createLoFiCrusher({
    bits: state.bitCrusherBits,
    depth: state.bitCrusherDepth,
  });
  const output = new Tone.Gain(1);

  metal.frequency.value = 360;
  filter.Q.value = state.filterResonance;
  metal.chain(filter, crusher.input);
  crusher.output.connect(output);

  return {
    output,
    trigger: (time, intensity) => {
      metal.triggerAttackRelease(360, '16n', time, clamp(intensity, 0, 1));
    },
    update: (nextState) => {
      metal.envelope.decay = nextState.decay;
      metal.envelope.release = nextState.release;
      metal.resonance = Math.min(nextState.filterFrequency, 7000);
      filter.frequency.value = nextState.filterFrequency;
      filter.Q.value = nextState.filterResonance;
      crusher.update({
        bits: nextState.bitCrusherBits,
        depth: nextState.bitCrusherDepth,
      });
    },
    dispose: () => {
      metal.dispose();
      filter.dispose();
      crusher.dispose();
      output.dispose();
    },
  };
};
