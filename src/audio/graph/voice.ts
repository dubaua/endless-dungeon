import * as Tone from 'tone';

import type { NoteSynthVoicing } from '@audio/synths/types';
import { createLoFiCrusher, type LoFiCrusher } from '@audio/graph/loFiCrusher';

const CompressorThreshold = -22;
const CompressorRatio = 3;
const CompressorAttack = 0.004;
const CompressorRelease = 0.12;
const CompressorKnee = 12;

const BitCrusherDepthAmp = 1.45;
const LimiterThreshold = -1;

const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

const getBitCrusherDepthGain = (depth: number): number => {
  return 1 + clamp(depth, 0, 1) * (BitCrusherDepthAmp - 1);
};

export interface VoiceInstance {
  synth: Tone.PolySynth<Tone.Synth>;
  filter: Tone.Filter;
  crusher: LoFiCrusher;
  amplifier: Tone.Gain;
  compressor: Tone.Compressor;
  limiter: Tone.Limiter;
  input: Tone.PolySynth<Tone.Synth>;
  output: Tone.Gain;
  update: (state: NoteSynthVoicing) => void;
  triggerAttackRelease: (frequency: number, durationSeconds: number, time: Tone.Unit.Time) => void;
  dispose: () => void;
}

export const createVoiceInstance = (state: NoteSynthVoicing): VoiceInstance => {
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
  const amplifier = new Tone.Gain(getBitCrusherDepthGain(state.bitCrusherDepth));
  const compressor = new Tone.Compressor({
    threshold: CompressorThreshold,
    ratio: CompressorRatio,
    attack: CompressorAttack,
    release: CompressorRelease,
    knee: CompressorKnee,
  });
  const limiter = new Tone.Limiter(LimiterThreshold);
  const output = new Tone.Gain(1);

  filter.Q.value = state.filterResonance;

  synth.connect(filter);
  filter.connect(crusher.input);
  crusher.output.chain(amplifier, compressor, limiter, output);

  return {
    synth,
    filter,
    crusher,
    amplifier,
    compressor,
    limiter,
    input: synth,
    output,
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
      amplifier.gain.value = getBitCrusherDepthGain(nextState.bitCrusherDepth);

      crusher.update({
        bits: nextState.bitCrusherBits,
        depth: nextState.bitCrusherDepth,
      });
    },
    triggerAttackRelease: (frequency, durationSeconds, time) => {
      synth.triggerAttackRelease(frequency, durationSeconds, time, 1);
    },
    dispose: () => {
      synth.dispose();
      filter.dispose();
      crusher.dispose();
      amplifier.dispose();
      compressor.dispose();
      limiter.dispose();
      output.dispose();
    },
  };
};
