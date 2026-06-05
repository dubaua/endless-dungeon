import { clamp } from '@utils/clamp';

export const scale = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number => {
  const inputRange = inMax - inMin;

  if (inputRange === 0) {
    throw new Error('Input range must not be zero');
  }

  const clampedValue = clamp(value, Math.min(inMin, inMax), Math.max(inMin, inMax));
  const normalizedValue = (clampedValue - inMin) / inputRange;

  return outMin + normalizedValue * (outMax - outMin);
};
