import type * as Tone from 'tone';

export type DrumSynthId = 'kick' | 'snare' | 'closedHat' | 'openHat' | 'crash' | 'ride';
export type NoteSynthId = 'voice' | 'bass';
export type SynthId = DrumSynthId | NoteSynthId;

export type OscillatorType = 'sine' | 'triangle' | 'sawtooth' | 'square';

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
  notes: Record<NoteSynthId, NoteSynthVoicing>;
}

export interface NoteOnEvent {
  synthId: SynthId;
  time: Tone.Unit.Time;
  velocity: number;
  note?: string;
  durationSeconds?: number;
}

export interface NoteOffEvent {
  synthId: SynthId;
  time: Tone.Unit.Time;
  note?: string;
}
