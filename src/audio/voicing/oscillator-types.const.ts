export const OscillatorTypes = {
  Sine: 'sine',
  Triangle: 'triangle',
  Sawtooth: 'sawtooth',
  Square: 'square',
} as const;

export const OscillatorTypeValues = Object.values(OscillatorTypes);

export type OscillatorType = (typeof OscillatorTypes)[keyof typeof OscillatorTypes];
