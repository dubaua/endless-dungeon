import { clamp } from './clamp';

export const createScale = (
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): ((value: number) => number) => {
  const inputRange = inMax - inMin;

  if (inputRange === 0) {
    throw new Error('Input range must not be zero');
  }

  return (value: number): number => {
    const clampedValue = clamp(value, inMin, inMax);
    const normalizedValue = (clampedValue - inMin) / inputRange;

    return outMin + normalizedValue * (outMax - outMin);
  };
};
