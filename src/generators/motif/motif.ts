export type MotifDegree = number;

export type MotifStepEvent =
  | 'cadence'
  | 'jump-down'
  | 'jump-up'
  | 'phase-reset'
  | 'phase-shift'
  | 'speed-change';

export interface MotifBar {
  steps: MotifDegree[];
  stepEvents: MotifStepEvent[][];
}

export type Motif = MotifBar[];

export interface GenerateMotifBarOptions {
  startDegree?: MotifDegree;
  melodyJumpBias: number;
  melodyBreakPhaseResetBias: number;
  melodyBreakPhaseShiftBias: number;
  melodySpeedBias: number;
  melodySpeedChangeBias: number;
  melodicRange: number;
  absoluteRange: number;
}
