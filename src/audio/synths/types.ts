import type * as Tone from 'tone';

import type { OscillatorType } from '@audio/voicing/oscillator-types.const';

export type DrumSynthId =
  | 'kickPrimary'
  | 'kickSecondary'
  | 'snarePrimary'
  | 'snareSecondary'
  | 'clapPrimary'
  | 'clapSecondary'
  | 'closedHat'
  | 'openHat'
  | 'ride'
  | 'crash';
export type NoteSynthId = 'voice' | 'bass';
export type SynthId = DrumSynthId | NoteSynthId;

export interface KickVoicing {
  decay: number;
  pitchStart: number;
  filterFrequency: number;
  filterResonance: number;
  bitCrusherBits: number;
  bitCrusherDepth: number;
}

export interface SnareVoicing {
  decay: number;
  bitCrusherBits: number;
  bitCrusherDepth: number;
}

export interface ClapVoicing {
  decay: number;
  burstCount: number;
  burstSpread: number;
  bitCrusherBits: number;
  bitCrusherDepth: number;
}

export interface ClosedHatVoicing {
  decay: number;
  filterFrequency: number;
  filterResonance: number;
  bitCrusherBits: number;
  bitCrusherDepth: number;
}

export interface OpenHatVoicing {
  decay: number;
  release: number;
  filterFrequency: number;
  filterResonance: number;
  bitCrusherBits: number;
  bitCrusherDepth: number;
}

export interface CrashVoicing {
  decay: number;
  release: number;
  filterFrequency: number;
  filterResonance: number;
  bitCrusherBits: number;
  bitCrusherDepth: number;
}

export interface RideVoicing {
  decay: number;
  release: number;
  filterFrequency: number;
  filterResonance: number;
  bitCrusherBits: number;
  bitCrusherDepth: number;
}

export type DrumVoicing =
  | KickVoicing
  | SnareVoicing
  | ClapVoicing
  | ClosedHatVoicing
  | OpenHatVoicing
  | CrashVoicing
  | RideVoicing;

export interface NoteSynthVoicing {
  oscillatorType: OscillatorType;
  attack: number;
  decay: number;
  sustain: number;
  release: number;
  filterFrequency: number;
  filterResonance: number;
  bitCrusherBits: number;
  bitCrusherDepth: number;
}

export interface VoicingState {
  drums: Record<DrumSynthId, DrumVoicing>;
  voice: NoteSynthVoicing;
  bass: NoteSynthVoicing;
}

export interface NoteOnEvent {
  synthId: SynthId;
  time: Tone.Unit.Time;
  velocity: number;
  note?: string;
  durationSeconds?: number;
}
