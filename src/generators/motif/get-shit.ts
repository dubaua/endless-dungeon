import { clamp } from '../../utils/clamp';
import { getRandomFloat } from '../../utils/get-random-float';
import { normalizePhase } from '../../utils/normalize-phase';
import { RandomSource } from '../../utils/pick-weighted';
import { takeRandom } from '../../utils/take-random';

interface CurveYShiftRange {
  min: number;
  max: number;
}

interface PhaseAndCurveYShift {
  phase: number;
  curveYShift: number;
}

const getCurveYShiftRangeForDegree = (
  degreeFloat: number,
  absoluteRatio: number,
): CurveYShiftRange => {
  const minShiftForFullCycle = 1 - absoluteRatio;
  const maxShiftForFullCycle = absoluteRatio - 1;

  const minShiftForDegree = degreeFloat - 1;
  const maxShiftForDegree = degreeFloat + 1;

  const min = Math.max(minShiftForFullCycle, minShiftForDegree);
  const max = Math.min(maxShiftForFullCycle, maxShiftForDegree);

  return { min, max };
};

/**
 * Expects absoluteRatio >= 1 and degreeFloat within [-absoluteRatio, absoluteRatio].
 */
export const getPhaseAndCurveYShiftForDegree = (
  degreeFloat: number,
  absoluteRatio: number,
  random: RandomSource,
): PhaseAndCurveYShift => {
  const shiftRange = getCurveYShiftRangeForDegree(degreeFloat, absoluteRatio);

  const curveYShift = getRandomFloat(shiftRange.min, shiftRange.max, random);
  const sineValue = clamp(degreeFloat - curveYShift, -1, 1);
  const phase = Math.asin(sineValue);

  const phases = [normalizePhase(phase), normalizePhase(Math.PI - phase)];

  return {
    phase: takeRandom(phases, random),
    curveYShift,
  };
};
