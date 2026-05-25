export type ClipType = 'midi';

export type ClipView = 'pianoRoll' | 'drumGrid';

export type TrackType = 'pianoRoll' | 'drumKit';

export interface NoteLane {
  note: number;
  label: string;
}

export interface Note {
  id: string;
  note: number;
  description: string;
  startTick: number;
  durationTicks: number;
  velocity: number;
}

export interface Clip {
  id: string;
  type: ClipType;
  view: ClipView;
  startTick: number;
  lengthTicks: number;
  notes: Note[];
}

export interface Track {
  id: string;
  name: string;
  type: TrackType;
  clips: Clip[];
  noteLanes?: NoteLane[];
}

export interface SequencerState {
  tracks: Track[];
}
