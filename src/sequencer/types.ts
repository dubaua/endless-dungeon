export type TrackType = 'notes' | 'drums';

export type PatternNote = string | null;
export type PatternStep = readonly [PatternNote, number];

export interface Clip {
  id: string;
  startTick: number;
  gatePercent: number;
  pattern: PatternStep[];
}

export interface Track {
  id: string;
  name: string;
  type: TrackType;
  clips: Clip[];
}

export type DrumVoiceKey = 'kick' | 'snare' | 'closedHat' | 'openHat' | 'crash' | 'ride';

export interface KickVoicing {
  decay: number;
  pitchStart: string;
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

export type DrumVoicingKey =
  | 'decay'
  | 'release'
  | 'filterFrequency'
  | 'filterResonance'
  | 'bitCrusherBits'
  | 'bitCrusherDepth';

interface DrumChannelBase<TVoice extends DrumVoiceKey, TVoicing extends DrumVoicing> {
  id: string;
  name: string;
  voice: TVoice;
  outputChannelId: string;
  groupId: string | null;
  voicing: TVoicing;
  pattern: number[];
}

export type KickDrumChannel = DrumChannelBase<'kick', KickVoicing>;
export type SnareDrumChannel = DrumChannelBase<'snare', SnareVoicing>;
export type ClosedHatDrumChannel = DrumChannelBase<'closedHat', ClosedHatVoicing>;
export type OpenHatDrumChannel = DrumChannelBase<'openHat', OpenHatVoicing>;
export type CrashDrumChannel = DrumChannelBase<'crash', CrashVoicing>;
export type RideDrumChannel = DrumChannelBase<'ride', RideVoicing>;

export type DrumChannel =
  | KickDrumChannel
  | SnareDrumChannel
  | ClosedHatDrumChannel
  | OpenHatDrumChannel
  | CrashDrumChannel
  | RideDrumChannel;

export interface SequencerState {
  tracks: Track[];
  drumChannels: DrumChannel[];
}
