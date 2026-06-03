import type { VoicingState } from './types';

export const InitialVoicing: VoicingState = {
  drums: {
    kick: {
      decay: 0.55,
      pitchStart: 'C2',
      filterFrequency: 120,
      filterResonance: 1,
      bitCrusherBits: 2,
      bitCrusherDepth: 0.05,
    },
    snare: {
      decay: 0.15,
      bitCrusherBits: 2,
      bitCrusherDepth: 0.005,
    },
    closedHat: {
      decay: 0.075,
      filterFrequency: 7500,
      filterResonance: 0.9,
      bitCrusherBits: 3,
      bitCrusherDepth: 0.02,
    },
    openHat: {
      decay: 0.8,
      release: 0.5,
      filterFrequency: 7500,
      filterResonance: 0.9,
      bitCrusherBits: 3,
      bitCrusherDepth: 0.02,
    },
    crash: {
      decay: 1.2,
      release: 5,
      filterFrequency: 7500,
      filterResonance: 0.9,
      bitCrusherBits: 3,
      bitCrusherDepth: 0.02,
    },
    ride: {
      decay: 0.45,
      release: 0.35,
      filterFrequency: 6800,
      filterResonance: 0.8,
      bitCrusherBits: 3,
      bitCrusherDepth: 0.02,
    },
  },
  notes: {
    voice: {
      oscillatorType: 'sawtooth',
      attack: 0.01,
      decay: 0.16,
      sustain: 0.55,
      release: 0.28,
      filterFrequency: 1800,
      filterResonance: 1.2,
      bitCrusherBits: 8,
      bitCrusherDepth: 0.02,
    },
    bass: {
      oscillatorType: 'sawtooth',
      attack: 0.01,
      decay: 0.16,
      sustain: 0.55,
      release: 0.28,
      filterFrequency: 700,
      filterResonance: 1.2,
      bitCrusherBits: 8,
      bitCrusherDepth: 0.02,
    },
  },
};
