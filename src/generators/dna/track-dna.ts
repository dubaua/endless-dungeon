import type { NoteName } from 'tonal';

import type { VoicingState } from '@audio/synths/types';
import type { TrackBlock as TrackCompositionBlock } from '@generators/composition/track-block.interface';
import type { KnownModeName } from '@harmony/modes.const';

export interface TrackDna {
  rootNote: NoteName;
  modeName: KnownModeName;
  bpm: number;
  syncopation: number;
  density: number;
  bodyDrumPattern: string;
  bodyHatPattern: string;
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
  voicing: VoicingState;
  composition: TrackCompositionBlock[];
}
