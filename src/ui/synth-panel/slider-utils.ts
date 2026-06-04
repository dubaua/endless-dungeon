import { clamp } from '../../utils/clamp';

export type SliderCurve = 'linear' | 'exponential';

export type DrumNumberKey =
  | 'decay'
  | 'burstCount'
  | 'burstSpread'
  | 'release'
  | 'filterFrequency'
  | 'filterResonance'
  | 'bitCrusherBits'
  | 'bitCrusherDepth';

export const formatSeconds = (value: number): string => `${value.toFixed(2)}s`;
export const formatNormal = (value: number): string => value.toFixed(2);
export const formatHz = (value: number): string =>
  value < 1000 ? `${Math.round(value)}Hz` : `${(value / 1000).toFixed(2)}kHz`;

export const mapCrushDepthPosition = (position: number): number =>
  0.25 * ((16 ** clamp(position, 0, 1) - 1) / 15);

export const unmapCrushDepthValue = (value: number): number =>
  Math.log((clamp(value, 0, 0.25) / 0.25) * 15 + 1) / Math.log(16);

export const mapCrushDepthRangePosition = (position: number, min: number, max: number): number =>
  min + (max - min) * ((16 ** clamp(position, 0, 1) - 1) / 15);

export const unmapCrushDepthRangeValue = (value: number, min: number, max: number): number =>
  Math.log(((clamp(value, min, max) - min) / (max - min)) * 15 + 1) / Math.log(16);

export const positionToValue = (
  position: number,
  min: number,
  max: number,
  curve: SliderCurve,
): number => {
  if (min === max) {
    return min;
  }

  const clampedPosition = clamp(position, 0, 1);

  if (curve === 'exponential') {
    return min * (max / min) ** clampedPosition;
  }

  return min + (max - min) * clampedPosition;
};

export const valueToPosition = (
  value: number,
  min: number,
  max: number,
  curve: SliderCurve,
): number => {
  if (min === max) {
    return 0;
  }

  const clampedValue = clamp(value, min, max);

  if (curve === 'exponential') {
    return Math.log(clampedValue / min) / Math.log(max / min);
  }

  return (clampedValue - min) / (max - min);
};
