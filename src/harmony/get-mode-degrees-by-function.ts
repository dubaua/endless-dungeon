import type { ModeDegreeFunction } from '@harmony/mode-degree-function.type';
import type { Mode, ModeDegree } from '@harmony/mode.type';

/**
 * Lists local mode degrees that can express a harmony function.
 * Keeps bar-level harmony functions convertible to concrete motif start degrees.
 */
export const getModeDegreesByFunction = (
  mode: Mode,
  fn: ModeDegreeFunction,
): ModeDegree[] => {
  return mode.degrees.filter((degree) => degree.functions.includes(fn));
};
