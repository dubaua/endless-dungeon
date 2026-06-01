import { MinMotifJumpSteps, MaxMotifJumpSteps } from './should-jump-motif';

interface MotifJumpRange {
  min: number;
  max: number;
}

const getRangeIntersection = (
  min: number,
  max: number,
  limitMin: number,
  limitMax: number,
): MotifJumpRange | null => {
  const rangeMin = Math.max(min, limitMin);
  const rangeMax = Math.min(max, limitMax);

  if (rangeMin > rangeMax) {
    return null;
  }

  return {
    min: rangeMin,
    max: rangeMax,
  };
};

export const getMotifJumpRange = (
  currentDegreeFloat: number,
  direction: number,
  oneDegreeFloat: number,
  absoluteRatio: number,
): MotifJumpRange | null => {
  if (direction === 0) {
    return null;
  }

  const minJump = MinMotifJumpSteps * oneDegreeFloat;
  const maxJump = MaxMotifJumpSteps * oneDegreeFloat;

  const limitMin = -absoluteRatio;
  const limitMax = absoluteRatio;

  if (direction > 0) {
    return getRangeIntersection(
      currentDegreeFloat + minJump,
      currentDegreeFloat + maxJump,
      limitMin,
      limitMax,
    );
  }

  return getRangeIntersection(
    currentDegreeFloat - maxJump,
    currentDegreeFloat - minJump,
    limitMin,
    limitMax,
  );
};
