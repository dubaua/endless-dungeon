import type { Mode, ModeIntervalFunctions } from '@harmony/mode.type';

/**
 * Wraps an absolute degree into the mode degree range.
 * Lets melody code move across octaves while mode logic still talks in local degrees.
 */
export const getModeDegreeIndex = (degree: number, mode: Mode): number => {
  return ((degree % mode.intervals.length) + mode.intervals.length) % mode.intervals.length;
};

/**
 * Returns the octave offset for an absolute degree.
 * Keeps octave movement separate from the mode degree graph.
 */
export const getModeDegreeOctave = (degree: number, mode: Mode): number => {
  return Math.floor(degree / mode.intervals.length);
};

/**
 * Returns the weighted/function metadata for an absolute degree.
 * Lets generators ask what a degree means without knowing the mode shape.
 */
export const getModeDegree = (degree: number, mode: Mode): ModeIntervalFunctions => {
  const degreeIndex = getModeDegreeIndex(degree, mode);
  const interval = mode.intervals[degreeIndex];

  if (!interval) {
    throw new Error(`Mode ${mode.name} does not describe degree ${degreeIndex}`);
  }

  return {
    interval,
    functions: mode.intervalFunctions[interval] ?? [],
  };
};
