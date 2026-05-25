import * as Tone from 'tone';

import type { SynthState } from '../../state/store';
import { createLoFiCrusher, type LoFiCrusher } from './loFiCrusher';

export interface VoiceInstance {
  synth: Tone.PolySynth<Tone.Synth>;
  filter: Tone.Filter;
  crusher: LoFiCrusher;
  input: Tone.PolySynth<Tone.Synth>;
  output: Tone.Gain;
  update: (state: SynthState) => void;
  triggerAttackRelease: (note: string, durationSeconds: number, time: Tone.Unit.Time, velocity: number) => void;
  dispose: () => void;
}

export const createVoiceInstance = (state: SynthState): VoiceInstance => {
  const synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: {
      type: state.oscillatorType,
    },
    envelope: {
      attack: state.attack,
      decay: state.decay,
      sustain: state.sustain,
      release: state.release,
    },
  });
  const filter = new Tone.Filter(state.filterFrequency, 'lowpass');
  const crusher = createLoFiCrusher({
    bits: state.bitCrusherBits,
    depth: state.bitCrusherDepth,
  });

  filter.Q.value = state.filterResonance;
  synth.connect(filter);
  filter.connect(crusher.input);

  return {
    synth,
    filter,
    crusher,
    input: synth,
    output: crusher.output,
    update: (nextState) => {
      synth.set({
        oscillator: {
          type: nextState.oscillatorType,
        },
        envelope: {
          attack: nextState.attack,
          decay: nextState.decay,
          sustain: nextState.sustain,
          release: nextState.release,
        },
      });
      filter.frequency.value = nextState.filterFrequency;
      filter.Q.value = nextState.filterResonance;
      crusher.update({
        bits: nextState.bitCrusherBits,
        depth: nextState.bitCrusherDepth,
      });
    },
    triggerAttackRelease: (note, durationSeconds, time, velocity) => {
      synth.triggerAttackRelease(note, durationSeconds, time, velocity);
    },
    dispose: () => {
      synth.dispose();
      filter.dispose();
      crusher.dispose();
    },
  };
};
