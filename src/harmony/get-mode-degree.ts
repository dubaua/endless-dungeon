import type { Mode, ModeDegree } from '@harmony/mode.type';

/**
 * Wraps an absolute degree into the mode degree range.
 * Lets melody code move across octaves while mode logic still talks in local degrees.
 */
export const getModeDegreeIndex = (degree: number, mode: Mode): number => {
  return ((degree % mode.degrees.length) + mode.degrees.length) % mode.degrees.length;
};

/**
 * Returns the octave offset for an absolute degree.
 * Keeps octave movement separate from the mode degree graph.
 */
export const getModeDegreeOctave = (degree: number, mode: Mode): number => {
  return Math.floor(degree / mode.degrees.length);
};

/**
 * Returns the weighted/function metadata for an absolute degree.
 * Lets generators ask what a degree means without knowing the mode shape.
 */
export const getModeDegree = (degree: number, mode: Mode): ModeDegree => {
  const degreeIndex = getModeDegreeIndex(degree, mode);
  const modeDegree = mode.degrees.find((item) => item.degree === degreeIndex);

  if (!modeDegree) {
    throw new Error(`Mode ${mode.name} does not describe degree ${degreeIndex}`);
  }

  return modeDegree;
};
