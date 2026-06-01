import type { GenerateMotifBarOptions, MotifBar, MotifStepEvent } from './motif';
import type { RandomSource } from '../../utils/pick-weighted';
import { getRandomFloat } from '../../utils/get-random-float';
import { scale } from '../../utils/scale';
import { shouldChangeMotifSpeed } from './should-change-motif-speed';
import { shouldResetMotifPhase } from './should-reset-motif-phase';
import {
  MinMotifShiftSteps,
  MaxMotifShiftSteps,
  shouldShiftMotifPhase,
} from './should-shift-motif-phase';
import { getPhaseAndCurveYShiftForDegree } from './get-shit';
import { getMotifJumpRange } from './jump';
import { shouldJumpMotif } from './should-jump-motif';
import { FullCycle } from '../../utils/full-cycle.const';

const MinCurveCycleSteps = 7;
const MaxCurveCycleSteps = 15;

/**
 * Expects absoluteRange >= melodicRange and degrees within [-absoluteRange, absoluteRange].
 */
export function generateMotifBar(
  {
    startDegree,
    melodyJumpBias,
    melodyBreakPhaseResetBias,
    melodyBreakPhaseShiftBias,
    melodySpeedBias,
    melodySpeedChangeBias,
    melodicRange,
    absoluteRange,
  }: GenerateMotifBarOptions,
  length: number,
  random: RandomSource = Math.random,
): MotifBar {
  if (length <= 0) {
    return { steps: [], stepEvents: [] };
  }

  const steps = [];
  const stepEvents: MotifStepEvent[][] = [];

  const absoluteRatio = absoluteRange / melodicRange;
  const startDegreeFloat =
    startDegree !== undefined
      ? startDegree / melodicRange
      : getRandomFloat(-absoluteRatio, absoluteRatio, random);

  let { phase, curveYShift } = getPhaseAndCurveYShiftForDegree(
    startDegreeFloat,
    absoluteRatio,
    random,
  );

  let anchorPhase = phase;
  let direction = 0;

  let phaseStep = FullCycle / scale(melodySpeedBias, 0, 1, MaxCurveCycleSteps, MinCurveCycleSteps);

  let previousDegreeFloat = Math.sin(phase) + curveYShift;

  for (let index = 0; index < length; index++) {
    const events: MotifStepEvent[] = [];
    let degreeFloat = Math.sin(phase) + curveYShift;
    let didJump = false;

    if (index > 0) {
      direction = Math.sign(degreeFloat - previousDegreeFloat);
    }

    if (index > 0 && shouldJumpMotif(melodyJumpBias, random)) {
      const jumpRange = getMotifJumpRange(
        previousDegreeFloat,
        direction,
        1 / melodicRange,
        absoluteRatio,
      );

      if (jumpRange !== null) {
        const jumpDegreeFloat = getRandomFloat(jumpRange.min, jumpRange.max, random);
        const phaseAndCurveYShift = getPhaseAndCurveYShiftForDegree(
          jumpDegreeFloat,
          absoluteRatio,
          random,
        );

        phase = phaseAndCurveYShift.phase;
        curveYShift = phaseAndCurveYShift.curveYShift;
        events.push(jumpDegreeFloat > degreeFloat ? 'jump-up' : 'jump-down');
        degreeFloat = Math.sin(phase) + curveYShift;
        didJump = true;
      }
    }

    if (
      !didJump &&
      index > 0 &&
      shouldResetMotifPhase(melodyBreakPhaseResetBias, melodySpeedBias, random)
    ) {
      phase = anchorPhase;
      let event: MotifStepEvent = 'phase-reset';

      if (
        melodicRange >= MinMotifShiftSteps &&
        shouldShiftMotifPhase(melodyBreakPhaseShiftBias, random)
      ) {
        const resetPhase = phase;
        const point = Math.sin(phase);

        let attempts = 0;
        let shiftInDegrees = 0;

        do {
          phase += phaseStep;
          shiftInDegrees = Math.abs(Math.sin(phase) - point) * melodicRange;
          attempts += 1;
        } while (
          (shiftInDegrees < MinMotifShiftSteps || shiftInDegrees > MaxMotifShiftSteps) &&
          attempts < MaxCurveCycleSteps
        );

        if (shiftInDegrees < MinMotifShiftSteps || shiftInDegrees > MaxMotifShiftSteps) {
          phase = resetPhase;
        } else {
          anchorPhase = phase;
          event = 'phase-shift';
        }
      }

      events.push(event);
      degreeFloat = Math.sin(phase) + curveYShift;
    }

    if (index > 0 && shouldChangeMotifSpeed(melodySpeedChangeBias, random)) {
      phaseStep = FullCycle / scale(random(), 0, 1, MaxCurveCycleSteps, MinCurveCycleSteps);
      events.push('speed-change');
    }

    const step = Math.round(degreeFloat * melodicRange);

    steps.push(step);
    stepEvents.push(events);

    previousDegreeFloat = degreeFloat;
    phase += phaseStep;
  }

  return { steps, stepEvents };
}
