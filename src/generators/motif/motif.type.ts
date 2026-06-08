/** Quantized mode degree inside a motif portion. */
export type MotifDegree = number;

/** Raw melodic contour value before harmony quantization. */
export type MotifContourValue = number;

/** Marker explaining why a step changed shape. */
export type MotifStepEvent =
  | 'cadence'
  | 'jump-down'
  | 'jump-up'
  | 'phase-reset'
  | 'phase-shift'
  | 'speed-change';

/** One bar-sized portion of quantized motif degrees. */
export interface MotifBar {
  steps: MotifDegree[];
  stepEvents: MotifStepEvent[][];
}

/** Sequence of motif portions. */
export type Motif = MotifBar[];

/** One bar-sized portion of raw melodic contour values. */
export interface MotifContourBar {
  steps: MotifContourValue[];
  stepEvents: MotifStepEvent[][];
}

/** Sequence of raw motif contour portions. */
export type MotifContour = MotifContourBar[];

/** Controls the shape of generated motif portions. */
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
