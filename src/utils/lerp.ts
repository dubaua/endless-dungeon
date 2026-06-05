import { clamp } from '@utils/clamp';

export const lerp = (min: number, max: number, amount: number): number => {
  return min + (max - min) * clamp(amount, 0, 1);
};
