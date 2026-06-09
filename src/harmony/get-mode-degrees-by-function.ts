import type { ModeDegreeFunction } from '@harmony/mode-degree-function.type';
import type { Mode } from '@harmony/mode.type';

/**
 * Lists local mode degrees that can express a harmony function.
 * Keeps bar-level harmony functions convertible to concrete motif start degrees.
 */
export const getModeDegreesByFunction = (
  mode: Mode,
  fn: ModeDegreeFunction,
): number[] => {
  return mode.intervals.reduce<number[]>((degrees, interval, degree) => {
    const functions = mode.intervalFunctions[interval] ?? [];

    if (functions.includes(fn)) {
      degrees.push(degree);
    }

    return degrees;
  }, []);
};
