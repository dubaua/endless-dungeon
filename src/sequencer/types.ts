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

export type DrumVoiceKey = 'kick' | 'snare' | 'closedHat' | 'openHat' | 'crash';

export interface DrumChannel {
  id: string;
  name: string;
  voice: DrumVoiceKey;
  outputChannelId: string;
  groupId: string | null;
  pattern: number[];
}

export interface SequencerState {
  tracks: Track[];
  drumChannels: DrumChannel[];
}
