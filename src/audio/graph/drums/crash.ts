import * as Tone from 'tone';

import type { DrumVoiceState } from '../../../state/store';
import { createLoFiCrusher } from '../loFiCrusher';
import { clamp, type DrumVoiceInstance } from './shared';

export const createCrashVoice = (state: DrumVoiceState): DrumVoiceInstance => {
  const noise = new Tone.Noise('white').start();
  const envelope = new Tone.AmplitudeEnvelope({
    attack: 0.001,
    decay: state.decay,
    sustain: 0,
    release: state.release,
  });
  const filter = new Tone.Filter(state.filterFrequency, 'highpass');
  const crusher = createLoFiCrusher({
    bits: state.bitCrusherBits,
    depth: state.bitCrusherDepth,
  });
  const output = new Tone.Gain(1);

  filter.Q.value = state.filterResonance;
  noise.chain(envelope, filter, crusher.input);
  crusher.output.connect(output);

  return {
    output,
    trigger: (time, intensity) => {
      envelope.triggerAttackRelease('16n', time, clamp(intensity, 0, 1));
    },
    update: (nextState) => {
      envelope.decay = nextState.decay;
      envelope.release = nextState.release;
      filter.frequency.value = nextState.filterFrequency;
      filter.Q.value = nextState.filterResonance;
      crusher.update({
        bits: nextState.bitCrusherBits,
        depth: nextState.bitCrusherDepth,
      });
    },
    dispose: () => {
      noise.dispose();
      envelope.dispose();
      filter.dispose();
      crusher.dispose();
      output.dispose();
    },
  };
};
