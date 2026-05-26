import { Scale } from 'tonal';
import type { NoteName } from 'tonal';

export type ScaleName = ReturnType<typeof Scale.names>[number];

export interface CustomScale {
  name: ScaleName;
  notes: NoteName[];
  weight: number;
}

export interface TrackDna {
  rootNote: NoteName;
  scaleName: ScaleName;
  scaleNotes: NoteName[];
  bpm: number;
  syncopation: number;
  density: number;
  intensity: number;
  variationBias: number;
  melodicRange: number;
  bassRange: number;
}
