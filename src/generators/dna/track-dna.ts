import { Scale } from 'tonal';
import type { NoteName } from 'tonal';

import type { VoiceSettings } from '../voicing/generate-synth-voicing';

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
  bodyDrumPattern: string;
  intensity: number;
  variationBias: number; // if low 1 and 3 bar are same
  noteLengthVariationBias: number;
  noteGapBias: number;
  melodyJumpBias: number; // how often melody jumps away from the current curve
  melodyBreakPhaseResetBias: number; // resets phase to the base position for the current bar
  melodyBreakPhaseShiftBias: number; // when melody break occurs it also can shift its phase
  melodySpeedBias: number; // basically 0..1, but internally varies from 12 to 48 steps
  melodySpeedChangeBias: number;
  melodicRange: number;
  absoluteRange: number;
  bassRange: number;
  voice: VoiceSettings;
}
