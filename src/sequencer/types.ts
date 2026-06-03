import type { DrumSynthId, NoteSynthId, VoicingState } from '../audio/synths/types';
import type { TrackDna } from '../generators/dna/track-dna';
import type { BlockFunction } from '../generators/composition/block-function.type';

export type PatternNote = string | null;
export type PatternStep = readonly [PatternNote, number];

export interface NoteClip {
  id: string;
  synthId: NoteSynthId;
  startTick: number;
  gatePercent: number;
  pattern: PatternStep[];
}

export interface DrumClip {
  id: string;
  synthId: DrumSynthId;
  startBar: number;
  pattern: number[];
}

export interface TrackBlock {
  id: string;
  function: BlockFunction;
  bars: number;
  noteClips: NoteClip[];
  drumClips: DrumClip[];
  voicing: VoicingState;
}

export interface Track {
  id: string;
  dna: TrackDna;
  blocks: TrackBlock[];
}

export interface SequencerState {
  activeTrackId: string;
  activeBlockId: string;
  noteClips: NoteClip[];
  drumClips: DrumClip[];
}
